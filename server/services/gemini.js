import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Build a comprehensive system prompt from user input + branding data,
 * then call Gemini and return raw HTML.
 * 
 * The userPrompt may already contain detailed styling instructions from the template builder.
 * If it does, we preserve those and add branding data. Otherwise, we use generic guidelines.
 * 
 * @param {string} userPrompt - User's generation/modification request
 * @param {object} branding - Brand configuration
 * @param {string} previousHtml - Previous version's HTML (if editing) for styling consistency
 */
export async function generateWithGemini(userPrompt, branding, previousHtml = '') {
    // ── Detect if prompt already has design system instructions ────────────────
    const hasDesignSystem = /DESIGN SYSTEM:|PROFESSIONAL|GLASSMORPHISM|NEO-BRUTALISM|COMPONENT SPECIFICATIONS/i.test(userPrompt);

    // ── Format services list ───────────────────────────────────────────────────
    const servicesBlock = branding.services?.length
        ? branding.services
            .map(
                (s, i) =>
                    `  ${i + 1}. ${s.name} — ${s.description || 'No description'} | Price: $${s.price ?? 'N/A'}`
            )
            .join('\n')
        : '  (No services defined yet)';

    // ── Format available images ────────────────────────────────────────────────
    const imagesBlock = branding.images?.length
        ? branding.images
            .map((img, i) => `  Image ${i + 1}: ${img.url}  (alt: "${img.alt || 'image'}")`)
            .join('\n')
        : '  (No images uploaded yet)';

    // ── Build system prompt ────────────────────────────────────────────────────
    const previousVersionContext = previousHtml
        ? `\n═══ PREVIOUS VERSION (for styling reference) ═══\nUse this as a reference to maintain design consistency, color scheme, typography, and layout patterns:\n\`\`\`html\n${previousHtml}\n\`\`\`\n(Full previous version provided above)\n\n`
        : '';

    const systemPrompt = hasDesignSystem
        ? `You are an elite web developer and UI designer.
Generate a COMPLETE, production-ready, single-file HTML page with INTERNAL <style> and <script> tags.

THE USER HAS SPECIFIED DETAILED DESIGN SYSTEM AND COMPONENT INSTRUCTIONS BELOW.
FOLLOW THESE INSTRUCTIONS EXACTLY AND COMPLETELY — they take absolute priority.
Do NOT deviate from the styling, colors, typography, layouts, or component specifications provided.
${previousVersionContext}
If there is a previous version above, maintain its visual styling, color palette, typography, and component design patterns while implementing the user's new content/changes.

═══ BRAND ASSETS ═══
Company Name        : ${branding.companyName || 'My Company'}
Company Description : ${branding.companyDescription || ''}
Logo URL            : ${branding.logo || '(none)'}
Favicon URL         : ${branding.favicon || '(none)'}

═══ BRAND IMAGES ═══
${imagesBlock}

═══ SERVICES OFFERED ═══
${servicesBlock}

═══ CRITICAL RULES (always apply) ═══
1. Output ONLY valid HTML — no markdown fences, no explanations, no commentary.
2. All CSS must be in a single <style> block inside <head>.
3. All JS must be in a single <script> block before </body>.
4. Use Google Fonts via @import (specified in design system) from Google Fonts CDN.
5. If a logo URL is provided, render it in the navbar/header as specified.
6. Include ALL uploaded images naturally within page sections.
7. Include a "Services" section if services are defined (use design system styling).
8. The page MUST be fully responsive (mobile-first).
9. NO external JS or CSS libraries except Google Fonts, Tailwind via CDN or FontAwesome via CDN if explicitly requested — otherwise self-contained CSS.
10. Include proper <meta> viewport, charset, and a <title> tag.

API INTEGRATION (CRITICAL):
- You must integrate dynamic javascript specifically to post data to the auto-generated backend for any interactive forms (like carts, checkouts, reservations, contact).
- The website ID will be injected dynamically via window.WEBSITE_ID. The URL for your API POST requests MUST ALWAYS be formatted exactly like this:
  const API_URL = \`https://spit-hack.app.n8n.cloud/api/sites/\${window.WEBSITE_ID}/\${endpoint_name}\`;
- Where "\${endpoint_name}" is an intuitive noun related to the action (e.g., 'orders', 'reservations', 'messages', 'contacts').
- Write the fetch() call inside an async function triggered on form submit, and show a success message via alert or UI text. 
- Prevent default form submission.
- Do NOT hardcode the website ID, assume window.WEBSITE_ID will be set globally before your script runs.

═══ USER'S DESIGN & CONTENT REQUEST ═══
${userPrompt}`
        : `You are an elite web developer and UI designer.
Generate a COMPLETE, production-ready, single-file HTML page with INTERNAL <style> and <script> tags.

═══ BRAND IDENTITY ═══
Company Name        : ${branding.companyName || 'My Company'}
Company Description : ${branding.companyDescription || ''}
Logo URL            : ${branding.logo || '(none)'}
Favicon URL         : ${branding.favicon || '(none)'}
  Primary Color       : ${branding.primaryColor || '#8b5cf6'}
  Secondary Color     : ${branding.secondaryColor || '#6d28d9'}
  Accent Color        : ${branding.accentColor || '#06b6d4'}
  Background Color    : ${branding.bgColor || branding.backgroundColor || '#1a1a2e'}
  Text Color          : ${branding.textColor || '#111111'}
  Heading Font        : ${branding.fontHeading || 'Outfit'}
  Body Font           : ${branding.fontBody || 'Inter'}

═══ BRAND IMAGES ═══
${imagesBlock}

═══ SERVICES OFFERED ═══
${servicesBlock}

${previousVersionContext}

═══ DESIGN GUIDELINES ═══
1. Output ONLY valid HTML — no markdown fences, no explanations, no commentary.
2. All CSS must be in a single <style> block inside <head>.
3. All JS must be in a single <script> block before </body>.
4. Use Google Fonts via <link> for the specified heading & body fonts.
5. If a logo URL is provided, render it in an <img> tag in the header/navbar.
6. Include ALL uploaded images naturally within the page content (hero, gallery, about sections, etc.).
7. Build a dedicated "Services" section displaying every service with name, description, and price.
8. Apply the brand color palette consistently (primary for CTAs, secondary for accents, etc.).
9. The page MUST be fully responsive (mobile-first, looks great on all devices).
10. Add smooth scroll, subtle animations/transitions, and a polished modern design.
11. NO external JS or CSS libraries except Tailwind via CDN or FontAwesome via CDN if explicitly requested — otherwise self-contained CSS.
12. Include proper <meta> viewport, charset, and a <title> tag with the company name.

API INTEGRATION (CRITICAL):
- You must integrate dynamic javascript specifically to post data to the auto-generated backend for any interactive forms (like carts, checkouts, reservations, contact).
- The website ID will be injected dynamically via window.WEBSITE_ID. The URL for your API POST requests MUST ALWAYS be formatted exactly like this:
  const API_URL = \`https://spit-hack.app.n8n.cloud/api/sites/\${window.WEBSITE_ID}/\${endpoint_name}\`;
- Where "\${endpoint_name}" is an intuitive noun related to the action (e.g., 'orders', 'reservations', 'messages', 'contacts').
- Write the fetch() call inside an async function triggered on form submit, and show a success message via alert or UI text. 
- Prevent default form submission.
- Do NOT hardcode the website ID, assume window.WEBSITE_ID will be set globally before your script runs.

═══ USER REQUEST ═══
${userPrompt}`;

    try {
        const model = client.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        const result = await model.generateContent(systemPrompt);
        let html = result.response.text();

        html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');

        return html;
    } catch (err) {
        if (err.message.includes('404') || err.message.includes('503')) {
            // Fallback to gemini-1.5-pro if 3-flash is not available or overloaded
            try {
                const fallbackModel = client.getGenerativeModel({ model: 'gemini-1.5-pro' });
                const fallbackResult = await fallbackModel.generateContent(systemPrompt);
                let html = fallbackResult.response.text();
                html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                return html;
            } catch (fallbackErr) {
                throw new Error(`Gemini API Error: ${fallbackErr.message}`);
            }
        }
        throw new Error(`Gemini API Error: ${err.message}`);
    }
}
