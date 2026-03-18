// ─── Skeletal Template Builder — Design System Definitions & Payload Compiler ─
// Compiles a structured, instruction-rich prompt for the Gemini API that ensures
// a single self-contained HTML file output with embedded CSS + JS.

// ── Prebuilt Templates ────────────────────────────────────────────────────────
export const PREBUILT_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'Minimalist',
    description: 'Clean geometry, generous whitespace, refined Swiss-grid typography',
    palette: ['#FFFFFF', '#F9FAFB', '#111111', '#6B7280', '#0066FF'],
    fontPreview: 'Inter',
    sections: [
      'Sticky navbar (logo left, links center, CTA button right)',
      'Hero (centered headline, subtitle, two buttons, trust-signal row)',
      'Feature cards (3-column icon grid)',
      'Stats bar (4 large numbers spanning full width)',
      'Testimonials (3-column card row)',
      'CTA strip (centered heading + one button)',
      'Mega footer (4-column: brand + 3 link groups)',
    ],
    geminiInstructions: `
DESIGN SYSTEM: PROFESSIONAL MINIMALIST

Color Rules:
  - Background: pure white #FFFFFF, and light surface #F9FAFB for alternate sections
  - All headings: #111111 (near-black)
  - Body text: #374151, secondary labels: #6B7280
  - ONE accent: electric blue #0066FF (buttons, active links, icon highlights ONLY)
  - Zero gradients anywhere — solid colors only
  - Card backgrounds: #FFFFFF, borders: 1px solid #E5E7EB

Typography:
  - @import Inter (weights 300–800) from Google Fonts
  - Headings: Inter 700–800, tight tracking (-0.02em)
  - Body: Inter 400–500, line-height 1.7
  - Section labels & captions: UPPERCASE, letter-spacing 0.08em, 11–13px
  - No decorative or serif fonts

Layout — STRICT RULES:
  - Container max-width: 1200px, centered with auto margins
  - Section vertical padding: 120px top + bottom
  - 0px border-radius on ALL elements (cards, buttons, inputs, images) — NO rounded corners
  - CSS Grid for all multi-column layouts (repeat(3, 1fr) etc.)

Components:
  - Buttons: flat fill (blue bg + white text) OR ghost (1px #111 border + #111 text, transparent bg)
  - Cards: white bg, 1px solid #E5E7EB border, 0px radius, NO box-shadow
  - Navbar: position:sticky top:0, white bg, 1px solid #E5E7EB bottom border, NO blur/backdrop
  - Section dividers: 1px solid #E5E7EB horizontal rule between sections
  - Icon boxes: plain 40×40px square, blue bg, white icon — absolutely NO rounded shapes
  - Hover states: border-color to #111 only — no transforms or scale effects`,
  },

  {
    id: 'casual',
    name: 'Casual',
    subtitle: 'Glassmorphism',
    description: 'Frosted glass surfaces, ambient gradient orbs, fluid animations',
    palette: ['#0D0D1A', '#1A1A2E', '#8B5CF6', '#06B6D4', 'rgba(255,255,255,0.07)'],
    fontPreview: 'Outfit',
    sections: [
      'Floating glass navbar (fixed, blur, transparent bg)',
      'Hero (centered, gradient text on H1, animated floating shapes)',
      'Feature cards (glass morphism panels, 3-col)',
      'Stats row (4 large glowing numbers)',
      'Testimonials (glass cards)',
      'CTA (glow button, gradient background block)',
      'Footer (minimal dark with social links)',
    ],
    geminiInstructions: `
DESIGN SYSTEM: GLASSMORPHISM / CASUAL

Color Rules:
  - Body background: #0D0D1A (very dark navy-black)
  - Inject 3 fixed background "orb" divs (position:fixed, pointer-events:none, z-index:0):
      Orb 1: top:-10%, left:-5%, 700px × 700px, radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%), filter:blur(80px)
      Orb 2: top:30%, right:-10%, 600px × 600px, radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 65%), filter:blur(80px)
      Orb 3: bottom:5%, left:25%, 500px × 500px, radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%), filter:blur(80px)
  - Primary: purple #8B5CF6, Secondary: #6D28D9, Accent: cyan #06B6D4
  - Text: white #FFFFFF, secondary: #A0A0B8

Typography:
  - @import Outfit (400–900) + Inter (400–600) from Google Fonts
  - All H1–H3: Outfit, gradient text: background: linear-gradient(135deg, #FFFFFF, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent
  - Body: Inter

Components — CRITICAL:
  - ALL cards: background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.3)
  - Card hover: transform: translateY(-6px); box-shadow: 0 16px 48px rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.3)
  - Navbar: position:fixed; background: rgba(255,255,255,0.02); backdrop-filter: blur(32px); border-bottom: 1px solid rgba(255,255,255,0.06); border-radius: 0
  - Buttons: border-radius: 99px (pill); Primary: bg rgba(139,92,246,0.15), border 1px solid rgba(139,92,246,0.5), box-shadow: 0 0 24px rgba(139,92,246,0.3)
  - Badges: pill shape, glass treatment, border: 1px solid rgba(255,255,255,0.15)
  - Icon containers: 48×48px circle, background rgba(139,92,246,0.15), border 1px solid rgba(139,92,246,0.3)

Animations:
  - @keyframes float: translateY(0px) → translateY(-12px) → translateY(0px), 3s ease-in-out infinite
  - Apply float animation to hero image/decorative element with animation-delay variations
  - Scroll reveal via IntersectionObserver: opacity 0 → 1, translateY(30px) → translateY(0)`,
  },

  {
    id: 'funky',
    name: 'Funky',
    subtitle: 'Neo-Brutalism',
    description: 'Raw borders, offset shadows, bold asymmetry, maximum energy',
    palette: ['#FFFFF0', '#FFEC3D', '#FF6B35', '#0A0A0A', '#2D2DE0'],
    fontPreview: 'Space Grotesk',
    sections: [
      'Navbar (thick black border, logo left, links right)',
      'Hero (yellow background, oversized UPPERCASE heading, offset CTA button)',
      'Ticker marquee strip (black border top + bottom, scrolling text)',
      'Feature cards (heavy black borders, offset shadows, colored icon boxes)',
      'Stats section (massive numbers, black bold)',
      'Testimonials (box-style, bordered)',
      'Footer (pure black bg, white text, link columns)',
    ],
    geminiInstructions: `
DESIGN SYSTEM: NEO-BRUTALISM / FUNKY

Color Rules:
  - Body background: #FFFFF0 (warm off-white)
  - Hero section background: #FFEC3D (bright yellow)
  - Footer background: #0A0A0A (near black), text: #FAFAFA
  - Alternating section accents: #FF6B35 (orange) or #2D2DE0 (electric blue) for select elements
  - ALL text on light sections: #0A0A0A
  - Accent highlights: yellow #FFEC3D, orange #FF6B35, or blue #2D2DE0

Typography:
  - @import Space Grotesk (400–700) from Google Fonts
  - ALL headings: Space Grotesk 700–900, UPPERCASE, letter-spacing -0.01em
  - Hero H1: clamp(56px, 10vw, 120px), uppercase, near-black
  - Body: Space Grotesk 400, line-height 1.6
  - Numbers/stats: 80–100px, bold, often in a contrasting accent color

Layout — ABSOLUTE RULES (break any of these = wrong):
  - border-radius: 0px on EVERYTHING — cards, buttons, inputs, images, badges, ALL elements
  - ALL cards: border: 3px solid #0A0A0A; box-shadow: 6px 6px 0px #0A0A0A
  - ALL buttons: border: 3px solid #0A0A0A; box-shadow: 4px 4px 0px #0A0A0A; background: #FFEC3D; color: #0A0A0A
  - Button hover: transform: translate(4px, 4px); box-shadow: none (shadow jumps to zero)
  - Section borders: 3px solid #0A0A0A on border-top + border-bottom for each section
  - Sticky navbar: border-bottom: 3px solid #0A0A0A; background: #FFFFF0
  - Icon boxes: solid yellow or orange filled square, 3px black border

Specific Patterns:
  - Marquee ticker: <div style="overflow:hidden; border-top:3px solid #0A0A0A; border-bottom:3px solid #0A0A0A; padding:16px 0;"> with scrolling span via CSS animation (translateX from 0 to -50%)
  - Decorative sticker: position:absolute element with text like "★ NEW" or "EST. 2025", rotated 10-15deg, yellow bg, black border, 0px radius
  - Use CSS counter or large inline numbers (01, 02, 03) for feature/step numbering in 80px font`,
  },

  {
    id: 'elegant',
    name: 'Elegant',
    subtitle: 'Dark Luxury',
    description: 'Obsidian backgrounds, gold accents, editorial serif typography',
    palette: ['#080808', '#141414', '#D4AF37', '#C9B48A', '#FFFFFF'],
    fontPreview: 'Cormorant Garamond',
    sections: [
      'Navbar (dark, thin gold bottom border, logo centered or left)',
      'Hero (full 100vh, large serif heading, cinematic breathing room)',
      'Feature rows (editorial alternating image + text, 3 rows)',
      'Gallery/showcase (dark cards with gold border)',
      'Testimonials (pull-quote style, oversized gold quotation marks)',
      'CTA block (dark + gold border + ghost button)',
      'Luxury footer (4-column: brand + 3 link groups, gold accents)',
    ],
    geminiInstructions: `
DESIGN SYSTEM: LUXURY DARK / ELEGANT

Color Rules:
  - Body background: #080808 (true black)
  - Card/section backgrounds: #141414, #101010 for variety
  - ONLY gold as accent: #D4AF37 (bright gold), #C9B48A (warm champagne gold)
  - Text: #FFFFFF primary, #D1D5DB secondary, #6B7280 muted
  - NEVER use blue, green, purple, red — ONLY gold/cream + white + black

Typography — CRITICAL:
  - @import 'Cormorant Garamond' (300, 400, 500, 600) + 'Jost' (300, 400, 500, 600) from Google Fonts
  - ALL h1, h2, h3, h4: font-family: 'Cormorant Garamond', serif; font-weight: 500–600; font-style: italic on h1
  - Body, nav links, UI labels: font-family: 'Jost', sans-serif
  - Hero H1: clamp(52px, 8vw, 96px); letter-spacing: 0.02em; font-style: italic
  - Subheadings: uppercase, tracked (letter-spacing: 0.2em), 12–14px, Jost 400, color: #D4AF37
  - Gold gradient text for major headings: background: linear-gradient(135deg, #D4AF37 0%, #C9B48A 50%, #D4AF37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent

Layout:
  - Max border-radius: 4px (nearly square)
  - Section padding: 140px vertical (very generous)
  - Cards: background #141414; border: 1px solid rgba(212,175,55,0.2); box-shadow: 0 4px 24px rgba(212,175,55,0.06)
  - Navbar: position:sticky; background: #080808; border-bottom: 1px solid rgba(212,175,55,0.3)
  - Section ornamental divider: thin 1px gold line with a centered ◆ or ✦ symbol in gold

Components:
  - Buttons PRIMARY: background: transparent; border: 1px solid #D4AF37; color: #D4AF37; letter-spacing: 0.1em; UPPERCASE; text: Jost 500
  - Button hover: background: #D4AF37; color: #080808
  - Testimonials: oversized opening " in #D4AF37 (font-size: 120px; line-height: 0.6; font-family: Cormorant)
  - Feature rows: alternating 2-col (55%/45%) with a tall image placeholder, text block with numbered label in gold

Animations:
  - Subtle fade + translate-up on scroll via IntersectionObserver
  - No bounce, no rapid motion — everything moves slowly and elegantly
  - transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
  },

  {
    id: 'playful',
    name: 'Playful',
    subtitle: 'Neumorphism',
    description: 'Soft extruded shadows, tactile depth, bubbly rounded forms',
    palette: ['#E8ECF0', '#DDE3EA', '#6C63FF', '#FF6584', '#43D99B'],
    fontPreview: 'Nunito',
    sections: [
      'Navbar (neumorphic, no border, logo left)',
      'Hero (large neumorphic card container with headline inside)',
      'Feature cards (neumorphic raised panels, 3-col)',
      'Stats row (neumorphic badge counters)',
      'Testimonials (neumorphic cards with inset avatar)',
      'CTA (soft neumorphic action card)',
      'Footer (light, minimal, soft)',
    ],
    geminiInstructions: `
DESIGN SYSTEM: NEUMORPHISM / PLAYFUL

Color Rules — ABSOLUTE:
  - Body background: EXACTLY #E8ECF0 — every element that is "raised" MUST share this same bg color
  - Neumorphic raised shadow (EXACT): box-shadow: 8px 8px 16px #c8cdd3, -8px -8px 16px #ffffff
  - Neumorphic pressed/inset shadow (EXACT): box-shadow: inset 4px 4px 8px #c8cdd3, inset -4px -4px 8px #ffffff
  - NO borders on cards (shadows provide the illusion of depth)
  - Accent: purple #6C63FF, coral-pink #FF6584, mint #43D99B
  - Dark text ONLY: #2D3748 primary, #4A5568 secondary, #718096 muted
  - This is a LIGHT theme — no dark backgrounds

Typography:
  - @import Nunito (400–800, Extra Bold) from Google Fonts — this font is key for the playful feel
  - ALL text: Nunito
  - Headings: Nunito 700–800
  - Body: Nunito 400–500, line-height 1.7

Components — EVERY element uses neumorphic treatment:
  - All cards: background: #E8ECF0; border: none; border-radius: 20px; box-shadow: 8px 8px 16px #c8cdd3, -8px -8px 16px #ffffff; padding: 32px
  - Card hover: box-shadow: 12px 12px 24px #c8cdd3, -12px -12px 24px #ffffff; transform: scale(1.02)
  - Buttons (raised): background: #E8ECF0; border: none; border-radius: 20px; box-shadow: 6px 6px 12px #c8cdd3, -6px -6px 12px #ffffff; color: #6C63FF; font-weight: 700
  - Button hover: box-shadow: inset 4px 4px 8px #c8cdd3, inset -4px -4px 8px #ffffff (pressed)
  - Input fields: border: none; background: #E8ECF0; box-shadow: inset 4px 4px 8px #c8cdd3, inset -4px -4px 8px #ffffff; border-radius: 14px
  - Icon containers: 60×60px circle, same neumorphic shadow, flex center, accent-color icon
  - Navbar: background: #E8ECF0; box-shadow: 4px 4px 10px #c8cdd3, -4px -4px 10px #ffffff; no border

Specific Patterns:
  - Float 4–6 small decorative circles (20–40px, accent colors, position:absolute) in the hero background
  - Use large emoji-style icons (2–3rem) alongside Lucide icons for a playful feel
  - Neumorphic progress indicators or badges for stats section
  - All border-radius: minimum 16px, cards/buttons at 20px, circles at 50%`,
  },
];

// ── Component Library ─────────────────────────────────────────────────────────
export const COMPONENT_LIBRARY = {
  navbar: {
    label: 'Navigation Bar',
    icon: '⬛',
    variants: [
      {
        id: 'navbar-1',
        name: 'Classic App Bar',
        description: 'Logo left · links center · CTA button right',
        geminiHint: 'Sticky navbar: logo + brand name far-left, 4–5 navigation links in the center, one prominent CTA button (e.g. "Get Started" or "Sign Up") far-right. Mobile: hide links, show hamburger icon that toggles a dropdown menu via JavaScript.',
      },
      {
        id: 'navbar-2',
        name: 'Centered Brand',
        description: 'Logo centered · links split symmetrically left & right',
        geminiHint: 'Navbar with brand logo/wordmark exactly centered, 3 navigation links on the left half and 3 on the right half. Symmetrical and balanced. No separate CTA button — the rightmost link acts as the call-to-action with a subtle visual distinction.',
      },
      {
        id: 'navbar-3',
        name: 'Mega Menu',
        description: 'Primary links with hoverable dropdown mega-menu panels',
        geminiHint: 'Navbar with logo far-left, 3–4 top-level nav links each with a down-arrow indicator. On hover, a full-width mega-menu panel drops down showing 3 columns of sub-links with icons and descriptions. Right side: search icon + user avatar icon. JavaScript handles hover open/close with smooth CSS transitions.',
      },
      {
        id: 'navbar-4',
        name: 'Minimal Strip',
        description: 'Logo only left · single CTA right · ultra-clean',
        geminiHint: 'Ultra-minimal navbar: logo/wordmark far-left, one CTA button far-right. No navigation links in the bar — only a hamburger icon (hidden on desktop, shown on mobile) that opens a fullscreen overlay menu via JavaScript. Maximum breathing room.',
      },
      {
        id: 'navbar-5',
        name: 'Announcement + Nav',
        description: 'Thin promo bar above · standard navbar below',
        geminiHint: 'Two-layer header: thin announcement/promo bar on very top (colored background, centered short promotional text + optional × dismiss button that hides the bar via JavaScript). Standard navbar directly below with logo left, links center, CTA right.',
      },
    ],
  },

  hero: {
    label: 'Hero Section',
    icon: '⬜',
    variants: [
      {
        id: 'hero-1',
        name: 'Centered Minimal',
        description: 'Badge · bold H1 · subtitle · dual CTA buttons',
        geminiHint: 'Centered hero (min-height: 90vh, flex center): small badge/tag element above the heading, large bold H1 (2–3 lines, clamp(42px, 7vw, 72px)), one-sentence subtitle paragraph in a muted color, two side-by-side CTA buttons (primary filled + secondary ghost). Below the buttons: a row of 4–5 trust badges or partner logos. No background image — use the theme\'s gradient or solid background.',
      },
      {
        id: 'hero-2',
        name: 'Split Screen',
        description: '50/50 split: content text left · product visual right',
        geminiHint: 'Two-column hero (CSS Grid 1fr 1fr, align-items:center, min-height: 90vh): left column has badge, H1, subtitle paragraph, two stacked or side-by-side CTA buttons; right column has a large product screenshot, device mockup, or illustration in a styled container with a themed border/shadow. Mobile: columns stack vertically (content top, image bottom).',
      },
      {
        id: 'hero-3',
        name: 'Typographic Bold',
        description: 'Oversized display H1 spanning full width',
        geminiHint: 'Typography-first hero: enormous H1 (clamp(64px, 12vw, 140px), font-weight 900) spanning the full container width, line-breaks for visual rhythm. ONE keyword in the heading highlighted with a different color or background fill. Below: single subtitle line (max 70 chars) + one CTA button. Optional: thin horizontal CSS marquee/ticker strip scrolling company name or tagline.',
      },
      {
        id: 'hero-4',
        name: 'Bento Grid',
        description: 'Heading top · staggered bento-card mosaic below',
        geminiHint: 'Bento-style hero: centered heading (H1) and subtitle at the top. Below: a CSS grid "bento mosaic" — approximately 4 cells at varying sizes: one tall-wide card (grid-row/column span), two standard cards, one wide short card. Cards show product features, stats (big number + label), or feature screenshots. Each card is themed with the design system.',
      },
      {
        id: 'hero-5',
        name: 'Immersive Overlay',
        description: 'Full-screen gradient bg · centered overlay text · scroll arrow',
        geminiHint: 'Full 100vh hero: body-spanning gradient background (use 2–3 color radial gradient positioned asymmetrically). Semi-transparent dark overlay div (background: rgba(0,0,0,0.4)). Content: bold white H1, subtitle, one CTA button — all absolutely centered (flexbox center). At the very bottom center: animated bouncing scroll-down arrow (CSS keyframe, no JS needed).',
      },
    ],
  },

  features: {
    label: 'Features / Services',
    icon: '⊞',
    variants: [
      {
        id: 'features-1',
        name: 'Icon Card Grid',
        description: '3–4 themed cards each with icon · title · description',
        geminiHint: 'Features section: centered section-heading H2 + subtext paragraph. Then a responsive 3-column grid of feature cards. Each card contains: a 48×48 colored icon container (emoji or lucide icon), bold feature title (H3), 2-sentence description in muted color. Cards use the theme\'s card styling. Mobile: single column.',
      },
      {
        id: 'features-2',
        name: 'Alternating Rows',
        description: 'Image alternates left/right with text + bullet list',
        geminiHint: 'Feature rows section: 3 alternating two-column rows (each row min-height 400px). Row 1: large image/illustration placeholder on LEFT, feature number (01), feature title H3, description paragraph, 3 checkmark bullet-list items on RIGHT. Row 2: text LEFT, image RIGHT. Row 3: image LEFT. Add a themed horizontal divider between rows. Mobile: stacks vertically.',
      },
      {
        id: 'features-3',
        name: 'Stats + Cards',
        description: 'Animated stat counters above · icon cards below',
        geminiHint: 'Two-part section. TOP: a full-width stats strip with 4 large animated counter numbers (e.g. "50K+ Users", "99.9% Uptime", "24/7 Support", "150+ Countries") — use IntersectionObserver + JS to animate the numbers counting up from 0 when visible. BOTTOM: standard 3-column icon feature cards (same structure as Icon Card Grid variant).',
      },
      {
        id: 'features-4',
        name: 'Tabbed Interface',
        description: 'Click-to-reveal: tab list left · feature detail right',
        geminiHint: 'Tabbed features section: left column (35%, flex-col) has 3–4 tab buttons stacked vertically; right column (65%) shows the selected tab\'s content: H3 title, description paragraph, 3 bullet points with checkmark icons, and a large placeholder product screenshot. JavaScript handles the tab-switching: adds .active class to clicked tab, shows the matching content panel, hides others. Add smooth CSS transition on content change.',
      },
      {
        id: 'features-5',
        name: 'Process Timeline',
        description: 'Numbered steps connected by a visual line',
        geminiHint: 'How-it-works timeline section: 4 numbered steps in a row (desktop) or column (mobile). Each step has: large step number (60–80px font, styled as "01" "02" etc.), step title H4, brief 1–2 sentence description. Steps connected by a dashed or solid line using CSS ::before or ::after pseudo-elements (position:absolute, horizontal line at step-number height). Mobile: vertical stacked layout with vertical connecting line.',
      },
    ],
  },

  footer: {
    label: 'Footer',
    icon: '▬',
    variants: [
      {
        id: 'footer-1',
        name: 'Simple Brand',
        description: 'Centered logo · social icons · copyright — nothing more',
        geminiHint: 'Minimal centered footer: logo/brand name in the theme font, tagline below in muted color, then a horizontal row of 5 social-media icon links (use Lucide icons: twitter, linkedin, github, instagram, youtube) spaced evenly, then a thin divider line, then copyright text. No link columns. Simple and clean.',
      },
      {
        id: 'footer-2',
        name: 'Four-Column Mega',
        description: 'Brand info + 3 link columns: Product · Company · Legal',
        geminiHint: 'Four-column footer (CSS Grid 1fr 1fr 1fr 1fr): Column 1 has logo, 2-sentence company description, row of 4 social icons; Column 2 "Product" with 6 inline-link items; Column 3 "Company" with 6 items; Column 4 "Legal" with 5 items. Bottom row (border-top): copyright text left, optional language selector or back-to-top link right. Mobile: 2×2 grid, then 1-col.',
      },
      {
        id: 'footer-3',
        name: 'Newsletter CTA',
        description: 'Bold subscribe CTA above · minimal copyright strip below',
        geminiHint: 'Footer with two zones. TOP ZONE: large bold heading ("Stay in the loop" or "Get updates"), subtitle, then an inline email subscribe form (text input + submit button side by side, using flexbox). BOTTOM ZONE: thin border-top divider, then one row with logo/brand left, 5 inline nav links centered, copyright text right. JavaScript shows a success message on form submit.',
      },
      {
        id: 'footer-4',
        name: 'Two-Column',
        description: 'Brand + social left · two link groups right',
        geminiHint: 'Two-section footer (CSS Grid 40% 60%): LEFT: logo + company description (2 sentences) + row of 4 social icon links stacked; RIGHT: two side-by-side columns of navigation links each with a heading (e.g. "Services", "Company") and 5–6 links. Bottom: thin border-top + copyright strip spanning full width.',
      },
      {
        id: 'footer-5',
        name: 'Minimal Strip',
        description: 'Single bar: logo left · inline links · copyright right',
        geminiHint: 'Ultra-minimal single-row footer: border-top, then one horizontal flex row with: logo/wordmark far-left, 5 inline navigation links centered (using flex gap), copyright text far-right. Padding 24px vertical. Absolutely nothing else — no columns, no social icons, no extras.',
      },
    ],
  },
};

// ── Payload Compiler ──────────────────────────────────────────────────────────

const BASE_REQUIREMENTS = `╔══════════════════════════════════════════════════════════╗
║           OUTPUT FORMAT — MANDATORY REQUIREMENTS          ║
╚══════════════════════════════════════════════════════════╝

1.  Output ONLY a single, complete HTML file
2.  Begin with <!DOCTYPE html> — absolutely nothing before it
3.  ALL CSS inside ONE <style> tag in <head>
4.  ALL JavaScript inside ONE <script> tag before </body>
5.  NO external CSS files or frameworks (no Bootstrap, no Tailwind, no CDN stylesheets)
6.  Google Fonts: use @import inside the <style> tag ONLY
7.  Lucide icons: load via <script src="https://unpkg.com/lucide@latest"></script>, call lucide.createIcons() at end of your <script>
8.  All images: https://picsum.photos/{width}/{height}?random={n} (increment n for each image)
9.  Fully responsive: include @media (max-width: 768px) breakpoint CSS
10. Include JavaScript for: smooth scroll, mobile menu toggle, scroll-reveal animations via IntersectionObserver
11. Valid HTML5 meta tags: charset, viewport, title, meta description
12. Write REAL content — no "Lorem ipsum". Invent a realistic company name, taglines, and copy.
13. The page must look complete, polished, and production-ready`.trim();

/**
 * Compiles a user's template selection + prompt into a structured Gemini API payload.
 * @param {Object} opts
 * @param {'prebuilt'|'custom'|'plain'} opts.mode
 * @param {string} [opts.templateId] - ID of prebuilt template
 * @param {Object} [opts.selections] - { navbar: 'navbar-2', hero: 'hero-1', ... }
 * @param {string} opts.userPrompt - User's description of what to build
 * @returns {{ enhancedPrompt: string, mode: string, templateName: string|null }}
 */
export function compilePayload({ mode, templateId, selections, userPrompt }) {
  const prompt = userPrompt?.trim() || 'Build a professional business website.';

  // ── Prebuilt Template ──────────────────────────────────────────────────────
  if (mode === 'prebuilt') {
    const template = PREBUILT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return _plainPayload(prompt);

    const enhancedPrompt = [
      BASE_REQUIREMENTS,
      '',
      `╔══════════════════════════════════════════════════════════╗`,
      `║  DESIGN SYSTEM: ${template.name.toUpperCase()} — ${template.subtitle.toUpperCase()}`,
      `╚══════════════════════════════════════════════════════════╝`,
      template.geminiInstructions.trim(),
      '',
      `╔══════════════════════════════════════════════════════════╗`,
      `║  PAGE SECTIONS (include ALL, in this exact order)        ║`,
      `╚══════════════════════════════════════════════════════════╝`,
      template.sections.map((s, i) => `  ${i + 1}. ${s}`).join('\n'),
      '',
      `╔══════════════════════════════════════════════════════════╗`,
      `║  USER'S WEBSITE REQUEST                                  ║`,
      `╚══════════════════════════════════════════════════════════╝`,
      prompt,
    ].join('\n');

    return {
      enhancedPrompt,
      mode: 'prebuilt',
      templateId,
      templateName: `${template.name} — ${template.subtitle}`,
    };
  }

  // ── Custom Component Build ─────────────────────────────────────────────────
  if (mode === 'custom') {
    const componentHints = Object.entries(selections || {})
      .filter(([, v]) => v)
      .map(([sectionKey, variantId]) => {
        const section = COMPONENT_LIBRARY[sectionKey];
        const variant = section?.variants.find(v => v.id === variantId);
        if (!variant) return null;
        return [
          `── ${section.label.toUpperCase()}: "${variant.name}" ──`,
          variant.geminiHint,
        ].join('\n');
      })
      .filter(Boolean);

    if (componentHints.length === 0) return _plainPayload(prompt);

    const sectionOrder = ['navbar', 'hero', 'features', 'footer'];
    const orderedHints = sectionOrder
      .map(k => {
        if (!selections?.[k]) return null;
        const section = COMPONENT_LIBRARY[k];
        const variant = section?.variants.find(v => v.id === selections[k]);
        if (!variant) return null;
        return `── ${section.label.toUpperCase()}: "${variant.name}" ──\n${variant.geminiHint}`;
      })
      .filter(Boolean);

    const enhancedPrompt = [
      BASE_REQUIREMENTS,
      '',
      `╔══════════════════════════════════════════════════════════╗`,
      `║  PAGE COMPONENT SPECIFICATIONS                           ║`,
      `╚══════════════════════════════════════════════════════════╝`,
      'Build each section EXACTLY as described. Ensure visual consistency — pick ONE cohesive color palette and font pairing for the entire page.',
      '',
      orderedHints.join('\n\n'),
      '',
      `╔══════════════════════════════════════════════════════════╗`,
      `║  USER'S WEBSITE REQUEST                                  ║`,
      `╚══════════════════════════════════════════════════════════╝`,
      prompt,
    ].join('\n');

    const selectedNames = sectionOrder
      .filter(k => selections?.[k])
      .map(k => {
        const v = COMPONENT_LIBRARY[k]?.variants.find(v => v.id === selections[k]);
        return v ? `${COMPONENT_LIBRARY[k].label}: ${v.name}` : null;
      })
      .filter(Boolean)
      .join(', ');

    return {
      enhancedPrompt,
      mode: 'custom',
      selections,
      templateName: `Custom Build (${selectedNames})`,
    };
  }

  return _plainPayload(prompt);
}

function _plainPayload(prompt) {
  return {
    enhancedPrompt: `${BASE_REQUIREMENTS}\n\n╔══════════════════════════════════════════════════════════╗\n║  USER'S WEBSITE REQUEST                                  ║\n╚══════════════════════════════════════════════════════════╝\n${prompt}`,
    mode: 'plain',
    templateName: null,
  };
}
