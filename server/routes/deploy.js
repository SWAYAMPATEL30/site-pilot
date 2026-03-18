import express from 'express';
import Deployment from '../models/Deployment.js';
import Website from '../models/Website.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

// Store active deployment streams for n8n-style status updates
const activeDeployments = new Map();

// Helper to generate a random public IP
const generatePublicIP = () => Math.floor(Math.random() * 150) + 50 + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255);

// GET /api/deploy?websiteId=xxx
router.get('/', auth, async (req, res) => {
    const filter = { tenant: req.tenantId };
    if (req.query.websiteId) filter.website = req.query.websiteId;
    const deployments = await Deployment.find(filter).populate('website', 'name slug').populate('deployedBy', 'name').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: deployments });
});

// POST /api/deploy
router.post('/', auth, requirePermission('deploy.create'), async (req, res) => {
    try {
        const { websiteId, environment, changelog } = req.body;
        const website = await Website.findOne({ _id: websiteId, tenant: req.tenantId });
        if (!website) return res.status(404).json({ success: false, error: 'Website not found' });

        // Use the live n8n webhook for public hosting
        const renderDeployUrl = `https://spit-hack.app.n8n.cloud/webhook/tenantflow-hosting/site/${website.slug || website.name}`;

        const deployment = await Deployment.create({
            website: websiteId, tenant: req.tenantId, deployedBy: req.user._id,
            version: website.currentVersion, environment: environment || 'production',
            changelog, status: 'pending',
            url: renderDeployUrl
        });

        // Initialize the status sequence for SSE
        activeDeployments.set(deployment._id.toString(), {
            status: 'pending',
            url: renderDeployUrl,
            publicIp: renderDeployUrl, // Send n8n url instead of random IP
            steps: [
                { id: 'extract', name: 'Extract Docker Bundle', status: 'pending', time: null },
                { id: 'build', name: 'Build Docker Image', status: 'pending', time: null, logs: [] },
                { id: 'push', name: 'Push to Registry', status: 'pending', time: null },
                { id: 'map', name: 'Map Render Public IP', status: 'pending', time: null }
            ]
        });

        // Start the background simulated pipeline
        runDeploymentPipeline(deployment, website);

        await ActivityLog.create({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            tenant: req.tenantId, action: 'deploy.create', entityType: 'deployment', entityId: deployment._id,
            details: { websiteName: website.name, version: website.currentVersion, environment },
            ipAddress: req.ip,
        });

        res.status(201).json({ success: true, data: deployment });
    } catch (err) {
        console.error('Deploy creation error:', err);
        res.status(500).json({ success: false, error: 'Deployment failed' });
    }
});

// GET /api/deploy/:id/stream - SSE Endpoint for Real-time Node updates
router.get('/:id/stream', auth, (req, res) => {
    const deployId = req.params.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const state = activeDeployments.get(deployId);
    if (!state) {
        // Not locally active/already finished
        res.write("data: " + JSON.stringify({ type: 'done', message: 'Deployment tracking ended or not found' }) + "\n\n");
        return res.end();
    }

    res.write("data: " + JSON.stringify({ type: 'init', state }) + "\n\n");

    const interval = setInterval(() => {
        const currentState = activeDeployments.get(deployId);
        if (!currentState) {
            clearInterval(interval);
            res.write("data: " + JSON.stringify({ type: 'done' }) + "\n\n");
            return res.end();
        }
        res.write("data: " + JSON.stringify({ type: 'update', state: currentState }) + "\n\n");

        if (currentState.status === 'live' || currentState.status === 'failed') {
            clearInterval(interval);
            setTimeout(() => {
                activeDeployments.delete(deployId);
                res.write("data: " + JSON.stringify({ type: 'done' }) + "\n\n");
                res.end();
            }, 1000);
        }
    }, 500);

    req.on('close', () => clearInterval(interval));
});

// POST /api/deploy/:id/rollback
router.post('/:id/rollback', auth, requirePermission('deploy.rollback'), async (req, res) => {
    const deployment = await Deployment.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!deployment) return res.status(404).json({ success: false, error: 'Deployment not found' });

    const rollback = await Deployment.create({
        website: deployment.website, tenant: req.tenantId, deployedBy: req.user._id,
        version: deployment.version, environment: deployment.environment,
        status: 'live', rollbackFrom: deployment.version, buildTime: 2,
        url: deployment.url,
    });

    res.json({ success: true, data: rollback });
});

// Helper for Background Pipeline
async function runDeploymentPipeline(deployment, website) {
    const dId = deployment._id.toString();
    const state = activeDeployments.get(dId);
    if (!state) return;

    try {
        state.status = 'building';
        await Deployment.findByIdAndUpdate(dId, { status: 'building' });

        // Step 1: Extract Docker Bundle
        updateStep(state, 'extract', 'running');
        await delay(1200);
        updateStep(state, 'extract', 'done', 1.2);

        // Step 2: Build Image
        updateStep(state, 'build', 'running');
        await delay(800);
        state.steps[1].logs.push('✓ Generating Dockerfile...');
        await delay(800);
        state.steps[1].logs.push('✓ Analyzing Dependencies...');
        await delay(800);
        state.steps[1].logs.push('✓ Creating Image Layers from Node:20-Alpine');
        updateStep(state, 'build', 'done', 2.4);

        // Step 3: Push to Registry
        updateStep(state, 'push', 'running');
        await delay(1500);
        updateStep(state, 'push', 'done', 1.5);

        // Step 4: Map Public Server Port (Render)
        state.status = 'deploying';
        await Deployment.findByIdAndUpdate(dId, { status: 'deploying' });
        updateStep(state, 'map', 'running');
        await delay(2000);
        state.steps[3].logs = state.steps[3].logs || [];
        state.steps[3].logs.push("✓ Exposing Docker Container Port 8080");
        await delay(1000);
        state.steps[3].logs.push("✓ Binding to Public Host IP " + state.publicIp);
        updateStep(state, 'map', 'done', 3.0);

        // Finished
        state.status = 'live';
        await Deployment.findByIdAndUpdate(dId, {
            status: 'live',
            buildTime: 8.1,
            url: state.url
        });

        website.status = 'published';
        website.publishedAt = new Date();
        website.publishedVersion = website.currentVersion;
        await website.save();

    } catch (err) {
        console.error('Pipeline failed:', err);
        state.status = 'failed';
        await Deployment.findByIdAndUpdate(dId, { status: 'failed' });
    }
}

function updateStep(state, id, status, time = null) {
    const step = state.steps.find(s => s.id === id);
    if (step) {
        step.status = status;
        if (time !== null) step.time = time;
    }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

export default router;
