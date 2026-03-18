import express from 'express';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requirePermission, getPermissions } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/team
router.get('/', auth, async (req, res) => {
    const members = await User.find({ tenant: req.tenantId }).select('-password');
    const tenant = await Tenant.findById(req.tenantId);
    res.json({ success: true, data: { members, limit: tenant.limits.teamMembers } });
});

// POST /api/team/invite
router.post('/invite', auth, requirePermission('team.invite'), async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.tenantId);
        const memberCount = await User.countDocuments({ tenant: req.tenantId });
        if (tenant.limits.teamMembers !== -1 && memberCount >= tenant.limits.teamMembers) {
            return res.status(403).json({ success: false, error: 'Team member limit reached. Upgrade your plan.' });
        }

        const { name, email, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });

        const user = await User.create({
            name, email, password: 'invited_' + Date.now(),
            role: role || 'editor', tenant: req.tenantId, status: 'invited',
        });

        await ActivityLog.create({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            tenant: req.tenantId, action: 'team.invite', entityType: 'user', entityId: user._id,
            details: { invitedEmail: email, role }, ipAddress: req.ip,
        });

        res.status(201).json({ success: true, data: user.toJSON() });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Invitation failed' });
    }
});

// PUT /api/team/:id/role
router.put('/:id/role', auth, requirePermission('team.changeRole'), async (req, res) => {
    const { role } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: req.params.id, tenant: req.tenantId },
        { role }, { new: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user.toJSON() });
});

// DELETE /api/team/:id
router.delete('/:id', auth, requirePermission('team.remove'), async (req, res) => {
    if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({ success: false, error: 'Cannot remove yourself' });
    }
    const user = await User.findOneAndDelete({ _id: req.params.id, tenant: req.tenantId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'Team member removed' });
});

// GET /api/team/permissions
router.get('/permissions', auth, (req, res) => {
    const permissions = getPermissions(req.user.role);
    res.json({ success: true, data: { role: req.user.role, permissions } });
});

export default router;
