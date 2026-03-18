import express from 'express';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log("REGISTER PAYLOAD:", req.body);
        let { name, email, password, tenantName, plan, ownerName, ownerEmail, tenantSlug } = req.body;

        // Handle frontend caching cases where old payload structure is passed
        if (!name && ownerName) name = ownerName;
        if (!email && ownerEmail) email = ownerEmail;
        if (!tenantName && req.body.orgName) tenantName = req.body.orgName;

        if (!name || !email || !password || !tenantName) {
            console.log("MISSING FIELDS ERROR. Expected: name, email, password, tenantName. Received:", { name, email, password, tenantName });
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });

        // Create tenant
        const slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const tenant = await Tenant.create({ name: tenantName, slug, plan: plan || 'free' });

        // Create user
        const user = await User.create({ name, email, password, role: 'owner', tenant: tenant._id });
        tenant.owner = user._id;
        await tenant.save();

        // Log activity
        await ActivityLog.create({
            user: { id: user._id, name: user.name, email: user.email },
            tenant: tenant._id,
            action: 'user.register',
            entityType: 'user',
            entityId: user._id,
            details: { plan: tenant.plan },
            ipAddress: req.ip,
        });

        const token = generateToken(user._id);
        res.status(201).json({ success: true, data: { user: user.toJSON(), tenant, token } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });

        const user = await User.findOne({ email }).select('+password').populate('tenant');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        user.lastLogin = new Date();
        await user.save();

        await ActivityLog.create({
            user: { id: user._id, name: user.name, email: user.email },
            tenant: user.tenant._id,
            action: 'user.login',
            entityType: 'user',
            entityId: user._id,
            ipAddress: req.ip,
        });

        const token = generateToken(user._id);
        res.json({ success: true, data: { user: user.toJSON(), tenant: user.tenant, token } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).populate('tenant');
    res.json({ success: true, data: { user: user.toJSON(), tenant: user.tenant } });
});

export default router;
