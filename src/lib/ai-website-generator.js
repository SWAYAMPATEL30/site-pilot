// AI Website Generator — Generates complete, self-contained HTML websites
// Simulates an LLM that produces production-quality websites from prompts

function detectBusinessType(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('restaurant') || p.includes('food') || p.includes('cafe') || p.includes('dining') || p.includes('bakery') || p.includes('pizza') || p.includes('sushi') || p.includes('bar')) return 'restaurant';
    if (p.includes('tech') || p.includes('software') || p.includes('saas') || p.includes('app') || p.includes('startup') || p.includes('ai') || p.includes('cloud')) return 'technology';
    if (p.includes('school') || p.includes('education') || p.includes('course') || p.includes('learn') || p.includes('academy') || p.includes('university')) return 'education';
    if (p.includes('design') || p.includes('creative') || p.includes('agency') || p.includes('portfolio') || p.includes('studio') || p.includes('photo') || p.includes('art')) return 'creative';
    if (p.includes('shop') || p.includes('store') || p.includes('ecommerce') || p.includes('product') || p.includes('retail') || p.includes('fashion') || p.includes('boutique')) return 'ecommerce';
    if (p.includes('health') || p.includes('medical') || p.includes('doctor') || p.includes('clinic') || p.includes('hospital') || p.includes('dental') || p.includes('fitness') || p.includes('gym') || p.includes('yoga')) return 'healthcare';
    if (p.includes('law') || p.includes('consult') || p.includes('finance') || p.includes('real estate') || p.includes('insurance') || p.includes('accounting')) return 'professional';
    return 'general';
}

function extractDetails(prompt) {
    const details = {};
    const p = prompt.toLowerCase();
    
    const nameMatch = prompt.match(/(?:called|named|for)\s+["']?([A-Z][A-Za-z\s&']{1,30})["']?/i);
    if (nameMatch) details.businessName = nameMatch[1].trim();
    
    if (p.match(/blue/)) details.colorHint = 'blue';
    if (p.match(/red/)) details.colorHint = 'red';
    if (p.match(/green/)) details.colorHint = 'green';
    if (p.match(/purple/)) details.colorHint = 'purple';
    if (p.match(/orange/)) details.colorHint = 'orange';
    if (p.match(/pink/)) details.colorHint = 'pink';
    if (p.match(/dark/)) details.darkMode = true;
    if (p.match(/light/)) details.darkMode = false;
    
    // Design Theme Detection
    if (p.match(/neobrutal/i) || p.match(/brutal/i) || p.match(/neo-brutal/i)) details.theme = 'neobrutalist';
    else if (p.match(/glass/i) || p.match(/glassmorphism/i) || p.match(/frosted/i)) details.theme = 'glassmorphism';
    else if (p.match(/minimal/i) || p.match(/minimalist/i) || p.match(/professional minimalist/i)) details.theme = 'minimalist';
    else if (p.match(/luxury/i) || p.match(/elegant/i) || p.match(/dark luxury/i) || p.match(/cormorant/i) || p.match(/gold accent/i)) details.theme = 'luxury-dark';
    else if (p.match(/neumorphi/i) || p.match(/playful/i) || p.match(/soft shadow/i) || p.match(/extruded/i)) details.theme = 'neumorphic';
    else details.theme = 'modern'; // Default
    
    return details;
}

const COLOR_SCHEMES = {
    default: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#06b6d4', bg: '#0a0a0f', bgCard: '#12121a', text: '#f0f0f5', textMuted: '#a0a0b8', inputBg: '#1a1a24' },
    blue: { primary: '#3b82f6', secondary: '#2563eb', accent: '#06b6d4', bg: '#0a0f1a', bgCard: '#111827', text: '#f0f5ff', textMuted: '#94a3b8', inputBg: '#1f2937' },
    red: { primary: '#ef4444', secondary: '#dc2626', accent: '#f59e0b', bg: '#0f0a0a', bgCard: '#1a1111', text: '#fef2f2', textMuted: '#b8a0a0', inputBg: '#2a1a1a' },
    green: { primary: '#10b981', secondary: '#059669', accent: '#3b82f6', bg: '#0a0f0d', bgCard: '#111a16', text: '#f0fdf4', textMuted: '#a0b8ad', inputBg: '#1a241f' },
    purple: { primary: '#a855f7', secondary: '#7e22ce', accent: '#ec4899', bg: '#0f0a1a', bgCard: '#1a1127', text: '#f5f0ff', textMuted: '#b8a0d4', inputBg: '#2a1a3a' },
    orange: { primary: '#f59e0b', secondary: '#d97706', accent: '#ef4444', bg: '#0f0d0a', bgCard: '#1a1611', text: '#fffbeb', textMuted: '#b8ad92', inputBg: '#2a241a' },
    pink: { primary: '#ec4899', secondary: '#db2777', accent: '#8b5cf6', bg: '#0f0a0d', bgCard: '#1a1116', text: '#fdf2f8', textMuted: '#b8a0ad', inputBg: '#2a1a24' },
    
    restaurant: { primary: '#ef4444', secondary: '#b91c1c', accent: '#f59e0b', bg: '#0c0a09', bgCard: '#1c1917', text: '#fafaf9', textMuted: '#a8a29e', inputBg: '#292524' },
    technology: { primary: '#3b82f6', secondary: '#1d4ed8', accent: '#06b6d4', bg: '#020617', bgCard: '#0f172a', text: '#f8fafc', textMuted: '#94a3b8', inputBg: '#1e293b' },
    education: { primary: '#10b981', secondary: '#047857', accent: '#3b82f6', bg: '#022c22', bgCard: '#064e3b', text: '#ecfdf5', textMuted: '#6ee7b7', inputBg: '#065f46' },
    creative: { primary: '#a855f7', secondary: '#7e22ce', accent: '#ec4899', bg: '#170f1e', bgCard: '#2a1a3a', text: '#faf5ff', textMuted: '#d8b4fe', inputBg: '#3b2854' },
    ecommerce: { primary: '#d4af37', secondary: '#b5952f', accent: '#f3f4f6', bg: '#000000', bgCard: '#111111', text: '#ffffff', textMuted: '#9ca3af', inputBg: '#222222' },
    healthcare: { primary: '#0ea5e9', secondary: '#0369a1', accent: '#14b8a6', bg: '#082f49', bgCard: '#0c4a6e', text: '#f0f9ff', textMuted: '#7dd3fc', inputBg: '#115e59' },
    professional: { primary: '#64748b', secondary: '#475569', accent: '#38bdf8', bg: '#0f172a', bgCard: '#1e293b', text: '#f8fafc', textMuted: '#cbd5e1', inputBg: '#334155' },
    'luxury-dark': { primary: '#D4AF37', secondary: '#C9B48A', accent: '#D4AF37', bg: '#080808', bgCard: '#141414', text: '#FFFFFF', textMuted: '#6B7280', inputBg: '#1a1a1a' },
    neumorphic: { primary: '#6C63FF', secondary: '#5a52e0', accent: '#FF6584', bg: '#E8ECF0', bgCard: '#E8ECF0', text: '#2D3748', textMuted: '#718096', inputBg: '#E8ECF0' },
};

// Generate CSS Variable block based on active theme
function getThemeCSS(theme, c) {
    let vars = '';
    
    if (theme === 'neobrutalist') {
        vars = `
            --radius-card: 4px; --radius-btn: 4px;
            --shadow-card: 6px 6px 0px ${c.text}; --shadow-hover: 2px 2px 0px ${c.text};
            --border-card: 3px solid ${c.text}; --border-hover: 3px solid ${c.primary};
            --bg-card-theme: ${c.bgCard}; --bg-body-theme: ${c.bg};
            --btn-primary-bg: ${c.primary}; --btn-primary-color: ${c.bg};
            --btn-primary-border: 3px solid ${c.text}; --btn-primary-shadow: 4px 4px 0px ${c.text};
            --btn-primary-shadow-hover: 0px 0px 0px transparent;
            --btn-secondary-bg: transparent; --btn-secondary-color: ${c.text};
            --btn-secondary-border: 3px solid ${c.text};
            --font-heading: 'Space Grotesk', 'Outfit', sans-serif; --font-body: 'Space Grotesk', 'Inter', sans-serif;
            --card-backdrop: none; --transform-hover: translate(4px, 4px);
            --nav-bg: ${c.bg}; --nav-border: 3px solid ${c.text}; --nav-backdrop: none;
            --text-transform-heading: uppercase;
        `;
    } else if (theme === 'glassmorphism') {
        vars = `
            --radius-card: 24px; --radius-btn: 99px;
            --shadow-card: 0 8px 32px 0 rgba(0, 0, 0, 0.3); --shadow-hover: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
            --border-card: 1px solid rgba(255, 255, 255, 0.1); --border-hover: 1px solid rgba(255, 255, 255, 0.3);
            --bg-card-theme: rgba(255, 255, 255, 0.03); 
            --bg-body-theme: radial-gradient(circle at 15% 50%, ${c.primary}25, transparent 35%), radial-gradient(circle at 85% 30%, ${c.accent}25, transparent 35%), ${c.bg};
            --btn-primary-bg: rgba(255, 255, 255, 0.1); --btn-primary-color: ${c.text};
            --btn-primary-border: 1px solid rgba(255, 255, 255, 0.3);
            --btn-primary-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); --btn-primary-shadow-hover: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
            --btn-secondary-bg: transparent; --btn-secondary-color: ${c.textMuted};
            --btn-secondary-border: 1px solid rgba(255, 255, 255, 0.15);
            --font-heading: 'Outfit', sans-serif; --font-body: 'Inter', sans-serif;
            --card-backdrop: blur(16px); --transform-hover: translateY(-5px);
            --nav-bg: rgba(255,255,255,0.02); --nav-border: 1px solid rgba(255,255,255,0.05); --nav-backdrop: blur(24px);
            --text-transform-heading: none;
        `;
    } else if (theme === 'minimalist') {
        vars = `
            --radius-card: 0px; --radius-btn: 0px;
            --shadow-card: none; --shadow-hover: none;
            --border-card: 1px solid ${c.textMuted}30; --border-hover: 1px solid ${c.text};
            --bg-card-theme: transparent; --bg-body-theme: ${c.bg};
            --btn-primary-bg: ${c.text}; --btn-primary-color: ${c.bg};
            --btn-primary-border: 1px solid ${c.text}; --btn-primary-shadow: none; --btn-primary-shadow-hover: none;
            --btn-secondary-bg: transparent; --btn-secondary-color: ${c.text};
            --btn-secondary-border: 1px solid ${c.textMuted}50;
            --font-heading: 'Inter', sans-serif; --font-body: 'Inter', sans-serif;
            --card-backdrop: none; --transform-hover: none;
            --nav-bg: ${c.bg}fa; --nav-border: 1px solid ${c.textMuted}20; --nav-backdrop: blur(10px);
            --text-transform-heading: none;
        `;
    } else if (theme === 'luxury-dark') {
        vars = `
            --radius-card: 4px; --radius-btn: 4px;
            --shadow-card: 0 4px 24px rgba(212,175,55,0.06); --shadow-hover: 0 8px 40px rgba(212,175,55,0.12);
            --border-card: 1px solid rgba(212,175,55,0.2); --border-hover: 1px solid rgba(212,175,55,0.5);
            --bg-card-theme: #141414; --bg-body-theme: #080808;
            --btn-primary-bg: transparent; --btn-primary-color: ${c.primary};
            --btn-primary-border: 1px solid ${c.primary}; --btn-primary-shadow: none; --btn-primary-shadow-hover: 0 0 20px ${c.primary}40;
            --btn-secondary-bg: transparent; --btn-secondary-color: ${c.textMuted};
            --btn-secondary-border: 1px solid rgba(255,255,255,0.15);
            --font-heading: 'Cormorant Garamond', 'Georgia', serif; --font-body: 'Jost', 'Inter', sans-serif;
            --card-backdrop: none; --transform-hover: translateY(-3px);
            --nav-bg: #080808; --nav-border: 1px solid rgba(212,175,55,0.3); --nav-backdrop: none;
            --text-transform-heading: none;
        `;
    } else if (theme === 'neumorphic') {
        vars = `
            --radius-card: 20px; --radius-btn: 20px;
            --shadow-card: 8px 8px 16px #c8cdd3, -8px -8px 16px #ffffff; --shadow-hover: 12px 12px 24px #c8cdd3, -12px -12px 24px #ffffff;
            --border-card: none; --border-hover: none;
            --bg-card-theme: #E8ECF0; --bg-body-theme: #E8ECF0;
            --btn-primary-bg: #E8ECF0; --btn-primary-color: ${c.primary};
            --btn-primary-border: none; --btn-primary-shadow: 6px 6px 12px #c8cdd3, -6px -6px 12px #ffffff; --btn-primary-shadow-hover: inset 4px 4px 8px #c8cdd3, inset -4px -4px 8px #ffffff;
            --btn-secondary-bg: #E8ECF0; --btn-secondary-color: ${c.textMuted};
            --btn-secondary-border: none;
            --font-heading: 'Nunito', 'Inter', sans-serif; --font-body: 'Nunito', 'Inter', sans-serif;
            --card-backdrop: none; --transform-hover: scale(1.02);
            --nav-bg: #E8ECF0; --nav-border: none; --nav-backdrop: none;
            --text-transform-heading: none;
        `;
    } else {
        // Modern (Default)
        vars = `
            --radius-card: 16px; --radius-btn: 12px;
            --shadow-card: none; --shadow-hover: 0 12px 40px ${c.primary}15;
            --border-card: 1px solid ${c.primary}15; --border-hover: 1px solid ${c.primary}40;
            --bg-card-theme: ${c.bgCard}; --bg-body-theme: ${c.bg};
            --btn-primary-bg: linear-gradient(135deg, ${c.primary}, ${c.secondary}); --btn-primary-color: white;
            --btn-primary-border: none; --btn-primary-shadow: 0 4px 24px ${c.primary}40; --btn-primary-shadow-hover: 0 8px 32px ${c.primary}60;
            --btn-secondary-bg: ${c.bgCard}; --btn-secondary-color: ${c.text}; --btn-secondary-border: 1px solid ${c.primary}30;
            --font-heading: 'Outfit', sans-serif; --font-body: 'Inter', sans-serif;
            --card-backdrop: none; --transform-hover: translateY(-4px);
            --nav-bg: ${c.bg}ee; --nav-border: 1px solid ${c.primary}12; --nav-backdrop: blur(20px);
            --text-transform-heading: none;
        `;
    }

    return `:root { ${vars} }`;
}

const BASE_STYLES = (c) => `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); background: var(--bg-body-theme); color: ${c.text}; line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); font-weight: 700; line-height: 1.2; color: ${c.text}; text-transform: var(--text-transform-heading); }
p { color: ${c.textMuted}; }
a { text-decoration: none; color: inherit; transition: all 0.3s ease; }
ul { list-style: none; }
img { max-width: 100%; height: auto; display: block; }
input, select, textarea { font-family: inherit; outline: none; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section { padding: 100px 0; position: relative; }
.section-sm { padding: 60px 0; }
.section-bg { background: var(--bg-card-theme); border-top: var(--border-card); border-bottom: var(--border-card); }

.theme-card {
    background: var(--bg-card-theme); border: var(--border-card); border-radius: var(--radius-card);
    box-shadow: var(--shadow-card); backdrop-filter: var(--card-backdrop); -webkit-backdrop-filter: var(--card-backdrop);
    transition: all 0.3s ease; padding: 32px; position: relative; overflow: hidden;
}
.theme-card:hover { transform: var(--transform-hover); box-shadow: var(--shadow-hover); border: var(--border-hover); }

.btn {
    display: inline-flex; align-items: center; justify-content: center; padding: 14px 28px; font-weight: 600; font-size: 15px;
    border-radius: var(--radius-btn); transition: all 0.3s ease; cursor: pointer; gap: 8px; border: none; font-family: var(--font-body); outline: none;
}
.btn-primary { background: var(--btn-primary-bg); color: var(--btn-primary-color); border: var(--btn-primary-border); box-shadow: var(--btn-primary-shadow); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--btn-primary-shadow-hover); opacity: 0.95; }
.btn-secondary { background: var(--btn-secondary-bg); color: var(--btn-secondary-color); border: var(--btn-secondary-border); }
.btn-secondary:hover { opacity: 0.8; transform: translateY(-2px); }
.theme-neobrutalist .btn:hover { transform: var(--transform-hover); }

.nav { position: fixed; top: 0; width: 100%; z-index: 1000; background: var(--nav-bg); backdrop-filter: var(--nav-backdrop); -webkit-backdrop-filter: var(--nav-backdrop); border-bottom: var(--nav-border); padding: 16px 0; transition: all 0.3s; }
.nav.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 12px 0; }
.nav-container { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 24px; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, ${c.primary}, ${c.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 32px; align-items: center; }
@media(max-width: 768px){ .nav-links { display: none; } }
.nav-links a { font-size: 15px; font-weight: 500; color: ${c.textMuted}; }
.nav-links a:hover { color: ${c.primary}; }

.text-gradient { background: linear-gradient(135deg, ${c.text}, ${c.primary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-primary { color: ${c.primary}; }

.grid { display: grid; gap: 24px; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

.flex { display: flex; } .flex-col { flex-direction: column; }
.items-center { align-items: center; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; } .gap-4 { gap: 16px; } .gap-6 { gap: 24px; } .gap-8 { gap: 32px; }

.badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 99px; background: ${c.primary}15; border: 1px solid ${c.primary}30; font-size: 13px; color: ${c.primary}; font-weight: 600; }

.text-center { text-align: center; } .mx-auto { margin-left: auto; margin-right: auto; } .w-full { width: 100%; }
.mt-4 { margin-top: 16px; } .mt-8 { margin-top: 32px; } .mb-2 { margin-bottom: 8px; } .mb-4 { margin-bottom: 16px; } .mb-8 { margin-bottom: 32px; }

footer { padding: 60px 0 32px; border-top: var(--border-card); background: var(--bg-card-theme); margin-top: 60px; }
.footer-bottom { margin-top: 40px; padding-top: 24px; border-top: 1px solid ${c.primary}20; text-align: center; font-size: 14px; color: ${c.textMuted}; }

.icon-box { width: 48px; height: 48px; border-radius: 12px; background: ${c.primary}15; color: ${c.primary}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }

/* Reveal Animations */
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
.reveal.active { opacity: 1; transform: translateY(0); }
.delay-100 { transition-delay: 100ms; } .delay-200 { transition-delay: 200ms; } .delay-300 { transition-delay: 300ms; }
`;

const BASE_SCRIPTS = `
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });
reveals.forEach(reveal => revealObserver.observe(reveal));

const nav = document.querySelector('.nav');
if(nav) {
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}
`;

function buildPage(title, c, theme, customCSS, bodyContent) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    ${getThemeCSS(theme, c)}
    ${BASE_STYLES(c)}
    ${customCSS}
  </style>
</head>
<body class="theme-${theme}">
  ${bodyContent}
  <script>
    lucide.createIcons();
    ${BASE_SCRIPTS}
  </script>
</body>
</html>`;
}

const WEBSITE_TEMPLATES = {
    restaurant: (name, c, theme) => {
        const content = `
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo" style="font-family: 'Playfair Display', serif;">${name || 'Bella Cucina'}</div>
            <div class="nav-links">
              <a href="#menu">Menu</a><a href="#about">About</a><a href="#reservations">Reservations</a>
              <a href="#reservations" class="btn btn-primary" style="padding: 10px 20px;">Book a Table</a>
            </div>
          </div>
        </nav>
        <main>
          <section class="section flex items-center justify-center text-center" style="min-height: 90vh; background: radial-gradient(circle at center, ${c.primary}20 0%, transparent 60%); padding-top: 120px;">
            <div class="container reveal">
              <div class="badge mb-8"><i data-lucide="utensils" style="width:14px;height:14px"></i> Fine Dining Experience</div>
              <h1 style="font-size: clamp(40px, 8vw, 72px); font-family: 'Playfair Display', serif; margin-bottom: 24px; letter-spacing: -1px;">A Taste of <span class="text-primary">Perfection</span></h1>
              <p class="mx-auto mb-8" style="max-width: 600px; font-size: 18px;">Authentic culinary excellence crafted with passion. Experience unforgettable flavors in an elegant atmosphere.</p>
              <div class="flex justify-center gap-4">
                <a href="#reservations" class="btn btn-primary">Reserve a Table</a>
                <a href="#menu" class="btn btn-secondary">View Menu</a>
              </div>
            </div>
          </section>

          <section id="menu" class="section section-bg">
            <div class="container">
              <div class="text-center reveal mb-8">
                <h2 style="font-size: 36px; font-family: 'Playfair Display', serif; margin-bottom: 16px;">Our Signature Menu</h2>
                <p>Carefully curated dishes using the finest seasonal ingredients.</p>
              </div>
              <div class="grid grid-2" style="gap: 64px; max-width: 900px; margin: 0 auto;">
                <div class="reveal delay-100">
                  <h3 class="text-primary mb-6" style="font-size: 24px; border-bottom: 1px solid ${c.primary}30; padding-bottom: 8px;">Starters</h3>
                  ${['Truffle Arancini', 'Burrata Caprese', 'Wagyu Carpaccio', 'Calamari Fritti'].map((item, i) => `
                  <div class="flex justify-between items-center mb-6" style="border-bottom: 1px dashed ${c.textMuted}40; padding-bottom: 8px;">
                    <div><h4 style="font-size: 18px; font-weight: 600;">${item}</h4><span style="font-size: 13px; color: ${c.textMuted};">Locally sourced organic ingredients</span></div>
                    <div style="font-weight: 700; color: ${c.primary}; font-size: 20px;">₹${16 + i*4}</div>
                  </div>`).join('')}
                </div>
                <div class="reveal delay-200">
                  <h3 class="text-primary mb-6" style="font-size: 24px; border-bottom: 1px solid ${c.primary}30; padding-bottom: 8px;">Main Courses</h3>
                  ${['Osso Buco Milano', 'Lobster Linguine', 'Truffle Risotto', 'Dry-Aged Ribeye'].map((item, i) => `
                  <div class="flex justify-between items-center mb-6" style="border-bottom: 1px dashed ${c.textMuted}40; padding-bottom: 8px;">
                    <div><h4 style="font-size: 18px; font-weight: 600;">${item}</h4><span style="font-size: 13px; color: ${c.textMuted};">Chef's special preparation</span></div>
                    <div style="font-weight: 700; color: ${c.primary}; font-size: 20px;">₹${32 + i*6}</div>
                  </div>`).join('')}
                </div>
              </div>
            </div>
          </section>

          <section id="reservations" class="section">
            <div class="container flex items-center justify-center">
              <div class="theme-card reveal" style="max-width: 600px; width: 100%; text-align: center;">
                <i data-lucide="calendar" style="width: 48px; height: 48px; color: ${c.primary}; margin: 0 auto 16px;"></i>
                <h2 style="font-size: 32px; font-family: 'Playfair Display', serif; margin-bottom: 12px;">Make a Reservation</h2>
                <p class="mb-8">Join us for an unforgettable evening. We recommend booking in advance.</p>
                <form class="grid gap-4 text-left" onsubmit="event.preventDefault()">
                  <div class="grid grid-2">
                    <div><label class="mb-2" style="display:block; font-size:14px;">Date</label><input type="date" style="width:100%; padding:12px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"></div>
                    <div><label class="mb-2" style="display:block; font-size:14px;">Time</label><input type="time" style="width:100%; padding:12px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"></div>
                  </div>
                  <div class="grid grid-2">
                    <div><label class="mb-2" style="display:block; font-size:14px;">Guests</label><select style="width:100%; padding:12px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"><option>2 People</option><option>4 People</option><option>6+ People</option></select></div>
                    <div><label class="mb-2" style="display:block; font-size:14px;">Name</label><input type="text" placeholder="John Doe" style="width:100%; padding:12px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"></div>
                  </div>
                  <button class="btn btn-primary w-full mt-4">Confirm Booking</button>
                </form>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div class="container text-center">
            <h2 class="logo mb-4" style="font-family: 'Playfair Display', serif;">${name || 'Bella Cucina'}</h2>
            <p class="mb-4 text-muted">123 Culinary Ave, Food District, NY 10001</p>
            <div class="flex justify-center gap-4 text-primary">
              <i data-lucide="instagram"></i> <i data-lucide="twitter"></i> <i data-lucide="facebook"></i>
            </div>
            <div class="footer-bottom">© ${new Date().getFullYear()} ${name || 'Bella Cucina'}. All rights reserved.</div>
          </div>
        </footer>
        `;
        return buildPage(name || 'Bella Cucina', c, theme, ``, content);
    },

    technology: (name, c, theme) => {
        const content = `
        <div class="tech-glow"></div><div class="tech-glow" style="bottom:-20%; left:-10%; top:auto; right:auto;"></div>
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo flex items-center gap-2"><i data-lucide="hexagon" style="color:${c.primary}"></i> ${name || 'NexusAI'}</div>
            <div class="nav-links">
              <a href="#features">Features</a><a href="#developers">Developers</a><a href="#pricing">Pricing</a>
              <a href="#" class="btn btn-primary" style="padding: 10px 20px;">Start Free Trial</a>
            </div>
          </div>
        </nav>
        <main>
          <section class="section container" style="min-height: 100vh; display: flex; align-items: center; padding-top: 120px;">
            <div style="text-align: center; max-width: 800px; margin: 0 auto; z-index: 1;">
              <div class="badge reveal"><i data-lucide="zap" style="width: 14px; height: 14px;"></i> v2.0 is now live — Read the docs</div>
              <h1 class="text-gradient reveal delay-100" style="font-size: clamp(48px, 8vw, 80px); margin: 24px 0; letter-spacing: -2px; line-height: 1.1;">Ship faster with <br>${name || 'NexusAI'}</h1>
              <p class="text-muted reveal delay-200" style="font-size: 20px; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">The AI-powered development platform that transforms how teams build, deploy, and scale modern applications.</p>
              <div class="flex justify-center gap-4 reveal delay-300">
                <a href="#" class="btn btn-primary">Start Building <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i></a>
                <a href="#" class="btn btn-secondary">Read Documentation</a>
              </div>
            </div>
          </section>

          <section id="stats" class="section section-bg section-sm">
            <div class="container grid grid-4 text-center">
              ${[{n:'99.99%',l:'Uptime SLA'}, {n:'50M+',l:'Requests/day'}, {n:'<10ms',l:'Global Latency'}, {n:'10k+',l:'Developers'}].map((s,i) => `
              <div class="reveal delay-${i*100}">
                <div style="font-size: 40px; font-weight: 800; color: ${c.text};">${s.n}</div>
                <div style="color: ${c.textMuted}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${s.l}</div>
              </div>`).join('')}
            </div>
          </section>

          <section id="features" class="section container">
            <div class="text-center reveal mb-8">
              <h2 style="font-size: 40px; margin-bottom: 16px;">Built for scale. Designed for speed.</h2>
              <p style="max-width: 600px; margin: 0 auto;">Everything you need to build production-grade applications from day one.</p>
            </div>
            <div class="grid grid-3">
              ${[{i:'code',t:'AI Code Assistant',d:'Intelligent autocompletion and bug detection.'}, {i:'cloud',t:'Edge Deployment',d:'Deploy to 300+ global edge locations in seconds.'}, {i:'shield',t:'Enterprise Security',d:'SOC2 Type II certified with end-to-end encryption.'}, {i:'database',t:'Distributed DB',d:'Serverless database that scales to zero.'}, {i:'git-branch',t:'Preview Environments',d:'Automatic deployments for every pull request.'}, {i:'activity',t:'Real-time Analytics',d:'Deep insights into application performance.'}].map((f, i) => `
              <div class="theme-card reveal delay-${(i%3)*100}">
                <div class="icon-box"><i data-lucide="${f.i}"></i></div>
                <h3 style="font-size: 20px; margin-bottom: 8px;">${f.t}</h3>
                <p style="font-size: 15px;">${f.d}</p>
              </div>`).join('')}
            </div>
          </section>
        </main>
        <footer>
          <div class="container grid grid-4">
            <div>
              <div class="logo mb-4">${name || 'NexusAI'}</div>
              <p class="text-muted" style="font-size: 14px;">Building the future of software development.</p>
            </div>
            <div><h4 class="mb-4">Product</h4><ul style="font-size: 14px; color:${c.textMuted}; line-height:2.5;"><li>Features</li><li>Pricing</li><li>Changelog</li></ul></div>
            <div><h4 class="mb-4">Developers</h4><ul style="font-size: 14px; color:${c.textMuted}; line-height:2.5;"><li>Documentation</li><li>API Reference</li><li>GitHub</li></ul></div>
            <div><h4 class="mb-4">Company</h4><ul style="font-size: 14px; color:${c.textMuted}; line-height:2.5;"><li>About</li><li>Blog</li><li>Careers</li></ul></div>
          </div>
          <div class="container footer-bottom">© ${new Date().getFullYear()} ${name || 'NexusAI'} Inc. All rights reserved.</div>
        </footer>
        `;
        return buildPage(name || 'NexusAI', c, theme, `.tech-glow { position:absolute; top:-20%; right:-10%; width:60vw; height:60vw; background:radial-gradient(circle, ${c.primary}20 0%, transparent 60%); filter:blur(80px); z-index:-1; }`, content);
    },

    creative: (name, c, theme) => {
        const content = `
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo">${name || 'Studio Form'}</div>
            <div class="nav-links">
              <a href="#work">Work</a><a href="#services">Services</a><a href="#about">About</a>
              <a href="#contact" class="btn btn-primary" style="padding: 10px 20px;">Let's Talk</a>
            </div>
          </div>
        </nav>
        <main>
          <section class="section" style="padding-top: 180px; padding-bottom: 120px;">
            <div class="container">
              <h1 class="reveal" style="font-size: clamp(60px, 12vw, 120px); line-height: 0.9; letter-spacing: -3px; text-transform: uppercase;">We craft <br><span class="text-primary" style="font-style: italic;">digital</span> <br>experiences</h1>
              <div class="flex justify-between items-end mt-8 reveal delay-200" style="flex-wrap: wrap; gap: 24px;">
                <p style="max-width: 400px; font-size: 18px;">An award-winning design and development agency focused on building brands that stand out.</p>
                <a href="#work" class="btn btn-primary" style="border-radius: 99px; width: 120px; height: 120px; padding: 0;">Explore<br>Work</a>
              </div>
            </div>
          </section>

          <div style="background: ${c.primary}; color: ${c.bg}; padding: 24px 0; overflow: hidden; white-space: nowrap;">
            <div style="display: inline-block; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
              ${Array(10).fill(' BRAND IDENTITY • WEB DESIGN • MOTION GRAPHICS • APP DEVELOPMENT • ').join('')}
            </div>
          </div>

          <section id="work" class="section section-bg">
            <div class="container">
              <h2 class="reveal mb-8" style="font-size: 48px; text-transform: uppercase; letter-spacing: -1px;">Selected Works</h2>
              <div class="grid grid-2" style="gap: 32px;">
                ${[1,2,3,4].map((i) => `
                <div class="reveal delay-${(i%2)*100}" style="position: relative; overflow: hidden; border-radius: var(--radius-card); aspect-ratio: ${i%2===0 ? '4/3' : '3/4'}; background: linear-gradient(45deg, ${c.primary}20, ${c.accent}20);">
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 32px; background: linear-gradient(to top, var(--bg-card-theme), transparent);">
                    <h3 style="font-size: 24px; margin-bottom: 8px;">Project 0${i}</h3>
                    <p style="color: ${c.primary}; font-weight: 600;">Digital Platform</p>
                  </div>
                </div>`).join('')}
              </div>
            </div>
          </section>
        </main>
        <footer style="padding: 120px 0 60px;">
          <div class="container text-center">
            <h2 style="font-size: clamp(48px, 10vw, 100px); letter-spacing: -2px; margin-bottom: 40px; text-transform: uppercase;">Have an idea?</h2>
            <a href="mailto:hello@${(name || 'studioform').replace(/\s/g, '').toLowerCase()}.com" class="btn btn-primary" style="font-size: 24px; padding: 20px 48px;">Let's Talk</a>
            <div class="footer-bottom flex justify-between">
              <div>© ${new Date().getFullYear()} ${name || 'Studio Form'}</div>
              <div class="flex gap-4"><a href="#">Ig</a><a href="#">Tw</a><a href="#">Li</a></div>
            </div>
          </div>
        </footer>
        `;
        return buildPage(name || 'Studio Form', c, theme, ``, content);
    },

    ecommerce: (name, c, theme) => {
        const content = `
        <div style="background: ${c.text}; color: ${c.bg}; text-align: center; padding: 8px; font-size: 13px; font-weight: 600;">Free worldwide shipping on orders over $150</div>
        <nav class="nav" style="top: 36px;">
          <div class="container nav-container">
            <div class="logo">${name || 'Lumina'}</div>
            <div class="nav-links">
              <a href="#new">New Arrivals</a><a href="#shop">Shop All</a><a href="#about">Our Story</a>
            </div>
            <div class="flex gap-4 items-center">
              <i data-lucide="search" style="width: 20px;"></i>
              <i data-lucide="user" style="width: 20px;"></i>
              <i data-lucide="shopping-bag" style="width: 20px;"></i>
            </div>
          </div>
        </nav>
        <main>
          <section class="section" style="padding-top: 140px;">
            <div class="container flex items-center justify-between" style="gap: 48px; flex-wrap: wrap;">
              <div class="reveal" style="flex: 1; min-width: 300px;">
                <h1 style="font-size: clamp(48px, 6vw, 72px); line-height: 1.1; margin-bottom: 24px;">Redefining <br>Everyday <span class="text-primary">Luxury</span></h1>
                <p style="font-size: 18px; margin-bottom: 32px; max-width: 400px;">Sustainably sourced, meticulously crafted essentials for the modern wardrobe.</p>
                <a href="#shop" class="btn btn-primary" style="padding: 16px 32px;">Shop Collection</a>
              </div>
              <div class="reveal delay-200" style="flex: 1; min-width: 300px; aspect-ratio: 4/5; background: linear-gradient(135deg, ${c.primary}15, ${c.accent}15); border-radius: var(--radius-card); position: relative;">
                <div class="badge" style="position: absolute; top: 24px; right: 24px; background: ${c.bg};">New Collection</div>
              </div>
            </div>
          </section>

          <section id="shop" class="section section-bg">
            <div class="container">
              <div class="flex justify-between items-end mb-8 reveal">
                <h2 style="font-size: 32px;">Trending Now</h2>
                <a href="#" class="text-primary font-weight-600">View All <i data-lucide="arrow-right" style="width:16px; display:inline-block; vertical-align:middle;"></i></a>
              </div>
                <div class="grid grid-4">
                ${['Classic Leather Tote', 'Minimalist Watch', 'Silk Blend Scarf', 'Signature Sunglasses', 'Cashmere Sweater', 'Everyday Loafers', 'Canvas Weekender', 'Gold Vermeil Ring'].map((p, i) => `
                <div class="reveal delay-${(i%4)*100} product-card">
                  <div style="aspect-ratio: 1; background: ${c.bg}40; border-radius: var(--radius-card); margin-bottom: 16px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border: var(--border-card);">
                    <i data-lucide="package" style="width: 48px; height: 48px; color: ${c.primary}50;"></i>
                    <button class="btn btn-primary add-to-cart" style="position: absolute; bottom: 16px; left: 16px; right: 16px; opacity: 0; transform: translateY(10px);">Add to Cart</button>
                  </div>
                    <div class="flex justify-between items-start">
                    <div>
                      <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">${p}</h3>
                      <p style="font-size: 13px; color: ${c.textMuted};">Essential Collection</p>
                    </div>
                    <div style="font-weight: 700;">₹${89 + i*30}</div>
                  </div>
                </div>`).join('')}
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div class="container grid grid-4">
            <div><h2 class="logo mb-4">${name || 'Lumina'}</h2><p class="text-muted" style="font-size: 14px;">Elevated essentials for everyday life.</p></div>
            <div><h4 class="mb-4">Shop</h4><ul style="font-size: 14px; color:${c.textMuted}; line-height:2.5;"><li>All Products</li><li>New Arrivals</li><li>Bestsellers</li></ul></div>
            <div><h4 class="mb-4">Support</h4><ul style="font-size: 14px; color:${c.textMuted}; line-height:2.5;"><li>FAQ</li><li>Shipping & Returns</li><li>Contact Us</li></ul></div>
            <div><h4 class="mb-4">Newsletter</h4><p style="font-size: 14px; color:${c.textMuted}; margin-bottom: 16px;">Get 15% off your first order.</p>
              <div class="flex"><input type="email" placeholder="Email address" style="flex:1; padding:12px; border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text}; border-radius:var(--radius-card) 0 0 var(--radius-card);"><button class="btn btn-primary" style="border-radius:0 var(--radius-card) var(--radius-card) 0;">Subscribe</button></div>
            </div>
          </div>
        </footer>
        `;
        return buildPage(name || 'Lumina', c, theme, `.product-card:hover .add-to-cart { opacity: 1; transform: translateY(0); transition: all 0.3s ease; }`, content);
    },

    education: (name, c, theme) => {
        const content = `
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo flex items-center gap-2"><i data-lucide="book-open" style="color:${c.primary}"></i> ${name || 'Academia'}</div>
            <div class="nav-links flex-1 justify-center" style="display:flex;">
              <div class="flex items-center" style="background:${c.inputBg}; border:1px solid ${c.primary}20; border-radius:99px; padding:8px 16px; width:400px; max-width:100%;">
                <i data-lucide="search" style="width:16px; color:${c.textMuted}; margin-right:8px;"></i>
                <input type="text" placeholder="What do you want to learn?" style="background:transparent; border:none; color:${c.text}; width:100%;">
              </div>
            </div>
            <div class="flex gap-4 items-center">
              <a href="#" class="font-weight-500">Log In</a>
              <a href="#" class="btn btn-primary" style="padding: 10px 20px;">Sign Up</a>
            </div>
          </div>
        </nav>
        <main>
          <section class="section container" style="padding-top: 160px;">
            <div class="grid grid-2 items-center" style="gap: 64px;">
              <div class="reveal">
                <h1 style="font-size: clamp(40px, 6vw, 64px); line-height: 1.1; margin-bottom: 24px;">Unlock your potential with <span class="text-primary">expert-led</span> courses.</h1>
                <p style="font-size: 18px; margin-bottom: 32px;">Join millions of learners from around the world. Master new skills in design, business, tech, and more.</p>
                <div class="flex gap-4">
                  <a href="#courses" class="btn btn-primary">Explore Courses</a>
                  <div class="flex items-center gap-2 text-muted" style="font-size: 14px;"><i data-lucide="check-circle" style="color:${c.primary}; width:16px;"></i> 30-day money-back guarantee</div>
                </div>
              </div>
              <div class="reveal delay-200 grid grid-2 gap-4">
                <div class="theme-card text-center" style="padding: 48px 24px;"><h3 style="font-size: 36px; color:${c.primary};">25K+</h3><p>Active Students</p></div>
                <div class="theme-card text-center" style="padding: 48px 24px; transform: translateY(24px);"><h3 style="font-size: 36px; color:${c.accent};">1.2K</h3><p>Expert Instructors</p></div>
              </div>
            </div>
          </section>

          <section id="categories" class="section section-bg section-sm">
            <div class="container flex justify-between" style="overflow-x: auto; padding-bottom: 16px;">
              ${[{i:'monitor',n:'Development'}, {i:'pie-chart',n:'Business'}, {i:'pen-tool',n:'Design'}, {i:'trending-up',n:'Marketing'}, {i:'music',n:'Music'}, {i:'camera',n:'Photography'}].map((cat) => `
              <div class="text-center reveal" style="min-width: 120px; cursor: pointer;">
                <div class="icon-box mx-auto" style="border-radius: 50%; width: 64px; height: 64px; margin-bottom: 12px; background:var(--bg-card-theme); border:var(--border-card);"><i data-lucide="${cat.i}"></i></div>
                <div style="font-weight: 600; font-size: 14px;">${cat.n}</div>
              </div>`).join('')}
            </div>
          </section>

          <section id="courses" class="section container">
            <h2 class="reveal mb-8" style="font-size: 32px;">Popular Courses</h2>
            <div class="grid grid-3">
              ${['Complete Web Development Bootcamp', 'Advanced UI/UX Design Masterclass', 'Machine Learning A-Z', 'Digital Marketing Strategy 2026', 'Financial Analysis & Valuation', 'iOS App Development with Swift'].map((cName, i) => `
              <div class="theme-card reveal delay-${(i%3)*100}" style="padding: 0;">
                <div style="height: 160px; background: linear-gradient(45deg, ${c.primary}20, ${c.accent}20); border-bottom: var(--border-card);"></div>
                <div style="padding: 24px;">
                  <div class="flex items-center gap-2 mb-2" style="font-size: 12px; color: ${c.primary}; font-weight: 600;"><i data-lucide="star" style="width:14px; fill:currentColor;"></i> 4.${8 + (i%3)} (${Math.floor(Math.random()*5000 + 1000)} ratings)</div>
                  <h3 style="font-size: 18px; margin-bottom: 8px; line-height: 1.4;">${cName}</h3>
                  <p style="font-size: 14px; color: ${c.textMuted}; margin-bottom: 16px;">By Dr. Jane Smith</p>
                  <div class="flex justify-between items-center" style="border-top: 1px solid ${c.primary}20; padding-top: 16px;">
                    <span style="font-weight: 800; font-size: 20px;">$${89 + i*10}</span>
                    <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px;">Add to Cart</button>
                  </div>
                </div>
              </div>`).join('')}
            </div>
          </section>
        </main>
        <footer>
          <div class="container text-center">
            <h2 class="logo mb-4">${name || 'Academia'}</h2>
            <p class="mb-4 text-muted">Empowering the world to learn.</p>
            <div class="footer-bottom">© ${new Date().getFullYear()} ${name || 'Academia'}. All rights reserved.</div>
          </div>
        </footer>
        `;
        return buildPage(name || 'Academia', c, theme, ``, content);
    },

    healthcare: (name, c, theme) => {
        const content = `
        <div style="background: ${c.primary}; color: ${c.bg}; padding: 8px 24px; display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
          <span>Emergency: (800) 123-4567</span><span>Open 24/7 for urgent care</span>
        </div>
        <nav class="nav" style="top: 36px;">
          <div class="container nav-container">
            <div class="logo flex items-center gap-2"><i data-lucide="activity" style="color:${c.primary}; width: 28px; height: 28px;"></i> ${name || 'Vitalis Health'}</div>
            <div class="nav-links">
              <a href="#services">Services</a><a href="#doctors">Our Doctors</a><a href="#patient-info">Patient Info</a>
            </div>
            <a href="#appointment" class="btn btn-primary">Book Appointment</a>
          </div>
        </nav>
        <main>
          <section class="section container" style="padding-top: 140px;">
            <div class="grid grid-2 items-center" style="gap: 64px;">
              <div class="reveal">
                <div class="badge mb-6"><i data-lucide="shield-check" style="width: 14px;"></i> Top Rated Medical Center</div>
                <h1 style="font-size: clamp(40px, 5vw, 64px); line-height: 1.1; margin-bottom: 24px;">Compassionate care. <span class="text-primary">Exceptional results.</span></h1>
                <p style="font-size: 18px; margin-bottom: 32px;">Providing comprehensive healthcare services for you and your family with state-of-the-art technology and expert medical professionals.</p>
                <div class="flex gap-4">
                  <a href="#appointment" class="btn btn-primary">Schedule a Visit</a>
                  <a href="#services" class="btn btn-secondary">Our Services</a>
                </div>
              </div>
              <div class="reveal delay-200">
                <div class="theme-card text-center" style="padding: 48px; background: linear-gradient(135deg, ${c.primary}10, transparent);">
                  <i data-lucide="heart-pulse" style="width: 80px; height: 80px; color: ${c.primary}; margin: 0 auto 24px; stroke-width: 1;"></i>
                  <h3 style="font-size: 24px; margin-bottom: 12px;">Committed to Your Health</h3>
                  <p class="text-muted">Over 20 years of excellence in patient-centered medical care.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="services" class="section section-bg">
            <div class="container">
              <div class="text-center reveal mb-8"><h2 style="font-size: 36px; margin-bottom: 16px;">Medical Services</h2><p style="max-width: 600px; margin: 0 auto;">Comprehensive care tailored to your unique health needs.</p></div>
              <div class="grid grid-4 text-center">
                ${[{i:'stethoscope',t:'Primary Care'}, {i:'brain',t:'Neurology'}, {i:'baby',t:'Pediatrics'}, {i:'eye',t:'Optometry'}, {i:'activity',t:'Cardiology'}, {i:'microscope',t:'Laboratory'}, {i:'pill',t:'Pharmacy'}, {i:'bone',t:'Orthopedics'}].map((s,i) => `
                <div class="theme-card reveal delay-${(i%4)*100}" style="padding: 32px 16px;">
                  <div class="icon-box mx-auto"><i data-lucide="${s.i}"></i></div>
                  <h4 style="font-size: 18px;">${s.t}</h4>
                </div>`).join('')}
              </div>
            </div>
          </section>

          <section id="appointment" class="section container">
            <div class="theme-card reveal" style="max-width: 800px; margin: 0 auto;">
              <div class="text-center mb-8">
                <h2 style="font-size: 32px; margin-bottom: 8px;">Request an Appointment</h2>
                <p class="text-muted">Fill out the form below and our staff will contact you to confirm.</p>
              </div>
              <form class="grid gap-4" onsubmit="event.preventDefault()">
                <div class="grid grid-2">
                  <input type="text" placeholder="First Name" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                  <input type="text" placeholder="Last Name" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                </div>
                <div class="grid grid-2">
                  <input type="email" placeholder="Email Address" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                  <input type="tel" placeholder="Phone Number" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                </div>
                <select style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                  <option>Select Department</option><option>Primary Care</option><option>Cardiology</option><option>Pediatrics</option>
                </select>
                <textarea placeholder="Reason for visit" rows="4" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"></textarea>
                <button class="btn btn-primary" style="padding: 16px;">Submit Request</button>
              </form>
            </div>
          </section>
        </main>
        <footer>
          <div class="container footer-bottom">© ${new Date().getFullYear()} ${name || 'Vitalis Health'}. All rights reserved.</div>
        </footer>
        `;
        return buildPage(name || 'Vitalis Health', c, theme, ``, content);
    },

    professional: (name, c, theme) => {
        const content = `
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo" style="font-family: 'Playfair Display', serif;">${name || 'Sterling Partners'}</div>
            <div class="nav-links">
              <a href="#expertise">Practice Areas</a><a href="#team">Our Team</a><a href="#about">About Firm</a>
            </div>
            <a href="#contact" class="btn btn-primary">Free Consultation</a>
          </div>
        </nav>
        <main>
          <section class="section" style="padding-top: 160px;">
            <div class="container grid grid-2 items-center" style="gap: 64px;">
              <div class="reveal">
                <h1 style="font-size: clamp(44px, 6vw, 64px); line-height: 1.1; margin-bottom: 24px; font-family: 'Playfair Display', serif;">Strategic counsel for <span class="text-primary">complex</span> challenges.</h1>
                <p style="font-size: 18px; margin-bottom: 32px; color: ${c.textMuted};">Delivering unparalleled expertise and dedicated representation to businesses and individuals since 1995.</p>
                <div class="flex gap-4">
                  <a href="#contact" class="btn btn-primary">Schedule Consultation</a>
                </div>
              </div>
              <div class="theme-card reveal delay-200" style="padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 24px; font-family: 'Playfair Display', serif;">Request a Review</h3>
                <form class="flex flex-col gap-4" onsubmit="event.preventDefault()">
                  <input type="text" placeholder="Full Name" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                  <input type="email" placeholder="Email Address" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                  <textarea placeholder="Briefly describe your case" rows="3" style="padding:14px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};"></textarea>
                  <button class="btn btn-primary w-full">Submit Request</button>
                </form>
              </div>
            </div>
          </section>

          <section id="expertise" class="section section-bg">
            <div class="container">
              <div class="text-center reveal mb-8">
                <h2 style="font-size: 36px; font-family: 'Playfair Display', serif; margin-bottom: 16px;">Areas of Expertise</h2>
                <div style="width: 60px; height: 3px; background: ${c.primary}; margin: 0 auto;"></div>
              </div>
              <div class="grid grid-3 text-center" style="gap: 40px;">
                ${[{i:'briefcase',t:'Corporate Law',d:'Mergers, acquisitions, and corporate governance.'}, {i:'building',t:'Real Estate',d:'Commercial property transactions and disputes.'}, {i:'shield',t:'Intellectual Property',d:'Trademark and patent protection strategies.'}, {i:'users',t:'Employment',d:'Workplace policies and dispute resolution.'}, {i:'landmark',t:'Tax Strategy',d:'Comprehensive tax planning and compliance.'}, {i:'scale',t:'Litigation',d:'Aggressive representation in civil courts.'}].map((s,i) => `
                <div class="reveal delay-${(i%3)*100}">
                  <i data-lucide="${s.i}" style="width: 40px; height: 40px; color: ${c.primary}; margin: 0 auto 16px;"></i>
                  <h4 style="font-size: 20px; font-family: 'Playfair Display', serif; margin-bottom: 12px;">${s.t}</h4>
                  <p style="font-size: 15px;">${s.d}</p>
                </div>`).join('')}
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div class="container footer-bottom">© ${new Date().getFullYear()} ${name || 'Sterling Partners'}. All rights reserved. Attorney Advertising.</div>
        </footer>
        `;
        return buildPage(name || 'Sterling Partners', c, theme, ``, content);
    },

    general: (name, c, theme) => {
        const content = `
        <nav class="nav">
          <div class="container nav-container">
            <div class="logo">${name || 'LaunchPad'}</div>
            <div class="nav-links">
              <a href="#features">Features</a><a href="#about">About</a><a href="#testimonials">Reviews</a>
            </div>
            <a href="#contact" class="btn btn-primary">Get Started</a>
          </div>
        </nav>
        <main>
          <section class="section container text-center" style="padding-top: 180px; padding-bottom: 120px;">
            <div class="reveal" style="max-width: 800px; margin: 0 auto;">
              <h1 class="text-gradient" style="font-size: clamp(48px, 8vw, 72px); line-height: 1.1; margin-bottom: 24px; letter-spacing: -1px;">Empower your vision with exceptional solutions.</h1>
              <p style="font-size: 20px; color: ${c.textMuted}; margin-bottom: 40px;">We provide the tools, expertise, and support you need to take your project to the next level.</p>
              <div class="flex justify-center gap-4">
                <a href="#features" class="btn btn-primary" style="padding: 16px 32px; font-size: 16px;">Explore Features</a>
                <a href="#contact" class="btn btn-secondary" style="padding: 16px 32px; font-size: 16px;">Contact Us</a>
              </div>
            </div>
          </section>

          <section id="features" class="section section-bg">
            <div class="container grid grid-3">
              ${[{i:'rocket',t:'Lightning Fast',d:'Optimized for performance to ensure the best possible experience.'}, {i:'lock',t:'Secure by Default',d:'Built with enterprise-grade security protocols from the ground up.'}, {i:'layout',t:'Intuitive Design',d:'Beautiful, accessible interfaces that your users will love.'}].map((f, i) => `
              <div class="theme-card reveal delay-${i*100}">
                <div class="icon-box"><i data-lucide="${f.i}"></i></div>
                <h3 style="font-size: 20px; margin-bottom: 12px;">${f.t}</h3>
                <p style="color: ${c.textMuted};">${f.d}</p>
              </div>`).join('')}
            </div>
          </section>

          <section id="contact" class="section container text-center">
            <div class="theme-card reveal" style="max-width: 800px; margin: 0 auto; padding: 64px 24px; background: linear-gradient(135deg, ${c.primary}20, transparent);">
              <h2 style="font-size: 36px; margin-bottom: 16px;">Ready to get started?</h2>
              <p style="font-size: 18px; color: ${c.textMuted}; margin-bottom: 32px;">Join thousands of satisfied users today.</p>
              <form class="flex justify-center gap-2 mx-auto" style="max-width: 500px;" onsubmit="event.preventDefault()">
                <input type="email" placeholder="Enter your email" style="flex:1; padding:16px; border-radius:var(--radius-card); border:1px solid ${c.primary}30; background:${c.inputBg}; color:${c.text};">
                <button class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </section>
        </main>
        <footer>
          <div class="container text-center footer-bottom" style="border:none;">© ${new Date().getFullYear()} ${name || 'LaunchPad'}. All rights reserved.</div>
        </footer>
        `;
        return buildPage(name || 'LaunchPad', c, theme, ``, content);
    }
};

export function generateFullWebsite(prompt, history = []) {
    const type = detectBusinessType(prompt);
    const details = extractDetails(prompt);
    const theme = details.theme || 'modern';
    
    // Determine the color scheme based on user hint, theme override, or industry default
    const themeColorOverride = (theme === 'luxury-dark') ? COLOR_SCHEMES['luxury-dark']
        : (theme === 'neumorphic') ? COLOR_SCHEMES['neumorphic']
        : null;
    const defaultThemeColors = themeColorOverride || COLOR_SCHEMES[type] || COLOR_SCHEMES.default;
    const colors = details.colorHint ? (COLOR_SCHEMES[details.colorHint] || defaultThemeColors) : defaultThemeColors;
    
    const isModification = history.length > 0 && (
        prompt.toLowerCase().includes('change') ||
        prompt.toLowerCase().includes('update') ||
        prompt.toLowerCase().includes('modify') ||
        prompt.toLowerCase().includes('make') ||
        prompt.toLowerCase().includes('add') ||
        prompt.toLowerCase().includes('remove') ||
        prompt.toLowerCase().includes('different') ||
        prompt.toLowerCase().includes('theme')
    );

    let activeType = type;
    let activeTheme = theme;
    let activeName = details.businessName;
    let activeColors = colors;

    if (isModification && history.length > 0) {
        const lastData = history[history.length - 1];
        activeType = lastData?.businessType || type;
        activeTheme = details.theme !== 'modern' ? details.theme : (lastData?.theme || theme); 
        activeName = details.businessName || lastData?.businessName;
        
        const fallbackThemeColors = COLOR_SCHEMES[activeType] || COLOR_SCHEMES.default;
        activeColors = details.colorHint ? (COLOR_SCHEMES[details.colorHint] || fallbackThemeColors) : (details.colorHint ? colors : (lastData?.colors || colors));
    }

    const templateFn = WEBSITE_TEMPLATES[activeType] || WEBSITE_TEMPLATES.general;
    const html = templateFn(activeName, activeColors, activeTheme);

    return { html, businessType: activeType, businessName: activeName || 'Website', colors: activeColors, theme: activeTheme };
}