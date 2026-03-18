// AI Engine - Template-based intelligent generation
const BUSINESS_TEMPLATES = {
    restaurant: {
        layouts: ['hero', 'features', 'gallery', 'testimonials', 'pricing', 'contact', 'cta', 'footer'],
        navigation: ['Home', 'Menu', 'About', 'Reservations', 'Gallery', 'Contact'],
        colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'welcoming dining experience', features: 'cuisine specialties', gallery: 'beautiful dishes' },
    },
    technology: {
        layouts: ['hero', 'stats', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
        navigation: ['Home', 'Features', 'Pricing', 'About', 'Blog', 'Contact'],
        colors: { primary: '#6366f1', secondary: '#4f46e5', accent: '#06b6d4' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'innovative tech solution', features: 'cutting-edge capabilities', stats: 'impressive metrics' },
    },
    education: {
        layouts: ['hero', 'stats', 'features', 'gallery', 'testimonials', 'cta', 'footer'],
        navigation: ['Home', 'Courses', 'Instructors', 'About', 'Blog', 'Enroll'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#2ecc71' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'transformative learning', features: 'course offerings', gallery: 'campus and facilities' },
    },
    creative: {
        layouts: ['hero', 'gallery', 'about', 'team', 'testimonials', 'contact', 'footer'],
        navigation: ['Home', 'Portfolio', 'Services', 'About', 'Team', 'Contact'],
        colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#ec4899' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'creative excellence', gallery: 'stunning portfolio', team: 'talented creatives' },
    },
    ecommerce: {
        layouts: ['hero', 'features', 'gallery', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
        navigation: ['Home', 'Shop', 'Categories', 'About', 'FAQ', 'Contact'],
        colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#10b981' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'amazing products', features: 'why shop with us', gallery: 'product showcase' },
    },
    healthcare: {
        layouts: ['hero', 'features', 'stats', 'team', 'testimonials', 'contact', 'footer'],
        navigation: ['Home', 'Services', 'Doctors', 'About', 'Appointments', 'Contact'],
        colors: { primary: '#10b981', secondary: '#059669', accent: '#3b82f6' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'trusted healthcare', features: 'medical services', team: 'expert doctors' },
    },
    general: {
        layouts: ['hero', 'features', 'about', 'gallery', 'testimonials', 'cta', 'footer'],
        navigation: ['Home', 'About', 'Services', 'Gallery', 'Contact'],
        colors: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#06b6d4' },
        fonts: { heading: 'Outfit', body: 'Inter' },
        contentHints: { hero: 'your brand message', features: 'key offerings', about: 'your story' },
    },
};

const COMPONENT_GENERATORS = {
    hero: (ctx) => ({
        type: 'hero',
        props: {
            title: ctx.title || `Welcome to ${ctx.businessName || 'Your Business'}`,
            subtitle: ctx.subtitle || `Discover ${ctx.contentHint || 'amazing experiences'} that make a difference`,
            buttonText: ctx.buttonText || 'Get Started',
            buttonLink: ctx.buttonLink || '#features',
            backgroundStyle: 'gradient',
        },
    }),
    features: (ctx) => ({
        type: 'features',
        props: {
            title: ctx.title || `Why Choose ${ctx.businessName || 'Us'}`,
            items: ctx.items || [
                { icon: 'zap', title: 'Fast & Reliable', desc: 'Lightning-fast performance you can count on' },
                { icon: 'shield', title: 'Secure', desc: 'Enterprise-grade security for your peace of mind' },
                { icon: 'sparkles', title: 'Beautiful Design', desc: 'Stunning visuals that captivate your audience' },
                { icon: 'trending-up', title: 'Scalable', desc: 'Grows with your business effortlessly' },
            ],
        },
    }),
    gallery: (ctx) => ({
        type: 'gallery',
        props: {
            title: ctx.title || 'Our Gallery',
            images: ctx.images || ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg'],
        },
    }),
    testimonials: (ctx) => ({
        type: 'testimonials',
        props: {
            title: ctx.title || 'What People Say',
            items: ctx.items || [
                { name: 'Alex Johnson', text: 'Absolutely incredible experience! Highly recommend to everyone.', rating: 5 },
                { name: 'Sarah Williams', text: 'Professional, reliable, and exceeds expectations every time.', rating: 5 },
                { name: 'Mike Chen', text: 'The best decision we made for our business. Outstanding results.', rating: 4 },
            ],
        },
    }),
    pricing: (ctx) => ({
        type: 'pricing',
        props: {
            title: ctx.title || 'Our Pricing',
            items: ctx.items || [
                { name: 'Basic', price: '$29', desc: 'Perfect for getting started' },
                { name: 'Professional', price: '$79', desc: 'For growing businesses' },
                { name: 'Enterprise', price: '$199', desc: 'For large organizations' },
            ],
        },
    }),
    contact: (ctx) => ({
        type: 'contact',
        props: {
            email: ctx.email || 'hello@example.com',
            phone: ctx.phone || '+1 (555) 000-0000',
            address: ctx.address || '123 Business Street, City, State 12345',
        },
    }),
    stats: (ctx) => ({
        type: 'stats',
        props: {
            items: ctx.items || [
                { value: '10K+', label: 'Happy Customers' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
                { value: '50+', label: 'Countries' },
            ],
        },
    }),
    cta: (ctx) => ({
        type: 'cta',
        props: {
            title: ctx.title || 'Ready to Get Started?',
            subtitle: ctx.subtitle || 'Join thousands of satisfied customers today',
            buttonText: ctx.buttonText || 'Start Now',
            buttonLink: ctx.buttonLink || '/contact',
        },
    }),
    footer: (ctx) => ({
        type: 'footer',
        props: {
            companyName: ctx.businessName || 'Company Name',
            tagline: ctx.tagline || 'Building the future together',
            links: ctx.links || ['Home', 'About', 'Services', 'Contact', 'Privacy Policy'],
        },
    }),
    about: (ctx) => ({
        type: 'about',
        props: {
            title: ctx.title || `About ${ctx.businessName || 'Us'}`,
            description: ctx.description || 'We are a passionate team dedicated to delivering exceptional experiences. With years of expertise and a commitment to innovation, we help businesses thrive in the digital age.',
            mission: ctx.mission || 'Our mission is to empower organizations with tools and solutions that drive growth and success.',
        },
    }),
    team: (ctx) => ({
        type: 'team',
        props: {
            title: ctx.title || 'Meet Our Team',
            members: ctx.members || [
                { name: 'Jane Smith', role: 'CEO & Founder', avatar: 'briefcase' },
                { name: 'John Doe', role: 'CTO', avatar: 'laptop' },
                { name: 'Emily Brown', role: 'Head of Design', avatar: 'palette' },
            ],
        },
    }),
    faq: (ctx) => ({
        type: 'faq',
        props: {
            title: ctx.title || 'Frequently Asked Questions',
            items: ctx.items || [
                { question: 'How do I get started?', answer: 'Simply sign up for a free account and follow our step-by-step guide.' },
                { question: 'Is there a free trial?', answer: 'Yes! We offer a 14-day free trial with full access to all features.' },
                { question: 'Can I cancel anytime?', answer: 'Absolutely. No contracts, cancel anytime with no hidden fees.' },
            ],
        },
    }),
};

function detectBusinessType(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('restaurant') || p.includes('food') || p.includes('cafe') || p.includes('dining') || p.includes('bakery')) return 'restaurant';
    if (p.includes('tech') || p.includes('software') || p.includes('saas') || p.includes('app') || p.includes('startup')) return 'technology';
    if (p.includes('school') || p.includes('education') || p.includes('course') || p.includes('learn') || p.includes('academy')) return 'education';
    if (p.includes('design') || p.includes('creative') || p.includes('agency') || p.includes('portfolio') || p.includes('studio')) return 'creative';
    if (p.includes('shop') || p.includes('store') || p.includes('ecommerce') || p.includes('product') || p.includes('retail')) return 'ecommerce';
    if (p.includes('health') || p.includes('medical') || p.includes('doctor') || p.includes('clinic') || p.includes('hospital')) return 'healthcare';
    return 'general';
}

export function generateLayout(businessType, prompt, businessName) {
    const type = businessType || detectBusinessType(prompt || '');
    const template = BUSINESS_TEMPLATES[type] || BUSINESS_TEMPLATES.general;
    const ctx = { businessName: businessName || 'Your Business', contentHint: template.contentHints?.hero || '' };
    const components = template.layouts.map((compType) => {
        const generator = COMPONENT_GENERATORS[compType];
        if (!generator) return null;
        return { id: 'ai-' + Math.random().toString(36).substring(2, 8), ...generator({ ...ctx, ...template.contentHints }) };
    }).filter(Boolean);
    return { components, navigation: template.navigation, designSuggestions: template.colors, fontSuggestions: template.fonts, businessType: type };
}

export function generateComponent(componentType, context) {
    const generator = COMPONENT_GENERATORS[componentType];
    if (!generator) return null;
    return { id: 'ai-' + Math.random().toString(36).substring(2, 8), ...generator(context || {}) };
}

export function suggestNavigation(businessType) {
    const template = BUSINESS_TEMPLATES[businessType] || BUSINESS_TEMPLATES.general;
    return template.navigation;
}

export function suggestDesign(businessType) {
    const template = BUSINESS_TEMPLATES[businessType] || BUSINESS_TEMPLATES.general;
    return { colors: template.colors, fonts: template.fonts };
}

export function suggestSEO(page, businessName) {
    return {
        title: `${page.title} | ${businessName || 'Your Website'}`,
        description: `Discover ${page.title.toLowerCase()} at ${businessName || 'our website'}. Professional quality content and services.`,
        keywords: [page.title.toLowerCase(), businessName?.toLowerCase(), 'professional', 'quality'].filter(Boolean),
        ogTitle: `${page.title} - ${businessName || 'Website'}`,
        ogDescription: `Explore ${page.title.toLowerCase()} and learn more about what we offer.`,
    };
}

export function checkAccessibility(components) {
    const suggestions = [];
    components.forEach((comp, i) => {
        if (comp.type === 'hero' && !comp.props.buttonText) suggestions.push({ component: i, issue: 'Hero section missing call-to-action button', severity: 'warning' });
        if (comp.type === 'gallery' && (!comp.props.images || comp.props.images.length === 0)) suggestions.push({ component: i, issue: 'Gallery has no images - add alt text when images are added', severity: 'info' });
        if (comp.type === 'contact' && !comp.props.email) suggestions.push({ component: i, issue: 'Contact section missing email address', severity: 'warning' });
    });
    if (!components.find(c => c.type === 'footer')) suggestions.push({ component: -1, issue: 'Page is missing a footer section for navigation and accessibility', severity: 'warning' });
    return suggestions;
}

export function generateContentSuggestion(componentType, currentProps) {
    const suggestions = {
        hero: { title: 'Transform Your Business Today', subtitle: 'Join thousands who have already discovered a better way', buttonText: 'Start Free Trial' },
        features: { title: 'What Makes Us Different' },
        cta: { title: 'Don\'t Miss Out', subtitle: 'Limited time offer - Get started today', buttonText: 'Claim Your Spot' },
        about: { title: 'Our Story', description: 'Founded with a vision to revolutionize the industry, we have grown into a team of passionate professionals dedicated to excellence.' },
    };
    return suggestions[componentType] || {};
}

export const AVAILABLE_COMPONENTS = Object.keys(COMPONENT_GENERATORS);
export const BUSINESS_TYPES = Object.keys(BUSINESS_TEMPLATES);