import express from 'express';
import Tenant from '../models/Tenant.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/tenants/current
router.get('/current', auth, async (req, res) => {
    const tenant = await Tenant.findById(req.tenantId);
    res.json({ success: true, data: tenant });
});

// PUT /api/tenants/current
router.put('/current', auth, requirePermission('settings.manage'), async (req, res) => {
    const { branding, name } = req.body;
    const tenant = await Tenant.findById(req.tenantId);
    if (branding) tenant.branding = { ...tenant.branding, ...branding };
    if (name) tenant.name = name;
    await tenant.save();
    res.json({ success: true, data: tenant });
});

export default router;
