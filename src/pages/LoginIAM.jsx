import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, ArrowRight, Shield } from 'lucide-react';

export default function LoginIAMPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await loginUser(email, password);
            if (result.ok) {
                // Viewers and editors both land on dashboard
                login(result.user, result.token);
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed. Check your credentials.');
            }
        } catch {
            setError('Connection error — make sure the backend is running.');
        }
        setLoading(false);
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '16px',
        }}>
            <div className="animate-slide-up" style={{
                width: '100%',
                maxWidth: 440,
                padding: 'clamp(24px, 5vw, 40px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-hard)',
                background: 'var(--bg-surface)',
            }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: 'var(--radius-hard)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                        <Users size={24} />
                    </div>
                    <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                        Team Member Login
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                        Sign in with credentials shared by your organization admin.
                    </p>
                </div>

                {/* Role badge info */}
                <div className="mono" style={{
                    display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap',
                }}>
                    {[
                        { role: 'EDITOR', color: '#10b981', desc: 'Can create & edit' },
                        { role: 'VIEWER', color: '#6b7280', desc: 'Read-only access' },
                    ].map(({ role, color, desc }) => (
                        <div key={role} style={{
                            flex: '1 1 120px',
                            padding: '8px 12px',
                            border: `1px solid ${color}33`,
                            borderRadius: 'var(--radius-hard)',
                            background: `${color}08`,
                        }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.05em', marginBottom: 2 }}>{role}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{desc}</div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{
                        border: '1px solid #ef4444', borderRadius: 'var(--radius-hard)',
                        padding: '12px 16px', marginBottom: 24,
                        color: '#ef4444', fontSize: 13, fontWeight: 600,
                    }}>{error}</div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="input-group" style={{ marginBottom: 20 }}>
                        <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>Email Address</label>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@yourcompany.com"
                            required
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 32 }}>
                        <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>Password</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        {loading ? <span className="spinner" /> : <><ArrowRight size={16} /> Sign In</>}
                    </button>
                </form>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, textAlign: 'center' }}>
                    <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                        Are you an organization admin?{' '}
                        <Link to="/login" style={{ fontWeight: 700, color: 'var(--text-high)', textDecoration: 'underline' }}>
                            Admin Login →
                        </Link>
                    </div>
                    <div className="mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <Shield size={11} />
                        Credentials are managed by your organization admin
                    </div>
                </div>
            </div>
        </div>
    );
}
