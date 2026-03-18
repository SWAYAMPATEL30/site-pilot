import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import Website from '../models/Website.js';
import Deployment from '../models/Deployment.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/analytics
router.get('/', auth, requirePermission('analytics.view'), async (req, res) => {
    const websiteCount = await Website.countDocuments({ tenant: req.tenantId });
    const publishedCount = await Website.countDocuments({ tenant: req.tenantId, status: 'published' });
    const deployCount = await Deployment.countDocuments({ tenant: req.tenantId });

    // Simulated traffic data
    const days = 30;
    const traffic = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 800) + 100,
        pageViews: Math.floor(Math.random() * 2000) + 300,
        bounceRate: Math.floor(Math.random() * 30) + 25,
    }));

    const totalVisitors = traffic.reduce((s, d) => s + d.visitors, 0);
    const totalPageViews = traffic.reduce((s, d) => s + d.pageViews, 0);
    const avgBounceRate = Math.round(traffic.reduce((s, d) => s + d.bounceRate, 0) / days);

    const topPages = [
        { path: '/', views: Math.floor(Math.random() * 5000) + 2000, avgTime: '2m 15s' },
        { path: '/about', views: Math.floor(Math.random() * 2000) + 500, avgTime: '1m 45s' },
        { path: '/services', views: Math.floor(Math.random() * 1500) + 300, avgTime: '3m 10s' },
        { path: '/contact', views: Math.floor(Math.random() * 800) + 200, avgTime: '1m 20s' },
        { path: '/blog', views: Math.floor(Math.random() * 600) + 100, avgTime: '4m 30s' },
    ];

    const topReferrers = [
        { source: 'Google', visitors: Math.floor(totalVisitors * 0.4) },
        { source: 'Direct', visitors: Math.floor(totalVisitors * 0.25) },
        { source: 'Twitter', visitors: Math.floor(totalVisitors * 0.15) },
        { source: 'LinkedIn', visitors: Math.floor(totalVisitors * 0.1) },
        { source: 'Other', visitors: Math.floor(totalVisitors * 0.1) },
    ];

    const webVitals = {
        lcp: (Math.random() * 1.5 + 1.5).toFixed(1) + 's',
        fid: Math.floor(Math.random() * 50 + 20) + 'ms',
        cls: (Math.random() * 0.05 + 0.02).toFixed(3),
    };

    res.json({
        success: true,
        data: {
            overview: { websites: websiteCount, published: publishedCount, deployments: deployCount, totalVisitors, totalPageViews, avgBounceRate },
            traffic, topPages, topReferrers, webVitals,
        }
    });
});

// GET /api/analytics/logs
router.get('/logs', auth, async (req, res) => {
    const { page = 1, limit = 20, action, entityType } = req.query;
    const filter = { tenant: req.tenantId };
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const total = await ActivityLog.countDocuments(filter);
    const logs = await ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({
        success: true,
        data: { logs, total, page: Number(page), limit: Number(limit) },
    });
});

export default router;
