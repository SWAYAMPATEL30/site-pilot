import express from 'express';
import fs from 'fs';
import { generateWithGemini } from '../services/gemini.js';
import { analyzeAndGenerateBackendSchema } from '../services/agentFlow.js';
import Website from '../models/Website.js';
import Tenant from '../models/Tenant.js';
import SiteBackend from '../models/SiteBackend.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

// Helper to clean HTML (from previous gemini.js export)
function cleanGeneratedHTML(text) {
    return text.toString()
        .replace(/^```html\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();
}

// POST /api/ai/generate — Non-streaming website generation via Gemini (CodeYug logic)
router.post('/generate', auth, requirePermission('ai.generate'), async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.tenantId);
        if (tenant.limits.aiGenerations !== -1 && tenant.usage.aiGenerations >= tenant.limits.aiGenerations) {
            return res.status(403).json({ success: false, error: 'AI generation limit reached. Upgrade your plan.' });
        }

        const { prompt, history, websiteId, previousHtml } = req.body;
        if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });

        // Get existing HTML if modifying
        let existingHTML = previousHtml || '';
        let website = null;
        if (websiteId) {
            website = await Website.findOne({ _id: websiteId, tenant: req.tenantId });
            if (website && !existingHTML) existingHTML = website.generatedHTML || '';
        }

        // Mock branding to pass to gemini.js since we don't have full CodeYug branding structure
        const mockBranding = {
            companyName: website?.name || 'My Company',
            companyDescription: website?.description || '',
            primaryColor: '#6366f1',
            secondaryColor: '#4f46e5',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            fontHeading: 'Inter',
            fontBody: 'Inter'
        };

        const rawHTML = await generateWithGemini(prompt, mockBranding, existingHTML);
        let fullHTML = cleanGeneratedHTML(rawHTML);

        // Save to website if websiteId provided
        let versionNumber = 1;
        if (websiteId && fullHTML.length > 100) {
            if (website) {
                // --- VERSION CONTROL: Save previous version before overwriting ---
                if (website.generatedHTML && website.generatedHTML.length > 100) {
                    website.versions.push({
                        version: website.currentVersion || 1,
                        html: website.generatedHTML,
                        prompt: prompt.substring(0, 200),
                        label: `v${website.currentVersion || 1}`,
                        createdAt: new Date(),
                    });
                }

                versionNumber = (website.currentVersion || 0) + 1;

                // Inject API context variable for dynamic backend forms
                let modifiedHTML = fullHTML;
                if (modifiedHTML.includes('</body>')) {
                    modifiedHTML = modifiedHTML.replace('</body>', `\n<script>window.WEBSITE_ID = "${websiteId}";</script>\n</body>`);
                } else {
                    modifiedHTML += `\n<script>window.WEBSITE_ID = "${websiteId}";</script>\n`;
                }

                website.generatedHTML = modifiedHTML;
                website.currentVersion = versionNumber;

                // --- CHAT PERSISTENCE ---
                if (website.chatHistory.length === 0 || website.chatHistory[website.chatHistory.length - 1].role !== 'ai') {
                    website.chatHistory.push(
                        { role: 'user', content: prompt, ts: Date.now() },
                        { role: 'ai', content: `✅ Website generated! (v${versionNumber})`, ts: Date.now() }
                    );
                }

                website.promptHistory.push({ prompt });
                await website.save();
            }
        }

        // Update usage
        tenant.usage.aiGenerations += 1;
        await tenant.save();

        await ActivityLog.create({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            tenant: req.tenantId, action: 'ai.generate', entityType: 'website', entityId: websiteId,
            details: { prompt: prompt.substring(0, 100), version: versionNumber, htmlLength: fullHTML.length },
            ipAddress: req.ip,
        });

        // Auto-generate backend via smart agent (non-blocking) - Keep this background process running
        if (websiteId && fullHTML.length > 100) {
            try {
                const schema = await analyzeAndGenerateBackendSchema(fullHTML, website?.businessType || 'general');
                let backend = await SiteBackend.findOne({ website: websiteId });
                if (!backend) backend = new SiteBackend({ website: websiteId, tenant: req.tenantId });
                const dataMap = {};
                for (const ep of schema.endpoints) {
                    if (ep.method === 'GET' && ep.sampleData?.length > 0) {
                        dataMap[ep.path.replace(/^\//, '')] = ep.sampleData;
                    }
                }
                backend.apiDefinition = schema;
                backend.data = dataMap;
                backend.status = 'active';
                backend.apiBaseUrl = `/api/site-backends/public/${websiteId}`;
                backend.lastGenerated = new Date();
                await backend.save();
            } catch (agentErr) {
                console.error('Agent backend gen error (non-fatal):', agentErr.message);
            }
        }

        // Send completion matching CodeYug's expected JSON format
        res.json({
            ok: true,
            version: {
                versionNumber: versionNumber,
                htmlCode: fullHTML
            }
        });

    } catch (err) {
        fs.appendFileSync('gemini-error-log.txt', `\n==== ERROR ====\nMessage: ${err.message}\nStack: ${err.stack}\n${err.response ? 'Has Response' : 'No Response'}\n`);
        console.error('================ AI GENERATION ERROR ================');
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        console.error('=====================================================');
        const userError = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')
            ? 'AI API rate limit reached. Please wait a moment and try again.'
            : err.message?.includes('API_KEY')
                ? 'Invalid API key. Check your .env configuration.'
                : 'AI generation failed. Please try again.';
        res.status(500).json({ ok: false, error: userError });
    }
});

export default router;
