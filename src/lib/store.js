// Plans definition
export const PLANS = {
  free: {
    id: 'free', name: 'Free', price: 0, cycle: 'month',
    limits: { websites: 1, pagesPerSite: 3, storage: 100, customDomains: 0, aiGenerations: 5, teamMembers: 1, components: 'basic', analytics: false, versionHistory: false, collaboration: false },
    features: ['1 Website', '3 Pages per site', '100MB Storage', 'Basic Components', '5 AI Generations/mo', 'Platform Subdomain'],
  },
  starter: {
    id: 'starter', name: 'Starter', price: 9, cycle: 'month',
    limits: { websites: 3, pagesPerSite: 10, storage: 1024, customDomains: 1, aiGenerations: 50, teamMembers: 3, components: 'standard', analytics: true, versionHistory: false, collaboration: false },
    features: ['3 Websites', '10 Pages per site', '1GB Storage', 'Standard Components', '50 AI Generations/mo', '1 Custom Domain', 'Basic Analytics', '3 Team Members'],
  },
  professional: {
    id: 'professional', name: 'Professional', price: 29, cycle: 'month',
    limits: { websites: 10, pagesPerSite: 50, storage: 10240, customDomains: 5, aiGenerations: 500, teamMembers: 10, components: 'premium', analytics: true, versionHistory: true, collaboration: true },
    features: ['10 Websites', '50 Pages per site', '10GB Storage', 'Premium Components', '500 AI Generations/mo', '5 Custom Domains', 'Advanced Analytics', '10 Team Members', 'Version History', 'Real-time Collaboration'],
  },
  enterprise: {
    id: 'enterprise', name: 'Enterprise', price: 99, cycle: 'month',
    limits: { websites: 999, pagesPerSite: 999, storage: 102400, customDomains: 999, aiGenerations: 9999, teamMembers: 999, components: 'all', analytics: true, versionHistory: true, collaboration: true },
    features: ['Unlimited Websites', 'Unlimited Pages', '100GB Storage', 'All Components', 'Unlimited AI', 'Unlimited Domains', 'Full Analytics Suite', 'Unlimited Team', 'Version History', 'Real-time Collaboration', 'Priority Support', 'Custom Integrations'],
  },
};

// In-memory data store
const store = {
  tenants: [
    {
      id: 'tenant-1', name: 'Bella Cucina', slug: 'bella-cucina', plan: 'professional', status: 'active',
      branding: { primaryColor: '#e74c3c', secondaryColor: '#c0392b', accentColor: '#f39c12', backgroundColor: '#1a1a2e', fontHeading: 'Outfit', fontBody: 'Inter', logo: null },
      createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
      usage: { storage: 2048, aiGenerations: 124, bandwidth: 15360 },
    },
    {
      id: 'tenant-2', name: 'TechStart Academy', slug: 'techstart', plan: 'starter', status: 'active',
      branding: { primaryColor: '#3498db', secondaryColor: '#2980b9', accentColor: '#2ecc71', backgroundColor: '#0f1923', fontHeading: 'Outfit', fontBody: 'Inter', logo: null },
      createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
      usage: { storage: 512, aiGenerations: 28, bandwidth: 5120 },
    },
    {
      id: 'tenant-3', name: 'GreenLeaf Studios', slug: 'greenleaf', plan: 'enterprise', status: 'active',
      branding: { primaryColor: '#27ae60', secondaryColor: '#219a52', accentColor: '#f1c40f', backgroundColor: '#0a1a0f', fontHeading: 'Outfit', fontBody: 'Inter', logo: null },
      createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z',
      usage: { storage: 24576, aiGenerations: 892, bandwidth: 102400 },
    },
  ],

  users: [
    { id: 'user-1', tenantId: 'tenant-1', name: 'Marco Rossi', email: 'marco@bellacucina.com', password: 'demo123', role: 'owner', avatar: null, lastLogin: '2026-02-20T08:00:00Z' },
    { id: 'user-2', tenantId: 'tenant-1', name: 'Sofia Bianchi', email: 'sofia@bellacucina.com', password: 'demo123', role: 'editor', avatar: null, lastLogin: '2026-02-19T14:00:00Z' },
    { id: 'user-3', tenantId: 'tenant-1', name: 'Luca Verdi', email: 'luca@bellacucina.com', password: 'demo123', role: 'developer', avatar: null, lastLogin: '2026-02-18T10:00:00Z' },
    { id: 'user-4', tenantId: 'tenant-2', name: 'Sarah Chen', email: 'sarah@techstart.com', password: 'demo123', role: 'owner', avatar: null, lastLogin: '2026-02-20T09:00:00Z' },
    { id: 'user-5', tenantId: 'tenant-2', name: 'Alex Kim', email: 'alex@techstart.com', password: 'demo123', role: 'admin', avatar: null, lastLogin: '2026-02-17T11:00:00Z' },
    { id: 'user-6', tenantId: 'tenant-3', name: 'James Wilson', email: 'james@greenleaf.com', password: 'demo123', role: 'owner', avatar: null, lastLogin: '2026-02-20T12:00:00Z' },
    { id: 'user-7', tenantId: 'tenant-3', name: 'Emma Davis', email: 'emma@greenleaf.com', password: 'demo123', role: 'admin', avatar: null, lastLogin: '2026-02-19T16:00:00Z' },
    { id: 'user-8', tenantId: 'tenant-3', name: 'Ryan Park', email: 'ryan@greenleaf.com', password: 'demo123', role: 'editor', avatar: null, lastLogin: '2026-02-18T09:00:00Z' },
  ],

  websites: [
    {
      id: 'site-1', tenantId: 'tenant-1', name: 'Bella Cucina Restaurant', slug: 'main-site', status: 'published',
      domain: { subdomain: 'bella-cucina.tenantflow.app', custom: 'bellacucina.com', verified: true, ssl: true },
      createdAt: '2025-12-02T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z', publishedAt: '2026-02-15T10:00:00Z',
      settings: { favicon: '', language: 'en', seo: { title: 'Bella Cucina - Authentic Italian Restaurant', description: 'Experience authentic Italian cuisine in the heart of the city.' } },
    },
    {
      id: 'site-2', tenantId: 'tenant-1', name: 'Catering Services', slug: 'catering', status: 'draft',
      domain: { subdomain: 'bella-cucina-catering.tenantflow.app', custom: null, verified: false, ssl: false },
      createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z', publishedAt: null,
      settings: { favicon: '', language: 'en', seo: { title: 'Bella Cucina Catering', description: 'Professional catering services for all occasions.' } },
    },
    {
      id: 'site-3', tenantId: 'tenant-2', name: 'TechStart Learning Platform', slug: 'learning', status: 'published',
      domain: { subdomain: 'techstart.tenantflow.app', custom: null, verified: false, ssl: false },
      createdAt: '2026-01-06T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z', publishedAt: '2026-02-10T10:00:00Z',
      settings: { favicon: '', language: 'en', seo: { title: 'TechStart Academy - Learn Tech Skills', description: 'Master technology skills with our expert-led courses.' } },
    },
    {
      id: 'site-4', tenantId: 'tenant-3', name: 'GreenLeaf Portfolio', slug: 'portfolio', status: 'published',
      domain: { subdomain: 'greenleaf.tenantflow.app', custom: 'greenleafstudios.com', verified: true, ssl: true },
      createdAt: '2025-11-16T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z', publishedAt: '2026-02-18T10:00:00Z',
      settings: { favicon: '', language: 'en', seo: { title: 'GreenLeaf Studios - Creative Design Agency', description: 'Award-winning design studio creating beautiful digital experiences.' } },
    },
    {
      id: 'site-5', tenantId: 'tenant-3', name: 'GreenLeaf Blog', slug: 'blog', status: 'published',
      domain: { subdomain: 'greenleaf-blog.tenantflow.app', custom: null, verified: false, ssl: false },
      createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z', publishedAt: '2026-02-12T10:00:00Z',
      settings: { favicon: '', language: 'en', seo: { title: 'GreenLeaf Blog - Design Insights', description: 'Insights and tutorials from the GreenLeaf design team.' } },
    },
  ],

  pages: [
    {
      id: 'page-1', websiteId: 'site-1', title: 'Home', slug: '/', status: 'published', version: 3, components: [
        { id: 'comp-1', type: 'hero', props: { title: 'Authentic Italian Cuisine', subtitle: 'Experience the flavors of Italy in every bite', buttonText: 'View Menu', buttonLink: '/menu', backgroundStyle: 'gradient' } },
        { id: 'comp-2', type: 'features', props: { title: 'Why Choose Us', items: [{ icon: '', title: 'Fresh Ingredients', desc: 'Locally sourced, daily fresh ingredients' }, { icon: '', title: 'Expert Chefs', desc: 'Trained in authentic Italian cooking' }, { icon: '', title: 'Award Winning', desc: 'Recognized for excellence in dining' }, { icon: '', title: 'Family Tradition', desc: 'Recipes passed down through generations' }] } },
        { id: 'comp-3', type: 'gallery', props: { title: 'Our Dishes', images: ['pasta.jpg', 'pizza.jpg', 'dessert.jpg', 'wine.jpg', 'appetizer.jpg', 'salad.jpg'] } },
        { id: 'comp-4', type: 'testimonials', props: { title: 'What Our Guests Say', items: [{ name: 'John D.', text: 'Best Italian food outside of Italy!', rating: 5 }, { name: 'Maria S.', text: 'The ambiance and food are perfection.', rating: 5 }, { name: 'David L.', text: 'A must-visit for any food lover.', rating: 4 }] } },
        { id: 'comp-5', type: 'cta', props: { title: 'Ready to Dine?', subtitle: 'Reserve your table today', buttonText: 'Book Now', buttonLink: '/contact' } },
        { id: 'comp-6', type: 'footer', props: { companyName: 'Bella Cucina', tagline: 'Authentic Italian Restaurant', links: ['Menu', 'About', 'Contact', 'Reservations'] } },
      ], createdAt: '2025-12-02T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z'
    },
    {
      id: 'page-2', websiteId: 'site-1', title: 'Menu', slug: '/menu', status: 'published', version: 2, components: [
        { id: 'comp-7', type: 'hero', props: { title: 'Our Menu', subtitle: 'Crafted with passion', backgroundStyle: 'minimal' } },
        { id: 'comp-8', type: 'pricing', props: { title: 'Dinner Menu', items: [{ name: 'Margherita Pizza', price: 14, desc: 'Fresh mozzarella, basil, tomato sauce' }, { name: 'Fettuccine Alfredo', price: 18, desc: 'House-made pasta, cream sauce, parmesan' }, { name: 'Osso Buco', price: 32, desc: 'Braised veal shanks, gremolata' }] } },
      ], createdAt: '2025-12-05T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z'
    },
    {
      id: 'page-3', websiteId: 'site-1', title: 'Contact', slug: '/contact', status: 'published', version: 1, components: [
        { id: 'comp-9', type: 'hero', props: { title: 'Get in Touch', subtitle: 'We\'d love to hear from you', backgroundStyle: 'minimal' } },
        { id: 'comp-10', type: 'contact', props: { email: 'info@bellacucina.com', phone: '+1 (555) 123-4567', address: '123 Italian Ave, Food District, NYC' } },
      ], createdAt: '2025-12-08T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z'
    },
    {
      id: 'page-4', websiteId: 'site-3', title: 'Home', slug: '/', status: 'published', version: 2, components: [
        { id: 'comp-11', type: 'hero', props: { title: 'Learn Tech Skills That Matter', subtitle: 'Join thousands of students mastering technology', buttonText: 'Start Learning', buttonLink: '/courses', backgroundStyle: 'gradient' } },
        { id: 'comp-12', type: 'stats', props: { items: [{ value: '10K+', label: 'Students' }, { value: '200+', label: 'Courses' }, { value: '95%', label: 'Satisfaction' }, { value: '50+', label: 'Instructors' }] } },
        { id: 'comp-13', type: 'features', props: { title: 'Why TechStart?', items: [{ icon: '', title: 'Hands-on Projects', desc: 'Learn by building real applications' }, { icon: '', title: 'Career Focused', desc: 'Skills that employers actually want' }, { icon: '', title: 'Community', desc: 'Join a supportive learning community' }] } },
      ], createdAt: '2026-01-06T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z'
    },
    {
      id: 'page-5', websiteId: 'site-4', title: 'Home', slug: '/', status: 'published', version: 4, components: [
        { id: 'comp-14', type: 'hero', props: { title: 'Creative Design That Inspires', subtitle: 'We craft digital experiences that leave lasting impressions', buttonText: 'View Our Work', buttonLink: '/portfolio', backgroundStyle: 'gradient' } },
        { id: 'comp-15', type: 'gallery', props: { title: 'Featured Projects', images: ['project1.jpg', 'project2.jpg', 'project3.jpg', 'project4.jpg'] } },
        { id: 'comp-16', type: 'team', props: { title: 'Meet Our Team', members: [{ name: 'James Wilson', role: 'Creative Director', avatar: '' }, { name: 'Emma Davis', role: 'Lead Designer', avatar: '' }, { name: 'Ryan Park', role: 'UX Specialist', avatar: '' }] } },
      ], createdAt: '2025-11-16T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z'
    },
  ],

  deployments: [
    { id: 'deploy-1', websiteId: 'site-1', version: 3, status: 'live', environment: 'production', createdBy: 'user-1', createdAt: '2026-02-15T10:00:00Z', duration: 12 },
    { id: 'deploy-2', websiteId: 'site-1', version: 2, status: 'superseded', environment: 'production', createdBy: 'user-1', createdAt: '2026-01-20T10:00:00Z', duration: 8 },
    { id: 'deploy-3', websiteId: 'site-3', version: 2, status: 'live', environment: 'production', createdBy: 'user-4', createdAt: '2026-02-10T10:00:00Z', duration: 10 },
    { id: 'deploy-4', websiteId: 'site-4', version: 4, status: 'live', environment: 'production', createdBy: 'user-6', createdAt: '2026-02-18T10:00:00Z', duration: 15 },
  ],

  analytics: {
    'site-1': { views: 45230, uniqueVisitors: 12840, bounceRate: 32.5, avgSessionDuration: 245, topPages: [{ path: '/', views: 18920 }, { path: '/menu', views: 15340 }, { path: '/contact', views: 10970 }], dailyViews: [820, 950, 1100, 980, 1250, 1400, 1320, 1100, 890, 1050, 1200, 1380, 1500, 1420], referrers: [{ source: 'Google', visits: 6420 }, { source: 'Direct', visits: 3120 }, { source: 'Instagram', visits: 2100 }, { source: 'Yelp', visits: 1200 }], performance: { lcp: 1.8, fid: 45, cls: 0.05, ttfb: 320 } },
    'site-3': { views: 22150, uniqueVisitors: 8930, bounceRate: 28.1, avgSessionDuration: 380, topPages: [{ path: '/', views: 12200 }, { path: '/courses', views: 9950 }], dailyViews: [420, 380, 510, 440, 620, 580, 490, 530, 610, 670, 720, 680, 590, 640], referrers: [{ source: 'Google', visits: 4200 }, { source: 'LinkedIn', visits: 2100 }, { source: 'Direct', visits: 1630 }, { source: 'Twitter', visits: 1000 }], performance: { lcp: 2.1, fid: 52, cls: 0.08, ttfb: 280 } },
    'site-4': { views: 67800, uniqueVisitors: 24500, bounceRate: 25.3, avgSessionDuration: 312, topPages: [{ path: '/', views: 28400 }, { path: '/portfolio', views: 22100 }, { path: '/team', views: 17300 }], dailyViews: [1200, 1350, 1500, 1420, 1680, 1800, 1720, 1580, 1450, 1620, 1780, 1900, 1850, 1700], referrers: [{ source: 'Google', visits: 12200 }, { source: 'Dribbble', visits: 5300 }, { source: 'Behance', visits: 3800 }, { source: 'Direct', visits: 3200 }], performance: { lcp: 1.5, fid: 38, cls: 0.03, ttfb: 250 } },
  },

  subscriptions: [
    {
      id: 'sub-1', tenantId: 'tenant-1', planId: 'professional', status: 'active', startDate: '2025-12-01', renewalDate: '2026-03-01', payments: [
        { id: 'pay-1', amount: 29, date: '2026-02-01', status: 'paid', method: 'Visa •••• 4242' },
        { id: 'pay-2', amount: 29, date: '2026-01-01', status: 'paid', method: 'Visa •••• 4242' },
        { id: 'pay-3', amount: 29, date: '2025-12-01', status: 'paid', method: 'Visa •••• 4242' },
      ]
    },
    {
      id: 'sub-2', tenantId: 'tenant-2', planId: 'starter', status: 'active', startDate: '2026-01-05', renewalDate: '2026-03-05', payments: [
        { id: 'pay-4', amount: 9, date: '2026-02-05', status: 'paid', method: 'Mastercard •••• 8888' },
        { id: 'pay-5', amount: 9, date: '2026-01-05', status: 'paid', method: 'Mastercard •••• 8888' },
      ]
    },
    {
      id: 'sub-3', tenantId: 'tenant-3', planId: 'enterprise', status: 'active', startDate: '2025-11-15', renewalDate: '2026-03-15', payments: [
        { id: 'pay-6', amount: 99, date: '2026-02-15', status: 'paid', method: 'Amex •••• 1234' },
        { id: 'pay-7', amount: 99, date: '2026-01-15', status: 'paid', method: 'Amex •••• 1234' },
        { id: 'pay-8', amount: 99, date: '2025-12-15', status: 'paid', method: 'Amex •••• 1234' },
        { id: 'pay-9', amount: 99, date: '2025-11-15', status: 'paid', method: 'Amex •••• 1234' },
      ]
    },
  ],

  versions: [
    { id: 'ver-1', pageId: 'page-1', version: 1, components: [], createdBy: 'user-1', createdAt: '2025-12-02T10:00:00Z', message: 'Initial page creation' },
    { id: 'ver-2', pageId: 'page-1', version: 2, components: [], createdBy: 'user-1', createdAt: '2026-01-10T10:00:00Z', message: 'Added testimonials section' },
    { id: 'ver-3', pageId: 'page-1', version: 3, components: [], createdBy: 'user-2', createdAt: '2026-02-15T10:00:00Z', message: 'Updated hero and gallery' },
    { id: 'ver-4', pageId: 'page-5', version: 1, components: [], createdBy: 'user-6', createdAt: '2025-11-16T10:00:00Z', message: 'Initial portfolio page' },
    { id: 'ver-5', pageId: 'page-5', version: 2, components: [], createdBy: 'user-7', createdAt: '2025-12-20T10:00:00Z', message: 'Added team section' },
    { id: 'ver-6', pageId: 'page-5', version: 3, components: [], createdBy: 'user-8', createdAt: '2026-01-15T10:00:00Z', message: 'Updated gallery with new projects' },
    { id: 'ver-7', pageId: 'page-5', version: 4, components: [], createdBy: 'user-6', createdAt: '2026-02-18T10:00:00Z', message: 'Redesigned hero with new branding' },
  ],

  activities: [
    { id: 'act-1', tenantId: 'tenant-1', userId: 'user-1', action: 'Published website', target: 'Bella Cucina Restaurant', timestamp: '2026-02-15T10:00:00Z' },
    { id: 'act-2', tenantId: 'tenant-1', userId: 'user-2', action: 'Edited page', target: 'Home', timestamp: '2026-02-15T09:30:00Z' },
    { id: 'act-3', tenantId: 'tenant-1', userId: 'user-1', action: 'Updated branding', target: 'Color scheme', timestamp: '2026-02-14T16:00:00Z' },
    { id: 'act-4', tenantId: 'tenant-1', userId: 'user-3', action: 'Connected domain', target: 'bellacucina.com', timestamp: '2026-02-13T11:00:00Z' },
    { id: 'act-5', tenantId: 'tenant-2', userId: 'user-4', action: 'Published website', target: 'TechStart Learning Platform', timestamp: '2026-02-10T10:00:00Z' },
    { id: 'act-6', tenantId: 'tenant-3', userId: 'user-6', action: 'Deployed v4', target: 'GreenLeaf Portfolio', timestamp: '2026-02-18T10:00:00Z' },
    { id: 'act-7', tenantId: 'tenant-3', userId: 'user-8', action: 'Used AI generator', target: 'Generated landing page', timestamp: '2026-02-17T14:00:00Z' },
  ],

  collaborators: [
    { websiteId: 'site-1', userId: 'user-1', status: 'online', cursor: { page: 'page-1', component: 'comp-1' }, lastSeen: '2026-02-20T10:00:00Z' },
    { websiteId: 'site-1', userId: 'user-2', status: 'online', cursor: { page: 'page-1', component: 'comp-3' }, lastSeen: '2026-02-20T09:58:00Z' },
    { websiteId: 'site-4', userId: 'user-6', status: 'online', cursor: { page: 'page-5', component: 'comp-14' }, lastSeen: '2026-02-20T12:00:00Z' },
    { websiteId: 'site-4', userId: 'user-7', status: 'idle', cursor: { page: 'page-5', component: 'comp-15' }, lastSeen: '2026-02-20T11:50:00Z' },
  ],
};

// Helper functions
export function getTenants() { return store.tenants; }
export function getTenant(id) { return store.tenants.find(t => t.id === id); }
export function getTenantBySlug(slug) { return store.tenants.find(t => t.slug === slug); }

export function getUsers(tenantId) { return store.users.filter(u => u.tenantId === tenantId); }
export function getUser(id) { return store.users.find(u => u.id === id); }
export function getUserByEmail(email) { return store.users.find(u => u.email === email); }
export function addUser(user) { store.users.push(user); return user; }
export function updateUser(id, data) { const u = store.users.find(u => u.id === id); if (u) Object.assign(u, data); return u; }
export function removeUser(id) { store.users = store.users.filter(u => u.id !== id); }

export function getWebsites(tenantId) { return store.websites.filter(w => w.tenantId === tenantId); }
export function getWebsite(id) { return store.websites.find(w => w.id === id); }
export function addWebsite(website) { store.websites.push(website); return website; }
export function updateWebsite(id, data) { const w = store.websites.find(w => w.id === id); if (w) Object.assign(w, data); return w; }
export function deleteWebsite(id) { store.websites = store.websites.filter(w => w.id !== id); store.pages = store.pages.filter(p => p.websiteId !== id); }

export function getPages(websiteId) { return store.pages.filter(p => p.websiteId === websiteId); }
export function getPage(id) { return store.pages.find(p => p.id === id); }
export function addPage(page) { store.pages.push(page); return page; }
export function updatePage(id, data) { const p = store.pages.find(p => p.id === id); if (p) Object.assign(p, data); return p; }
export function deletePage(id) { store.pages = store.pages.filter(p => p.id !== id); }

export function getDeployments(websiteId) { return store.deployments.filter(d => d.websiteId === websiteId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
export function addDeployment(dep) { store.deployments.push(dep); return dep; }

export function getAnalytics(siteId) { return store.analytics[siteId] || null; }

export function getSubscription(tenantId) { return store.subscriptions.find(s => s.tenantId === tenantId); }
export function updateSubscription(tenantId, data) { const s = store.subscriptions.find(s => s.tenantId === tenantId); if (s) Object.assign(s, data); return s; }

export function getVersions(pageId) { return store.versions.filter(v => v.pageId === pageId).sort((a, b) => b.version - a.version); }
export function addVersion(ver) { store.versions.push(ver); return ver; }

export function getActivities(tenantId) { return store.activities.filter(a => a.tenantId === tenantId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); }
export function addActivity(act) { store.activities.unshift(act); return act; }

export function getCollaborators(websiteId) { return store.collaborators.filter(c => c.websiteId === websiteId); }

export function addTenant(tenant) { store.tenants.push(tenant); return tenant; }
export function updateTenant(id, data) { const t = store.tenants.find(t => t.id === id); if (t) Object.assign(t, data); return t; }
export function deleteTenant(id) {
  store.tenants = store.tenants.filter(t => t.id !== id);
  store.users = store.users.filter(u => u.tenantId !== id);
  const siteIds = store.websites.filter(w => w.tenantId === id).map(w => w.id);
  store.websites = store.websites.filter(w => w.tenantId !== id);
  store.pages = store.pages.filter(p => !siteIds.includes(p.websiteId));
  store.subscriptions = store.subscriptions.filter(s => s.tenantId !== id);
  store.activities = store.activities.filter(a => a.tenantId !== id);
}

export function getPlan(planId) { return PLANS[planId]; }
export function getAllPlans() { return Object.values(PLANS); }
