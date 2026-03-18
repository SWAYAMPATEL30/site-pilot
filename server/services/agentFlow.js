/**
 * Smart Agent Flow — Dynamic Backend Generation (Groq-powered)
 * 
 * Uses Groq's LLaMA model to analyze generated HTML and produce a backend API schema.
 */

import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const AGENT_PROMPT = `You are a smart backend engineering agent. Analyze the given HTML website and generate a JSON schema describing the dynamic backend it needs.

For each interactive section (forms, data lists, dynamic content), produce an endpoint definition.

Return ONLY valid JSON in this exact format:
{
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE",
      "path": "/endpoint-path",
      "description": "What this endpoint does",
      "handler": "handlerName",
      "fields": ["field1", "field2"],
      "sampleData": [{"field1": "value1", "field2": "value2"}]
    }
  ],
  "collections": [
    {
      "name": "collectionName",
      "schema": {"field1": "string", "field2": "string", "field3": "number"}
    }
  ]
}

Rules:
- Identify contact forms → create POST /contact endpoint
- Identify newsletter signups → create POST /newsletter endpoint  
- Identify menu/product listings → create GET /menu or GET /products with sample data
- Identify booking/reservation forms → create POST /reservations endpoint
- Identify testimonials → create GET /testimonials with sample data
- Identify team/about sections → create GET /team with sample data
- Identify FAQ sections → create GET /faq with sample data
- Identify pricing sections → create GET /pricing with sample data
- Identify service listings → create GET /services with sample data
- Include a GET /site-info endpoint with general site metadata
- Return ONLY the JSON, no markdown fences, no explanation`;

/**
 * Use Groq to analyze HTML and generate backend schema
 */
export async function analyzeAndGenerateBackendSchema(html, businessType = 'general') {
    try {
        const result = await groq.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            messages: [
                { role: 'system', content: AGENT_PROMPT },
                { role: 'user', content: `Business type: ${businessType}\n\nHTML to analyze:\n${html.substring(0, 15000)}` },
            ],
            temperature: 0.3,
            max_completion_tokens: 8192,
        });

        let text = result.choices[0]?.message?.content?.trim() || '';
        // Strip markdown fences
        text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?\s*```\s*$/i, '').trim();
        return JSON.parse(text);
    } catch (err) {
        console.error('Backend schema generation error:', err.message);
        return getDefaultSchema(businessType);
    }
}

function getDefaultSchema(type) {
    return {
        endpoints: [
            { method: 'GET', path: '/site-info', handler: 'getSiteInfo', fields: ['title', 'description', 'email'], sampleData: [{ title: 'My Website', description: 'A modern website', email: 'hello@site.com' }] },
            { method: 'POST', path: '/contact', handler: 'createContact', fields: ['name', 'email', 'message'], sampleData: [] },
            { method: 'POST', path: '/newsletter', handler: 'subscribeNewsletter', fields: ['email'], sampleData: [] },
            {
                method: 'GET', path: '/testimonials', handler: 'getTestimonials', fields: ['name', 'text', 'rating'], sampleData: [
                    { name: 'Happy Customer', text: 'Great experience!', rating: 5 },
                ]
            },
        ],
        collections: [
            { name: 'contacts', schema: { name: 'string', email: 'string', message: 'string' } },
            { name: 'newsletter', schema: { email: 'string' } },
            { name: 'testimonials', schema: { name: 'string', text: 'string', rating: 'number' } },
        ],
    };
}
