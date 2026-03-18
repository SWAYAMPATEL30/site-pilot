import { Palette, Rocket, Zap, PenTool, LayoutTemplate } from 'lucide-react';

export const TEMPLATES = [
    {
        id: 'professional-saas',
        name: 'Professional SaaS',
        description: 'Clean, corporate, and trustworthy design optimized for B2B software products.',
        icon: 'Rocket',
        previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        basePrompt: 'Design a highly professional B2B SaaS landing page. Use a clean white background with deep navy blue accents. Focus on trust, typography (Inter font), flat modular cards (bento grid style), and brutalist sharp borders. Include a hero section with a clear value proposition, a feature grid, pricing tiers, and a professional footer.'
    },
    {
        id: 'creative-agency',
        name: 'Creative Agency',
        description: 'Bold typography, dark mode defaults, and high-contrast layouts for portfolios.',
        icon: 'Palette',
        previewImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        basePrompt: 'Create a bold, creative agency portfolio website. Default to a dark mode aesthetic with high-contrast text and vibrant neon accents. Use oversized typography, asymmetric layouts, and ensure images take center stage. Include a showcase gallery, past client logos, and an intense full-screen call to action.'
    },
    {
        id: 'modern-minimal',
        name: 'Modern Minimalist',
        description: 'Stripped back, elegant, and focused entirely on content and spacing.',
        icon: 'PenTool',
        previewImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        basePrompt: 'Design a modern minimalist blog or article site. Use extreme whitespace, a subdued monochromatic color palette (off-whites and soft grays), and elegant serif typography mixed with clean sans-serif bodies. Keep structural boxes hidden; rely on spacing for visual hierarchy.'
    },
    {
        id: 'startup-app',
        name: 'Startup App Landing',
        description: 'High conversion, energetic, and feature-focused mobile app showcase.',
        icon: 'Zap',
        previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        basePrompt: 'Build a high-conversion landing page for a new mobile or web app startup. Use vibrant, energetic gradient backgrounds or colorful blobs. Include a floating device mockup in the hero section, social proof immediately visible, animated feature highlights, and multiple prominent "Download Now" style buttons.'
    },
    {
        id: 'ecommerce-store',
        name: 'eCommerce Storefront',
        description: 'Optimized product grids, clear cart calls to action, and promotional banners.',
        icon: 'LayoutTemplate',
        previewImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        basePrompt: 'Create an eCommerce storefront landing page. Focus on a clean, highly structured layout with an emphasis on product photography. Include a promotional top banner, sticky navigation with a cart icon, a large hero image advertising a sale, a grid of "Featured Products" with price tags and "Add to Cart" buttons, and an email newsletter signup footer.'
    }
];
