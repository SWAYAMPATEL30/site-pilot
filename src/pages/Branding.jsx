import { useState, useEffect, useRef } from 'react';
import { Palette, Type, Image, UploadCloud, Save, CheckCircle, AlertCircle, Briefcase, X, AlignLeft } from 'lucide-react';
import { fetchCurrentUser, fetchBranding, modifyTenant, uploadLogo } from '../services/api';
import { formatINR } from '../lib/currency';

export default function BrandingPage() {
    const [user, setUser] = useState(null);
    const [branding, setBranding] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'ok' | 'error' | null
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
    const logoInputRef = useRef(null);

    useEffect(() => {
        async function init() {
            const [{ user: u }, { branding: b }] = await Promise.all([
                fetchCurrentUser(),
                fetchBranding(),
            ]);
            setUser(u);
            setBranding(b || u?.tenant?.branding || {});
            setLoading(false);
        }
        init();
    }, []);

    function normalizeHex(val) {
        if (!val) return null;
        let s = String(val).trim();
        if (!s) return null;
        if (!s.startsWith('#')) s = `#${s}`;
        
        const three = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/i;
        const six = /^#([0-9a-fA-F]{6})$/i;
        
        const m3 = s.match(three);
        if (m3) return `#${m3[1]}${m3[1]}${m3[2]}${m3[2]}${m3[3]}${m3[3]}`.toLowerCase();
        
        const m6 = s.match(six);
        if (m6) return s.toLowerCase();
        
        return null;
    }

    function hexToRgba(hex, alpha = 1) {
        const h = normalizeHex(hex);
        if (!h) return null;
        const n = parseInt(h.slice(1), 16);
        const r = (n >> 16) & 255;
        const g = (n >> 8) & 255;
        const b = n & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function isLightHex(hex) {
        const h = normalizeHex(hex);
        if (!h) return false;
        const n = parseInt(h.slice(1), 16);
        const r = (n >> 16) & 255;
        const g = (n >> 8) & 255;
        const b = n & 255;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum > 0.7;
    }

    async function handleSave() {
        setSaving(true);
        setSaveStatus(null);
        const result = await modifyTenant(branding);
        setSaveStatus(result.ok ? 'ok' : 'error');
        setSaving(false);
        setTimeout(() => setSaveStatus(null), 3000);
    }

    async function handleLogoUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const result = await uploadLogo(file);
        if (result.ok) setBranding(prev => ({ ...prev, logo: result.logo }));
        setUploading(false);
    }

    function handleAddService() {
        if (!serviceForm.name.trim()) {
            alert('Service name is required');
            return;
        }
        const newService = {
            name: serviceForm.name,
            description: serviceForm.description,
            price: serviceForm.price ? parseFloat(serviceForm.price) : 0,
        };
        setBranding(prev => ({
            ...prev,
            services: [...(prev.services || []), newService],
        }));
        setServiceForm({ name: '', description: '', price: '' });
    }

    function handleRemoveService(index) {
        setBranding(prev => ({
            ...prev,
            services: prev.services?.filter((_, i) => i !== index) || [],
        }));
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    const FONTS = ['Inter', 'Outfit', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Playfair Display', 'Raleway'];
    
    const COLOR_CONFIG = [
        { key: 'primaryColor', label: 'Primary Color', defaultHex: '#8b5cf6' },
        { key: 'secondaryColor', label: 'Secondary Color', defaultHex: '#10b981' },
        { key: 'accentColor', label: 'Accent Color', defaultHex: '#f59e0b' },
        { key: 'bgColor', label: 'Background Color', defaultHex: '#ffffff' },
        { key: 'textColor', label: 'Text Color', defaultHex: '#111827' },
    ];

    const brandName = branding.brandName || user?.tenant?.name || 'Company';
    const brandDescription = branding.brandDescription || 'Your tagline or mission statement goes here';
    const pBgColor = normalizeHex(branding.bgColor) || normalizeHex(branding.backgroundColor) || '#ffffff';
    const pTextColor = normalizeHex(branding.textColor) || '#111827';
    const pPrimaryColor = normalizeHex(branding.primaryColor) || '#8b5cf6';
    
    const previewServices = branding.services?.length > 0 
        ? branding.services 
        : [
            { name: 'Feature One', description: 'Description of this feature', price: 0 },
            { name: 'Feature Two', description: 'Description of this feature', price: 0 },
            { name: 'Feature Three', description: 'Description of this feature', price: 0 }
          ];

    return (
        <div className="animate-slide-up">
            <div style={{ marginBottom: 'clamp(24px, 4vw, 40px)' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Branding</h1>
                <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Customize your brand colors, typography, services, and visual identity</p>
            </div>

            {/* Changed from rigid grid to fluid flexbox */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
                
                {/* Controls - takes up remaining space, min 300px */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-subtle)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}><AlignLeft size={16}/> Brand Details</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand Name</label>
                            <input className="input" type="text" placeholder={user?.tenant?.name || 'Company Name'} value={branding.brandName || ''} onChange={e => setBranding({ ...branding, brandName: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tagline / Description</label>
                            <textarea className="input" placeholder="Your brand's mission statement" value={branding.brandDescription || ''} onChange={e => setBranding({ ...branding, brandDescription: e.target.value })} style={{ width: '100%', minHeight: 60, fontFamily: 'Inter', fontSize: 13 }} />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-subtle)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Palette size={16}/> Colors</h3>
                        {COLOR_CONFIG.map(({ key, label, defaultHex }) => {
                            const currentHex = normalizeHex(branding[key]) || defaultHex;
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <input type="color" value={currentHex} onChange={e => setBranding({ ...branding, [key]: e.target.value })} style={{ width: 32, height: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', cursor: 'pointer', padding: 0, background: 'none' }} />
                                        <code className="mono" style={{ fontSize: 11, color: 'var(--text-high)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: 'var(--radius-hard)', textTransform: 'uppercase' }}>{currentHex}</code>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-subtle)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Briefcase size={16}/> Services</h3>
                        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input className="input" type="text" placeholder="Service name" value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} style={{ width: '100%' }} />
                            <textarea className="input" placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} style={{ width: '100%', minHeight: 60, fontFamily: 'Inter', fontSize: 13 }} />
                            <input className="input" type="number" placeholder="Price (₹)" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} style={{ width: '100%' }} />
                            <button className="btn btn-primary mono" onClick={handleAddService} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px', fontSize: 12 }}>
                                + Add Service
                            </button>
                        </div>
                        {branding.services?.length > 0 && (
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                                {branding.services.map((service, idx) => (
                                    <div key={idx} style={{ marginBottom: 12, padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-hard)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, paddingRight: 12 }}>
                                            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-high)', marginBottom: 4 }}>{service.name}</div>
                                            {service.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{service.description}</div>}
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatINR(service.price || 0)}</div>
                                        </div>
                                        <button onClick={() => handleRemoveService(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-subtle)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Type size={16}/> Typography</h3>
                        <div style={{ marginBottom: 24 }}>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heading Font</label>
                            <select className="input" value={branding.fontHeading || 'Outfit'} onChange={e => setBranding({ ...branding, fontHeading: e.target.value })} style={{ width: '100%' }}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Font</label>
                            <select className="input" value={branding.fontBody || 'Inter'} onChange={e => setBranding({ ...branding, fontBody: e.target.value })} style={{ width: '100%' }}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-subtle)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Image size={16}/> Logo</h3>
                        <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                        {branding.logo && (
                            <div style={{ marginBottom: 16, padding: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', textAlign: 'center' }}>
                                <img src={branding.logo} alt="Logo" style={{ maxHeight: 64, maxWidth: '100%', objectFit: 'contain' }} />
                            </div>
                        )}
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 'clamp(20px, 5vw, 40px)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ fontSize: 32, marginBottom: 16 }}>{uploading ? <span className="spinner" style={{ width: 32, height: 32 }} /> : <UploadCloud size={32} />}</div>
                            <p className="mono" style={{ fontSize: 12, color: 'var(--text-high)', marginBottom: 8, textTransform: 'uppercase' }}>{uploading ? 'Uploading...' : branding.logo ? 'Click to replace logo' : 'Click to upload logo'}</p>
                            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNG, SVG or JPG (max 5MB)</p>
                        </div>
                    </div>

                    {saveStatus && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', border: `1px solid ${saveStatus === 'ok' ? '#10b981' : '#ef4444'}`, borderRadius: 'var(--radius-hard)', color: saveStatus === 'ok' ? '#10b981' : '#ef4444', fontSize: 13 }}>
                            {saveStatus === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {saveStatus === 'ok' ? 'Branding saved successfully!' : 'Failed to save. Please try again.'}
                        </div>
                    )}

                    <button className="btn btn-primary mono" onClick={handleSave} disabled={saving} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px' }}>
                        {saving ? 'Saving...' : <> <Save size={16}/> Save Branding</>}
                    </button>
                </div>

                {/* Live Preview - Slightly larger flex basis for desktop, fluid on mobile */}
                <div className="card" style={{ flex: '1.2 1 320px', position: 'sticky', top: 24, padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-subtle)', display: 'flex', flexDirection: 'column', minHeight: 'min(600px, 80vh)' }}>
                    <div className="mono" style={{ padding: '16px clamp(16px, 3vw, 24px)', borderBottom: '1px solid var(--border-color)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-primary)' }}>Live Preview</div>
                    
                    <div style={{ background: pBgColor, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        
                        {/* Preview Header */}
                        <div style={{ padding: 'clamp(16px, 3vw, 24px) clamp(16px, 3vw, 32px)', borderBottom: `1px solid ${hexToRgba(pPrimaryColor, 0.2)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {branding.logo && <img src={branding.logo} alt="Logo" style={{ maxHeight: 32, maxWidth: 100, objectFit: 'contain' }} />}
                                {!branding.logo && (
                                    <div style={{ fontFamily: branding.fontHeading || 'Outfit', fontWeight: 800, fontSize: 'clamp(18px, 4vw, 24px)', color: pPrimaryColor, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
                                        {brandName}
                                    </div>
                                )}
                            </div>
                            <div className="mono" style={{ display: 'flex', gap: 'clamp(12px, 2vw, 24px)', flexWrap: 'wrap', fontFamily: branding.fontBody || 'Inter', fontSize: 11, color: pTextColor, textTransform: 'uppercase' }}>
                                <span style={{ cursor: 'pointer', opacity: 0.8 }}>Home</span>
                                <span style={{ cursor: 'pointer', opacity: 0.8 }}>Services</span>
                                <span style={{ cursor: 'pointer', opacity: 0.8 }}>Contact</span>
                            </div>
                        </div>

                        {/* Preview Hero */}
                        <div style={{ padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 40px)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
                            <h1 style={{ fontFamily: branding.fontHeading || 'Outfit', fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 800, marginBottom: 16, color: pTextColor, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                                Welcome to {brandName}
                            </h1>
                            <p className="mono" style={{ fontFamily: branding.fontBody || 'Inter', color: hexToRgba(pTextColor, 0.75) || pTextColor, fontSize: 'clamp(11px, 2vw, 13px)', marginBottom: 'clamp(24px, 5vw, 40px)', textTransform: 'uppercase', maxWidth: 500 }}>
                                {brandDescription}
                            </p>
                            <span className="mono" style={{ background: pPrimaryColor, color: isLightHex(pPrimaryColor) ? '#111827' : '#ffffff', padding: '14px 32px', borderRadius: 'var(--radius-hard)', fontWeight: 700, fontSize: 12, fontFamily: branding.fontBody || 'Inter', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'opacity 0.2s', opacity: 0.9 }}>
                                Get Started
                            </span>
                        </div>

                        {/* Preview Services */}
                        <div style={{ padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 32px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
                            {previewServices.slice(0, 3).map((service, i) => (
                                <div key={i} style={{ border: `1px solid ${hexToRgba(pPrimaryColor, 0.3)}`, borderRadius: 'var(--radius-hard)', padding: 'clamp(16px, 3vw, 24px)', textAlign: 'center', background: hexToRgba(pPrimaryColor, 0.05) }}>
                                    <div className="mono" style={{ width: 40, height: 40, borderRadius: 'var(--radius-hard)', border: `2px solid ${pPrimaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: pPrimaryColor, fontWeight: 700, fontSize: 16 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ fontFamily: branding.fontHeading || 'Outfit', fontWeight: 700, fontSize: 14, marginBottom: 8, color: pTextColor, textTransform: 'uppercase' }}>
                                        {service.name}
                                    </div>
                                    <div className="mono" style={{ fontFamily: branding.fontBody || 'Inter', fontSize: 11, color: hexToRgba(pTextColor, 0.65) || pTextColor, textTransform: 'uppercase', marginBottom: 8 }}>
                                        {service.description || 'Service details'}
                                    </div>
                                    {service.price > 0 && (
                                        <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: pPrimaryColor }}>
                                            ${service.price}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Preview Footer */}
                        <div className="mono" style={{ padding: '24px 32px', borderTop: `1px solid ${hexToRgba(pPrimaryColor, 0.2)}`, textAlign: 'center', fontFamily: branding.fontBody || 'Inter', fontSize: 10, color: hexToRgba(pTextColor, 0.6) || pTextColor, textTransform: 'uppercase' }}>
                            © 2026 {brandName}. All rights reserved.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}