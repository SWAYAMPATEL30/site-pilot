import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bot, BarChart, Lock, Rocket, CreditCard, Building, Zap, Plus, ArrowRight, Menu, X } from 'lucide-react';
import { formatINR } from '../lib/currency';

// --- Custom SVG Graphics for Features ---

const MultiTenantGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Main Hub */}
    <rect x="160" y="110" width="80" height="80" rx="16" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="200" cy="150" r="20" fill={color} />
    {/* Connection Lines */}
    <path d="M200 110 V 70 M200 190 V 230 M160 150 H 120 M240 150 H 280" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
    {/* Tenant 1 */}
    <rect x="150" y="30" width="100" height="40" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="160" y="45" width="40" height="10" rx="4" fill={color} fillOpacity="0.4" />
    {/* Tenant 2 */}
    <rect x="150" y="230" width="100" height="40" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="160" y="245" width="60" height="10" rx="4" fill={color} fillOpacity="0.4" />
    {/* Tenant 3 */}
    <rect x="20" y="130" width="100" height="40" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="30" y="145" width="50" height="10" rx="4" fill={color} fillOpacity="0.4" />
    {/* Tenant 4 */}
    <rect x="280" y="130" width="100" height="40" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="290" y="145" width="50" height="10" rx="4" fill={color} fillOpacity="0.4" />
  </svg>
);

const AIGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Browser Window Mockup */}
    <rect x="60" y="40" width="280" height="220" rx="12" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <path d="M60 70 H 340" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <circle cx="80" cy="55" r="4" fill="var(--border-color, #e5e7eb)" />
    <circle cx="95" cy="55" r="4" fill="var(--border-color, #e5e7eb)" />
    <circle cx="110" cy="55" r="4" fill="var(--border-color, #e5e7eb)" />
    {/* Content Blocks being "generated" */}
    <rect x="80" y="90" width="150" height="20" rx="4" fill={color} fillOpacity="0.2" />
    <rect x="80" y="125" width="240" height="60" rx="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
    <rect x="80" y="200" width="110" height="40" rx="8" fill="var(--border-color, #e5e7eb)" fillOpacity="0.3" />
    <rect x="210" y="200" width="110" height="40" rx="8" fill="var(--border-color, #e5e7eb)" fillOpacity="0.3" />
    {/* AI Magic Wand / Sparkles */}
    <circle cx="300" cy="100" r="16" fill={color} />
    <path d="M300 70 L 305 85 L 320 90 L 305 95 L 300 110 L 295 95 L 280 90 L 295 85 Z" fill="#fff" />
  </svg>
);

const AnalyticsGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Grid Background */}
    <path d="M50 50 V 250 M100 50 V 250 M150 50 V 250 M200 50 V 250 M250 50 V 250 M300 50 V 250 M350 50 V 250" stroke="var(--border-color, #e5e7eb)" strokeOpacity="0.3" strokeWidth="1" />
    <path d="M50 50 H 350 M50 100 H 350 M50 150 H 350 M50 200 H 350 M50 250 H 350" stroke="var(--border-color, #e5e7eb)" strokeOpacity="0.3" strokeWidth="1" />
    {/* Graph Line */}
    <path d="M50 200 C 100 200, 120 120, 170 140 C 220 160, 240 80, 290 90 C 320 95, 340 50, 350 60" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Area fill under curve */}
    <path d="M50 200 C 100 200, 120 120, 170 140 C 220 160, 240 80, 290 90 C 320 95, 340 50, 350 60 V 250 H 50 Z" fill={color} fillOpacity="0.1" />
    {/* Data Points */}
    <circle cx="170" cy="140" r="6" fill="var(--bg-surface, #fff)" stroke={color} strokeWidth="3" />
    <circle cx="290" cy="90" r="6" fill="var(--bg-surface, #fff)" stroke={color} strokeWidth="3" />
    {/* Floating Stat Card */}
    <rect x="180" y="40" width="90" height="40" rx="6" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="1" />
    <rect x="190" y="50" width="30" height="6" rx="3" fill="var(--text-muted, #6b7280)" />
    <rect x="190" y="62" width="50" height="8" rx="4" fill={color} />
  </svg>
);

const RoleGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Central Lock / Shield */}
    <rect x="170" y="110" width="60" height="80" rx="30" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
    <rect x="185" y="140" width="30" height="20" rx="6" fill={color} />
    <path d="M190 140 V 130 C 190 120, 210 120, 210 130 V 140" stroke={color} strokeWidth="3" strokeLinecap="round" />

    {/* User 1 (Admin) */}
    <rect x="40" y="60" width="140" height="40" rx="20" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <circle cx="60" cy="80" r="12" fill={color} />
    <rect x="80" y="76" width="60" height="8" rx="4" fill="var(--text-high, #111827)" fillOpacity="0.8" />

    {/* User 2 (Editor) */}
    <rect x="220" y="60" width="140" height="40" rx="20" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <circle cx="240" cy="80" r="12" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="260" y="76" width="50" height="8" rx="4" fill="var(--text-muted, #6b7280)" fillOpacity="0.5" />

    {/* User 3 (Viewer) */}
    <rect x="130" y="220" width="140" height="40" rx="20" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <circle cx="150" cy="240" r="12" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="170" y="236" width="70" height="8" rx="4" fill="var(--text-muted, #6b7280)" fillOpacity="0.5" />

    {/* Connection Lines */}
    <path d="M110 100 L 170 130 M290 100 L 230 130 M200 220 L 200 190" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

const DeployGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Pipeline Nodes */}
    <circle cx="80" cy="150" r="16" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="3" />
    <rect x="65" y="145" width="30" height="10" rx="5" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />

    <circle cx="160" cy="150" r="16" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="3" />
    <rect x="145" y="145" width="30" height="10" rx="5" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />

    {/* The "One Click" Node */}
    <circle cx="240" cy="150" r="24" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="3" />
    <circle cx="240" cy="150" r="10" fill={color} />

    {/* Production Node (Rocket) */}
    <rect x="310" y="120" width="60" height="60" rx="12" fill={color} />
    <path d="M330 160 L 340 140 L 350 160 Z" fill="#fff" />
    <circle cx="340" cy="150" r="4" fill={color} />

    {/* Connecting Lines */}
    <path d="M96 150 H 144 M176 150 H 216 M264 150 H 310" stroke="var(--border-color, #e5e7eb)" strokeWidth="3" strokeDasharray="6 4" />
    <path d="M264 150 H 310" stroke={color} strokeWidth="3" />

    {/* Uploading progress bar */}
    <rect x="120" y="210" width="160" height="6" rx="3" fill="var(--border-color, #e5e7eb)" />
    <rect x="120" y="210" width="100" height="6" rx="3" fill={color} />
  </svg>
);

const SubscriptionGraphic = ({ color }) => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="transparent" />
    {/* Tier 1 */}
    <rect x="50" y="90" width="80" height="120" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="60" y="110" width="40" height="8" rx="4" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="60" y="130" width="60" height="4" rx="2" fill="var(--border-color, #e5e7eb)" />
    <rect x="60" y="145" width="50" height="4" rx="2" fill="var(--border-color, #e5e7eb)" />

    {/* Tier 2 (Highlighted) */}
    <rect x="145" y="70" width="110" height="160" rx="12" fill="var(--bg-surface, #fff)" stroke={color} strokeWidth="3" />
    <rect x="160" y="95" width="50" height="10" rx="5" fill={color} />
    <rect x="160" y="120" width="80" height="6" rx="3" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="160" y="140" width="70" height="6" rx="3" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="160" y="160" width="60" height="6" rx="3" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="160" y="195" width="80" height="20" rx="4" fill={color} fillOpacity="0.2" />

    {/* Tier 3 */}
    <rect x="270" y="90" width="80" height="120" rx="8" fill="var(--bg-surface, #fff)" stroke="var(--border-color, #e5e7eb)" strokeWidth="2" />
    <rect x="280" y="110" width="40" height="8" rx="4" fill="var(--text-muted, #6b7280)" fillOpacity="0.3" />
    <rect x="280" y="130" width="60" height="4" rx="2" fill="var(--border-color, #e5e7eb)" />
    <rect x="280" y="145" width="50" height="4" rx="2" fill="var(--border-color, #e5e7eb)" />
    <rect x="280" y="160" width="55" height="4" rx="2" fill="var(--border-color, #e5e7eb)" />
  </svg>
);

// --- End Custom SVG Graphics ---

const FEATURES = [
  { graphic: MultiTenantGraphic, title: 'Multi-Tenant Architecture', desc: 'Isolated environments for each organization with dedicated branding, users, and configurations.', color: '#8b5cf6' },
  { graphic: AIGraphic, title: 'AI Website Builder', desc: 'Generate layouts, content, and designs with intelligent AI assistance for any business type.', color: '#06b6d4' },
  { graphic: AnalyticsGraphic, title: 'Analytics & Monitoring', desc: 'Real-time traffic analytics, performance metrics, and usage monitoring dashboards.', color: '#10b981' },
  { graphic: RoleGraphic, title: 'Role-Based Access', desc: 'Granular permissions for owners, admins, editors, and developers within each tenant.', color: '#f59e0b' },
  { graphic: DeployGraphic, title: 'One-Click Deploy', desc: 'Deploy from preview to production with version history and rollback capability.', color: '#ec4899' },
  { graphic: SubscriptionGraphic, title: 'Subscription Management', desc: 'Flexible plans with automated billing, upgrades, and feature gating.', color: '#ef4444' },
];

const PLANS = [
  { name: 'Free', price: 0, features: ['1 Website', '3 Pages', '100MB Storage', '5 AI Generations', 'Platform Subdomain'], highlight: false },
  { name: 'Starter', price: 999, features: ['3 Websites', '10 Pages', '1GB Storage', '50 AI Generations', '1 Custom Domain', 'Analytics', '3 Team Members'], highlight: false },
  { name: 'Professional', price: 2999, features: ['10 Websites', '50 Pages', '10GB Storage', '500 AI Generations', '5 Custom Domains', 'Advanced Analytics', '10 Team Members', 'Version History', 'Collaboration'], highlight: true },
  { name: 'Enterprise', price: 4999, features: ['Unlimited Everything', '100GB Storage', 'Unlimited AI', 'Unlimited Domains', 'Full Analytics', 'Unlimited Team', 'Priority Support', 'Custom Integrations'], highlight: false },
];

const DEMO_USERS = [
  { name: 'Marco (Owner)', email: 'marco@bellacucina.com', tenant: 'Bella Cucina', plan: 'Professional' },
  { name: 'Sarah (Owner)', email: 'sarah@techstart.com', tenant: 'TechStart Academy', plan: 'Starter' },
  { name: 'James (Owner)', email: 'james@greenleaf.com', tenant: 'GreenLeaf Studios', plan: 'Enterprise' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [loginLoading, setLoginLoading] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- State for Earth Scroll Fading ---
  const [heroScrollOpacity, setHeroScrollOpacity] = useState(1);

  // --- State and Refs for Scroll Effects ---
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef([]);

  // Calculate earth fade on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Fades out entirely over the first 400px of scrolling
      const newOpacity = Math.max(1 - window.scrollY / 400, 0);
      setHeroScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for sticky features
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveFeature(index);
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the element is visible
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  async function quickLogin(email) {
    setLoginLoading(email);
    try {
      const result = loginUser(email, 'demo123');
      if (result.ok) navigate('/dashboard');
    } catch (e) { }
    setLoginLoading(null);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Custom Styles Injected for Animations, Pulsar and Fading/Hover Motion */}
      <style dangerouslySetInnerHTML={{
        __html: `
                .feature-title {
                    font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
                    letter-spacing: -0.02em;
                }
                .graphic-wrapper {
                    width: 100%;
                    height: 100%;
                    background: var(--bg-primary, #ffffff);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 16px;
                    box-shadow: -10px 20px 40px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transform: scale(1.15); 
                    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s ease;
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 20%);
                    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 20%);
                }
                .graphic-wrapper:hover {
                    transform: scale(1.15) translateX(30px); 
                    box-shadow: -20px 30px 60px rgba(0,0,0,0.1);
                }

                /* Earth Spin Animation */
                .spin-earth {
                    animation: rotateEarth 40s linear infinite;
                    transform-origin: center;
                }
                @keyframes rotateEarth {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Mobile Default States (Hidden on Desktop) */
                .mobile-only-content {
                    display: none;
                }

                /* Mobile View Restructuring */
                @media (max-width: 768px) {
                    .features-container {
                        flex-direction: column !important;
                        gap: 16px !important;
                    }
                    .features-sticky-nav {
                        width: 100% !important;
                        position: static !important;
                        gap: 40px !important; /* Increase gap between items for mobile breathing room */
                    }
                    .features-scroll-graphics {
                        display: none !important; /* Hide desktop sliding graphics */
                    }
                    .feature-item {
                        opacity: 1 !important; /* fully visible on mobile */
                        border-left: none !important; /* Remove sticky indicator line */
                        padding-left: 0 !important;
                    }
                    .feature-title {
                        font-size: 26px !important;
                        color: var(--text-high) !important;
                        margin-bottom: 12px !important;
                    }
                    .feature-content {
                        max-height: none !important; /* Uncollapse all items */
                        overflow: visible !important;
                    }
                    .desktop-only-link {
                        display: none !important; /* Hide the fading link used for desktop */
                    }
                    .mobile-only-content {
                        display: block; /* Show inline SVGs and fixed link */
                        margin-top: 16px;
                    }
                    .mobile-graphic-wrapper {
                        width: 100%;
                        height: 250px; /* Scaled down for mobile */
                        background: var(--bg-primary, #ffffff);
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                        margin-top: 20px;
                        padding: 16px;
                    }
                }
            `}} />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Zap size={24} />
          <span className="logo-text" style={{ fontWeight: 800, fontSize: 'clamp(16px, 5vw, 22px)', letterSpacing: '-0.05em' }}>Site Pilot</span>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Features</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Pricing</a>
          <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Demo</a>
          {authToken ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">Sign In</button>
              <button onClick={() => navigate('/register')} className="btn btn-primary btn-sm">Get Started</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-high)', cursor: 'pointer' }}
          className="mobile-menu-btn">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 99 }}>
          <a href="#features" style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</a>
          <a href="#demo" style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }}>Demo</a>
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            {authToken ? (
              <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="btn btn-primary btn-sm" style={{ width: '100%' }}>Dashboard</button>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Sign In</button>
                <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="btn btn-primary btn-sm" style={{ width: '100%' }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(100px, 20vh, 160px)', paddingBottom: 'clamp(60px, 10vh, 100px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', padding: '0 16px', zIndex: 1 }}>
          <h1 className="animate-slide-up" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(32px, 8vw, 96px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
            BUILD WEBSITES<br /><span style={{ color: 'var(--primary)' }}>FOR EVERY ORG</span>
          </h1>
          <p className="animate-slide-up" style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.6, animationDelay: '0.1s' }}>
            The complete SaaS platform to create, customize, deploy, and manage websites for multiple organizations.
          </p>
          <div className="animate-slide-up" style={{ display: 'flex', gap: 16, justifyContent: 'center', animationDelay: '0.2s', flexWrap: 'wrap', padding: '0 16px' }}>
            <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Start Building Free</button>
            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-secondary btn-lg">Try Demo</button>
          </div>
        </div>

        {/* Earth Background Animation */}
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: heroScrollOpacity * 0.4, // Keeps it dim and fades on scroll
          zIndex: 0,
          pointerEvents: 'none',
          color: 'var(--text-high)',
          transition: 'opacity 0.1s ease-out'
        }}>
          <svg viewBox="0 0 500 500" width="800" height="800" className="spin-earth">
            {/* Outer Edge */}
            <circle cx="250" cy="250" r="240" fill="none" stroke="currentColor" strokeWidth="2" />

            {/* Latitudes */}
            <ellipse cx="250" cy="250" rx="240" ry="80" fill="none" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="250" cy="250" rx="240" ry="160" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="250" x2="490" y2="250" stroke="currentColor" strokeWidth="1" />

            {/* Longitudes */}
            <ellipse cx="250" cy="250" rx="80" ry="240" fill="none" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="250" cy="250" rx="160" ry="240" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="250" y1="10" x2="250" y2="490" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* --- Interactive Sticky Features Section --- */}
      <section id="features" style={{ padding: 'clamp(60px, 10vh, 120px) 16px', maxWidth: 1200, margin: '0 auto', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-primary)' }}>

        <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 800, marginBottom: '60px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Create,<br />collaborate,<br />and go live
        </h2>

        <div className="features-container" style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', position: 'relative' }}>

          {/* Left Column (Sticky Menu) */}
          <div className="features-sticky-nav" style={{
            position: 'sticky',
            top: '120px',
            width: '35%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {FEATURES.map((f, i) => {
              const GraphicComponent = f.graphic;
              return (
                <div
                  key={i}
                  className="feature-item"
                  onClick={() => featureRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  style={{
                    cursor: 'pointer',
                    opacity: activeFeature === i ? 1 : 0.4,
                    transition: 'all 0.3s ease',
                    borderLeft: activeFeature === i ? `3px solid white` : '3px solid transparent',
                    paddingLeft: '20px'
                  }}
                >
                  <h3
                    className="feature-title"
                    style={{
                      fontSize: activeFeature === i ? 28 : 22,
                      fontWeight: 800,
                      marginBottom: activeFeature === i ? 10 : 0,
                      transition: 'font-size 0.3s ease',
                      color: activeFeature === i ? 'var(--text-high)' : 'var(--text-muted)'
                    }}
                  >
                    {f.title}
                  </h3>
                  <div
                    className="feature-content"
                    style={{
                      maxHeight: activeFeature === i ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease'
                    }}
                  >
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }}>{f.desc}</p>

                    {/* Desktop Only Link */}
                    {activeFeature === i && (
                      <div className="desktop-only-link" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: f.color, fontWeight: 700, fontSize: 14 }}>
                        Learn more <ArrowRight size={16} />
                      </div>
                    )}

                    {/* Mobile Only Graphic and Link Block */}
                    <div className="mobile-only-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: f.color, fontWeight: 700, fontSize: 14 }}>
                        Learn more <ArrowRight size={16} />
                      </div>
                      <div className="mobile-graphic-wrapper">
                        <GraphicComponent color={f.color} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Scrolling Graphics for Desktop) */}
          <div className="features-scroll-graphics" style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '120px' }}>
            {FEATURES.map((f, i) => {
              const GraphicComponent = f.graphic;
              return (
                <div
                  key={i}
                  ref={(el) => (featureRefs.current[i] = el)}
                  data-index={i}
                  style={{
                    height: '70vh',
                    minHeight: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <div className="graphic-wrapper">
                    <GraphicComponent color={f.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* -------------------------------------------------------- */}

      {/* Pricing */}
      <section id="pricing" style={{ padding: 'clamp(60px, 10vh, 120px) 16px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Transparent Pricing</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 80, fontSize: 'clamp(16px, 3vw, 20px)' }}>Choose the plan that fits your organization.</p>
          <div className="grid grid-4">
            {PLANS.map((p, i) => (
              <div key={i} className="card" style={{ position: 'relative', border: p.highlight ? '1px solid var(--text-high)' : undefined, animation: `slideUp 0.5s ease ${i * 0.1}s both`, borderRadius: 'var(--radius-hard)' }}>
                {p.highlight && <div className="mono" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--text-high)', color: 'var(--bg-primary)', padding: '4px 16px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>POPULAR</div>}
                <h3 style={{ fontSize: 20, marginBottom: 8, fontWeight: 700 }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.05em' }}>{formatINR(p.price)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/mo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                      <Plus size={12} style={{ color: 'var(--text-high)', flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/register?plan=' + p.name.toLowerCase())} className={`btn ${p.highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                  {p.name === 'Free' ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" style={{ padding: 'clamp(60px, 10vh, 120px) 16px', maxWidth: 800, margin: '0 auto', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Try It Now</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 'clamp(16px, 3vw, 20px)' }}>Quick-login as a demo tenant to explore the platform.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DEMO_USERS.map((u, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', animation: `slideUp 0.5s ease ${i * 0.1}s both`, borderRadius: 'var(--radius-hard)', flexDirection: 'column', gap: 12, padding: '20px' }} onClick={() => quickLogin(u.email)}>
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>{u.tenant}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{u.name} · {u.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'space-between' }}>
                <span className="badge">{u.plan}</span>
                <button className="btn btn-primary btn-sm" disabled={loginLoading === u.email}>
                  {loginLoading === u.email ? <span className="spinner" /> : <>Login <ArrowRight size={12} /></>}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mono" style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>Password for all demo accounts: <code style={{ background: 'var(--bg-surface)', padding: '4px 8px', border: '1px solid var(--border-color)' }}>demo123</code></p>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'clamp(32px, 5vh, 40px) 16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <Zap size={20} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.05em' }}>Site Pilot</span>
        </div>
        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>© 2026 Site Pilot. Minimal Modern Design System.</p>
      </footer>
    </div>
  );
}