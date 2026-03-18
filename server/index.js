import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenants.js';
import websiteRoutes from './routes/websites.js';
import pageRoutes from './routes/pages.js';
import aiRoutes from './routes/ai.js';
import deployRoutes from './routes/deploy.js';
import billingRoutes from './routes/billing.js';
import teamRoutes from './routes/team.js';
import analyticsRoutes from './routes/analytics.js';
import siteBackendRoutes from './routes/siteBackends.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://spit-hack.app.n8n.cloud'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/site-backends', siteBackendRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Site Pilot API running', timestamp: new Date().toISOString() }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React build directory in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    
    // Catch-all route to serve index.html for SPAs
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../dist', 'index.html'));
        } else {
            res.status(404).json({ success: false, error: 'API endpoint not found' });
        }
    });
}

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Site Pilot API running on port ${PORT}`);
    });
});
