import express from 'express';
import SiteBackend from '../models/SiteBackend.js';
import Website from '../models/Website.js';
import { analyzeAndGenerateBackendSchema } from '../services/agentFlow.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// OWNER ROUTES — Manage site backends
// ==========================================

// GET /api/site-backends/:websiteId — Get a website's backend config
router.get('/:websiteId', auth, async (req, res) => {
    try {
        const website = await Website.findOne({ _id: req.params.websiteId, tenant: req.tenantId });
        if (!website) return res.status(404).json({ success: false, error: 'Website not found' });

        const backend = await SiteBackend.findOne({ website: website._id });
        if (!backend) return res.status(404).json({ success: false, error: 'No backend generated yet' });

        res.json({ success: true, data: backend });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/site-backends/:websiteId/generate — Run smart agent to generate backend
router.post('/:websiteId/generate', auth, async (req, res) => {
    try {
        const website = await Website.findOne({ _id: req.params.websiteId, tenant: req.tenantId });
        if (!website) return res.status(404).json({ success: false, error: 'Website not found' });
        if (!website.generatedHTML) return res.status(400).json({ success: false, error: 'Website has no HTML. Generate the frontend first.' });

        // Create or update the site backend
        let backend = await SiteBackend.findOne({ website: website._id });
        if (!backend) {
            backend = new SiteBackend({ website: website._id, tenant: req.tenantId });
        }

        backend.status = 'generating';
        await backend.save();

        // Run the smart agent — analyze HTML + generate schema
        const schema = await analyzeAndGenerateBackendSchema(website.generatedHTML, website.businessType);

        // Populate with sample data
        const dataMap = {};
        for (const endpoint of schema.endpoints) {
            if (endpoint.method === 'GET' && endpoint.sampleData?.length > 0) {
                const collName = endpoint.path.replace(/^\//, '');
                dataMap[collName] = endpoint.sampleData;
            }
        }

        backend.apiDefinition = schema;
        backend.data = dataMap;
        backend.status = 'active';
        backend.apiBaseUrl = `/api/site-backends/public/${website._id}`;
        backend.lastGenerated = new Date();
        await backend.save();

        res.json({ success: true, data: backend });
    } catch (err) {
        console.error('Backend generation error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/site-backends/:websiteId/data/:collection — Update collection data
router.put('/:websiteId/data/:collection', auth, async (req, res) => {
    try {
        const website = await Website.findOne({ _id: req.params.websiteId, tenant: req.tenantId });
        if (!website) return res.status(404).json({ success: false, error: 'Website not found' });

        const backend = await SiteBackend.findOne({ website: website._id });
        if (!backend) return res.status(404).json({ success: false, error: 'No backend found' });

        if (!backend.data) backend.data = {};
        backend.data[req.params.collection] = req.body.data || [];
        backend.markModified('data');
        await backend.save();

        res.json({ success: true, data: backend.data[req.params.collection] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// PUBLIC API — Site visitors call these
// ==========================================

// GET /api/sites/:websiteId/:endpoint — Public GET data
router.get('/public/:websiteId/:endpoint', async (req, res) => {
    try {
        const backend = await SiteBackend.findOne({ website: req.params.websiteId, status: 'active' });
        if (!backend) return res.status(404).json({ error: 'Site backend not found' });

        const data = (backend.data && backend.data[req.params.endpoint]) || [];
        res.json({ success: true, data, endpoint: req.params.endpoint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/sites/:websiteId/:endpoint — Public POST (form submissions)
router.post('/public/:websiteId/:endpoint', async (req, res) => {
    try {
        const backend = await SiteBackend.findOne({ website: req.params.websiteId, status: 'active' });
        if (!backend) return res.status(404).json({ error: 'Site backend not found' });

        // Add the submitted data to the collection
        const collName = req.params.endpoint;
        if (!backend.data) backend.data = {};

        // Ensure the collection array exists even if it's not in the original schema
        const existingData = backend.data[collName] || [];
        const newEntry = { ...req.body, _id: Date.now().toString(36), createdAt: new Date().toISOString() };
        existingData.push(newEntry);
        backend.data[collName] = existingData;
        backend.markModified('data');

        // Dynamically add the endpoint to the schema if it didn't exist (self-healing API)
        const epExists = (backend.apiDefinition?.endpoints || []).some(e => e.method === 'POST' && e.path === `/${req.params.endpoint}`);
        if (!epExists) {
            if (!backend.apiDefinition) backend.apiDefinition = { endpoints: [], collections: [] };
            if (!backend.apiDefinition.endpoints) backend.apiDefinition.endpoints = [];
            backend.apiDefinition.endpoints.push({
                path: `/${req.params.endpoint}`,
                method: 'POST',
                description: `Auto-registered collection for ${req.params.endpoint}`,
                fields: Object.keys(req.body)
            });
            backend.markModified('apiDefinition');
        }

        await backend.save();

        res.json({ success: true, data: newEntry, message: 'Submission received!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
