import express from 'express';
import Tenant from '../models/Tenant.js';
import Invoice from '../models/Invoice.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

const PLAN_PRICES = { free: 0, starter: 29, professional: 79, enterprise: 199 };

// GET /api/billing
router.get('/', auth, requirePermission('billing.view'), async (req, res) => {
    const tenant = await Tenant.findById(req.tenantId);
    const invoices = await Invoice.find({ tenant: req.tenantId }).sort({ createdAt: -1 }).limit(12);
    res.json({ success: true, data: { plan: tenant.plan, limits: tenant.limits, usage: tenant.usage, invoices, price: PLAN_PRICES[tenant.plan] } });
});

// POST /api/billing/change-plan
router.post('/change-plan', auth, requirePermission('billing.manage'), async (req, res) => {
    try {
        const { plan } = req.body;
        if (!PLAN_PRICES.hasOwnProperty(plan)) return res.status(400).json({ success: false, error: 'Invalid plan' });

        const tenant = await Tenant.findById(req.tenantId);
        const oldPlan = tenant.plan;
        tenant.plan = plan;
        await tenant.save();

        // Create invoice
        if (PLAN_PRICES[plan] > 0) {
            await Invoice.create({
                tenant: req.tenantId, amount: PLAN_PRICES[plan], plan,
                status: 'paid', description: `Upgrade to ${plan} plan`,
                period: { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                paymentMethod: { type: 'card', last4: '4242', brand: 'Visa' },
            });
        }

        await ActivityLog.create({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            tenant: req.tenantId, action: 'billing.changePlan', entityType: 'billing',
            details: { oldPlan, newPlan: plan, amount: PLAN_PRICES[plan] }, ipAddress: req.ip,
        });

        res.json({ success: true, data: { plan: tenant.plan, limits: tenant.limits, usage: tenant.usage } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Plan change failed' });
    }
});

export default router;
