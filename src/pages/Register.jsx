import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { registerTenant } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Rocket, Plus } from 'lucide-react';

const PLAN_DATA = [
    { id: 'free', name: 'Free', price: '$0', features: ['1 Website', '3 Pages', '100MB', '5 AI Gen'], highlight: false },
    { id: 'starter', name: 'Starter', price: '$9', features: ['3 Websites', '10 Pages', '1GB', '50 AI Gen', '1 Domain'], highlight: false },
    { id: 'professional', name: 'Professional', price: '$29', features: ['10 Websites', '50 Pages', '10GB', '500 AI Gen', '5 Domains', 'Collab'], highlight: true },
    { id: 'enterprise', name: 'Enterprise', price: '$99', features: ['Unlimited All', '100GB', 'Unlimited AI', 'Priority Support'], highlight: false },
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(searchParams.get('plan') || 'free');
    const [form, setForm] = useState({ orgName: '', slug: '', name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const result = await registerTenant({
                name: form.name,
                email: form.email,
                password: form.password || 'demo123',
                tenantName: form.orgName,
                slug: form.slug || form.orgName.toLowerCase().replace(/\s+/g, '-'),
                plan,
            });
            if (result.ok) {
                login(result.user, result.token);   // use real JWT from backend
                navigate('/dashboard');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch { setError('Connection error — make sure the backend is running'); }
        setLoading(false);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '16px' }}>
            <div className="animate-slide-up" style={{ width: '100%', maxWidth: step === 1 ? 800 : 460, padding: 'clamp(24px, 5vw, 40px)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-surface)', transition: 'width 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}>
                <div style={{ marginBottom: 40 }}>
                    <Rocket size={32} style={{ marginBottom: 16 }} />
                    <h1 style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{step === 1 ? 'Choose Plan' : 'Create Account'}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px, 2vw, 15px)' }}>{step === 1 ? 'Select a plan to get started.' : 'Set up your organization.'}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                        {[1, 2].map(s => (<div key={s} style={{ flex: 1, height: 2, background: s <= step ? 'var(--text-high)' : 'var(--border-color)', transition: 'background 0.3s' }} />))}
                    </div>
                </div>

                {step === 1 && (
                    <>
                        <div className="grid grid-4" style={{ marginBottom: 32 }}>
                            {PLAN_DATA.map(p => (
                                <div key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? 'var(--text-high)' : 'var(--bg-primary)', color: plan === p.id ? 'var(--bg-primary)' : 'var(--text-high)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                                    {p.highlight && <div className="mono" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#FFFFFF', padding: '2px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>POPULAR</div>}
                                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.name}</div>
                                    <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.05em' }}>{p.price}<span style={{ fontSize: 12, color: plan === p.id ? 'var(--bg-surface)' : 'var(--text-muted)', fontWeight: 500, letterSpacing: 'normal' }}>/mo</span></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {p.features.map((f, i) => (<div key={i} style={{ fontSize: 12, color: plan === p.id ? 'var(--bg-surface)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> {f}</div>))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setStep(2)}>Continue with {PLAN_DATA.find(p => p.id === plan)?.name}</button>
                    </>
                )}

                {step === 2 && (
                    <form onSubmit={handleRegister}>
                        {error && <div style={{ border: '1px solid #ef4444', borderRadius: 'var(--radius-hard)', padding: '12px 16px', marginBottom: 24, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>{error}</div>}
                        <div className="input-group" style={{ marginBottom: 20 }}>
                            <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Organization Name</label>
                            <input className="input" value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="My Company" required />
                        </div>
                        <div className="input-group" style={{ marginBottom: 20 }}>
                            <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>URL Slug</label>
                            <input className="input mono" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-company" />
                            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.slug || 'your-org'}.sitepilot.app</span>
                        </div>
                        <div className="input-group" style={{ marginBottom: 20 }}>
                            <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Your Name</label>
                            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required />
                        </div>
                        <div className="input-group" style={{ marginBottom: 20 }}>
                            <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Email Address</label>
                            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
                        </div>
                        <div className="input-group" style={{ marginBottom: 32 }}>
                            <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Password</label>
                            <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', flex: '1 1 auto', minWidth: '100px' }}>Back</button>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: '1 1 auto', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{loading ? <span className="spinner" /> : 'Create Account'}</button>
                        </div>
                    </form>
                )}
                <div style={{ marginTop: 32, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                    <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}
