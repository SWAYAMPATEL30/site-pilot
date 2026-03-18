import express from 'express';
import Page from '../models/Page.js';
import Tenant from '../models/Tenant.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/pages?websiteId=xxx
router.get('/', auth, async (req, res) => {
    const filter = { tenant: req.tenantId };
    if (req.query.websiteId) filter.website = req.query.websiteId;
    const pages = await Page.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, data: pages });
});

// GET /api/pages/:id
router.get('/:id', auth, async (req, res) => {
    const page = await Page.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
    res.json({ success: true, data: page });
});

// POST /api/pages
router.post('/', auth, requirePermission('page.create'), async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.tenantId);
        if (tenant.limits.pages !== -1 && tenant.usage.pages >= tenant.limits.pages) {
            return res.status(403).json({ success: false, error: 'Page limit reached. Upgrade your plan.' });
        }
        const { title, websiteId, components, generatedHTML } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const page = await Page.create({
            title, slug, website: websiteId, tenant: req.tenantId,
            components: components || [], generatedHTML: generatedHTML || '',
        });
        tenant.usage.pages += 1;
        await tenant.save();

        await ActivityLog.create({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            tenant: req.tenantId, action: 'page.create', entityType: 'page', entityId: page._id,
            details: { title, websiteId }, ipAddress: req.ip,
        });

        res.status(201).json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to create page' });
    }
});

// PUT /api/pages/:id
router.put('/:id', auth, requirePermission('page.edit'), async (req, res) => {
    const page = await Page.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });

    const { components, generatedHTML, title, status, seo } = req.body;

    // Save version before changing
    if (components || generatedHTML) {
        page.versions.push({
            version: page.version,
            components: page.components,
            generatedHTML: page.generatedHTML,
            createdBy: req.user._id,
            message: req.body.versionMessage || `Version ${page.version}`,
        });
        page.version += 1;
    }

    if (components) page.components = components;
    if (generatedHTML) page.generatedHTML = generatedHTML;
    if (title) page.title = title;
    if (status) page.status = status;
    if (seo) page.seo = seo;
    await page.save();

    await ActivityLog.create({
        user: { id: req.user._id, name: req.user.name, email: req.user.email },
        tenant: req.tenantId, action: 'page.update', entityType: 'page', entityId: page._id,
        details: { title: page.title, version: page.version }, ipAddress: req.ip,
    });

    res.json({ success: true, data: page });
});

// DELETE /api/pages/:id
router.delete('/:id', auth, requirePermission('page.delete'), async (req, res) => {
    const page = await Page.findOneAndDelete({ _id: req.params.id, tenant: req.tenantId });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
    const tenant = await Tenant.findById(req.tenantId);
    tenant.usage.pages = Math.max(0, tenant.usage.pages - 1);
    await tenant.save();
    res.json({ success: true, message: 'Page deleted' });
});

export default router;
