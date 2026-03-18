/**
 * Comprehensive API Test Script
 * Tests all platform endpoints + AI builder + dynamic backend generation
 */

const BASE = 'http://localhost:5000';
let TOKEN = '';
let TENANT_ID = '';
let WEBSITE_ID = '';
let results = [];

async function req(method, path, body = null, expectStatus = 200) {
    const headers = { 'Content-Type': 'application/json' };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    try {
        const res = await fetch(`${BASE}${path}`, opts);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = text; }
        const pass = res.status === expectStatus;
        return { pass, status: res.status, data, path: `${method} ${path}` };
    } catch (err) {
        return { pass: false, status: 'ERROR', data: err.message, path: `${method} ${path}` };
    }
}

function log(label, r) {
    const icon = r.pass ? '✅' : '❌';
    console.log(`${icon} ${label} — ${r.path} → ${r.status}`);
    if (!r.pass) console.log(`   Detail:`, JSON.stringify(r.data).substring(0, 200));
    results.push({ label, pass: r.pass, status: r.status });
}

async function run() {
    console.log('═══════════════════════════════════════');
    console.log('  TenantFlow AI — Full Endpoint Tests  ');
    console.log('═══════════════════════════════════════\n');

    // ─── 1. HEALTH CHECK ───
    console.log('── Health ──');
    let r = await req('GET', '/api/health');
    log('Health Check', r);

    // ─── 2. AUTH ───
    console.log('\n── Authentication ──');

    r = await req('POST', '/api/auth/login', { email: 'wrong@test.com', password: 'wrong' }, 401);
    log('Login (bad creds → 401)', r);

    r = await req('POST', '/api/auth/login', { email: 'marco@bellacucina.com', password: 'demo123' });
    log('Login (valid)', r);
    if (r.data?.token) {
        TOKEN = r.data.token;
        console.log(`   → Token acquired (${TOKEN.substring(0, 20)}...)`);
    } else if (r.data?.data?.token) {
        TOKEN = r.data.data.token;
        console.log(`   → Token acquired (${TOKEN.substring(0, 20)}...)`);
    }

    r = await req('GET', '/api/auth/me');
    log('Get Current User', r);
    if (r.data?.data?.user) {
        console.log(`   → User: ${r.data.data.user.name} (${r.data.data.user.role})`);
        TENANT_ID = r.data.data.user.tenant;
    }

    // ─── 3. TENANT ───
    console.log('\n── Tenant ──');
    r = await req('GET', '/api/tenants/current');
    log('Get Current Tenant', r);
    if (r.data?.data) {
        console.log(`   → Tenant: ${r.data.data.name}, Plan: ${r.data.data.plan}`);
    }

    // ─── 4. WEBSITES ───
    console.log('\n── Websites ──');
    r = await req('GET', '/api/websites');
    log('List Websites', r);
    const websites = r.data?.data || [];
    console.log(`   → Found ${websites.length} websites`);

    if (websites.length > 0) {
        WEBSITE_ID = websites[0]._id;
        console.log(`   → Using website: ${websites[0].name} (${WEBSITE_ID})`);

        r = await req('GET', `/api/websites/${WEBSITE_ID}`);
        log('Get Website Detail', r);
    }

    // Create a new website
    r = await req('POST', '/api/websites', { name: 'Test Site', domain: 'test-site.com', businessType: 'technology' });
    log('Create Website', r);
    let testWebsiteId = r.data?.data?._id;
    if (testWebsiteId) {
        console.log(`   → Created: ${testWebsiteId}`);

        r = await req('PUT', `/api/websites/${testWebsiteId}`, { name: 'Test Site Updated' });
        log('Update Website', r);

        r = await req('DELETE', `/api/websites/${testWebsiteId}`);
        log('Delete Website', r);
    }

    // ─── 5. PAGES ───
    console.log('\n── Pages ──');
    if (WEBSITE_ID) {
        r = await req('GET', `/api/pages?website=${WEBSITE_ID}`);
        log('List Pages', r);

        r = await req('POST', '/api/pages', { title: 'Test Page', slug: 'test-page', content: '<h1>Test</h1>', websiteId: WEBSITE_ID });
        log('Create Page', r);
        let pageId = r.data?.data?._id;
        if (pageId) {
            r = await req('PUT', `/api/pages/${pageId}`, { title: 'Updated Page', content: '<h1>Updated</h1>' });
            log('Update Page', r);
            r = await req('DELETE', `/api/pages/${pageId}`);
            log('Delete Page', r);
        }
    }

    // ─── 6. TEAM ───
    console.log('\n── Team ──');
    r = await req('GET', '/api/team');
    log('List Team Members', r);
    const team = r.data?.data || [];
    console.log(`   → Found ${team.length} team members`);

    // ─── 7. ANALYTICS ───
    console.log('\n── Analytics ──');
    r = await req('GET', '/api/analytics');
    log('Analytics Overview', r);

    r = await req('GET', '/api/analytics/logs');
    log('Activity Log', r);

    // ─── 8. BILLING ───
    console.log('\n── Billing ──');
    r = await req('GET', '/api/billing');
    log('Billing Info', r);

    // ─── 9. DEPLOYMENTS ───
    console.log('\n── Deployments ──');
    r = await req('GET', '/api/deploy');
    log('List Deployments', r);

    // ─── 10. AI BUILDER (Stream test) ───
    console.log('\n── AI Builder (Groq + Streaming) ──');
    if (WEBSITE_ID) {
        try {
            const aiRes = await fetch(`${BASE}/api/ai/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
                body: JSON.stringify({ prompt: 'Create a simple landing page for a coffee shop called Bean & Brew with a hero section and menu section', websiteId: WEBSITE_ID }),
            });
            console.log(`   → AI Stream Status: ${aiRes.status}`);

            if (aiRes.status === 200) {
                const text = await aiRes.text();
                const events = text.split('\n\n').filter(e => e.startsWith('data: '));
                let hadStart = false, hadChunk = false, hadDone = false, hadError = false;
                let htmlLength = 0;
                let backendInfo = null;

                for (const evt of events) {
                    try {
                        const d = JSON.parse(evt.slice(6));
                        if (d.type === 'start') hadStart = true;
                        if (d.type === 'chunk') { hadChunk = true; htmlLength += (d.content?.length || 0); }
                        if (d.type === 'done') { hadDone = true; backendInfo = d.backend; }
                        if (d.type === 'error') { hadError = true; console.log(`   → AI Error: ${d.error}`); }
                    } catch { }
                }

                log('SSE Start Event', { pass: hadStart, status: hadStart ? 'OK' : 'MISSING', path: 'SSE start' });
                log('SSE Chunk Events', { pass: hadChunk, status: hadChunk ? `OK (${htmlLength} chars)` : 'MISSING', path: 'SSE chunks' });
                log('SSE Done Event', { pass: hadDone, status: hadDone ? 'OK' : 'MISSING', path: 'SSE done' });
                if (hadError) log('SSE Error Event', { pass: false, status: 'ERROR', path: 'SSE error' });

                if (htmlLength > 0) {
                    console.log(`   → Generated ${htmlLength} chars of HTML`);
                }

                if (backendInfo) {
                    console.log(`   → Backend auto-generated: ${backendInfo.endpoints} endpoints, ${backendInfo.collections} collections`);
                    log('Smart Agent Backend Generation', { pass: true, status: 'OK', path: 'Auto-generated' });
                } else {
                    console.log(`   → Backend info not in done event (may have failed silently)`);
                    log('Smart Agent Backend Generation', { pass: false, status: 'NO DATA', path: 'Auto-generated' });
                }
            } else {
                log('AI Generation', { pass: false, status: aiRes.status, path: 'POST /api/ai/generate' });
            }
        } catch (err) {
            log('AI Generation', { pass: false, status: 'ERROR', data: err.message, path: 'POST /api/ai/generate' });
        }
    }

    // ─── 11. SITE BACKEND ROUTES ───
    console.log('\n── Site Backend API ──');
    if (WEBSITE_ID) {
        r = await req('GET', `/api/site-backends/${WEBSITE_ID}`);
        log('Get Site Backend', r);
        if (r.data?.data) {
            const be = r.data.data;
            console.log(`   → Status: ${be.status}, Endpoints: ${be.apiDefinition?.endpoints?.length || 0}`);

            // Test public API
            if (be.apiDefinition?.endpoints?.length > 0) {
                const getEp = be.apiDefinition.endpoints.find(e => e.method === 'GET');
                if (getEp) {
                    r = await req('GET', `/api/site-backends/public/${WEBSITE_ID}${getEp.path}`);
                    log(`Public GET ${getEp.path}`, r);
                    console.log(`   → Data items: ${r.data?.data?.length || 0}`);
                }

                const postEp = be.apiDefinition.endpoints.find(e => e.method === 'POST');
                if (postEp) {
                    const testBody = {};
                    (postEp.fields || []).forEach(f => testBody[f] = 'test');
                    r = await req('POST', `/api/site-backends/public/${WEBSITE_ID}${postEp.path}`, testBody);
                    log(`Public POST ${postEp.path}`, r);
                }
            }
        }
    }

    // ─── 12. FRONTEND CHECK ───
    console.log('\n── Frontend (Vite) ──');
    try {
        const feRes = await fetch('http://localhost:3000');
        log('Frontend Serves HTML', { pass: feRes.status === 200, status: feRes.status, path: 'GET http://localhost:3000' });
    } catch (err) {
        log('Frontend Serves HTML', { pass: false, status: 'ERROR', data: err.message, path: 'GET http://localhost:3000' });
    }

    try {
        const proxyRes = await fetch('http://localhost:3000/api/health');
        log('Vite Proxy → Express', { pass: proxyRes.status === 200, status: proxyRes.status, path: 'GET /api/health via proxy' });
    } catch (err) {
        log('Vite Proxy → Express', { pass: false, status: 'ERROR', data: err.message, path: 'GET /api/health via proxy' });
    }

    // ─── SUMMARY ───
    console.log('\n═══════════════════════════════════════');
    console.log('            TEST SUMMARY               ');
    console.log('═══════════════════════════════════════');
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    const total = results.length;
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    if (failed > 0) {
        console.log('\nFailed tests:');
        results.filter(r => !r.pass).forEach(r => console.log(`  ❌ ${r.label} (${r.status})`));
    }
    console.log('═══════════════════════════════════════');
}

run().catch(console.error);
