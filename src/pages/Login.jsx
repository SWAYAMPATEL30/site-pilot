import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Zap, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await loginUser(email, password);
            if (result.ok) {
                login(result.user, result.token);   // use real JWT from backend
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch { setError('Connection error — make sure the backend is running'); }
        setLoading(false);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '16px' }}>
            <div className="animate-slide-up" style={{ width: '100%', maxWidth: 420, padding: 'clamp(24px, 5vw, 40px)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-surface)' }}>
                <div style={{ marginBottom: 40 }}>
                    <Zap size={32} style={{ marginBottom: 16 }} />
                    <h1 style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Admin Sign In</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px, 2vw, 15px)' }}>Organization administrator access.</p>
                </div>
                {error && <div style={{ border: '1px solid #ef4444', borderRadius: 'var(--radius-hard)', padding: '12px 16px', marginBottom: 24, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="input-group" style={{ marginBottom: 24 }}>
                        <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Email Address</label>
                        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 32 }}>
                        <label style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>Password</label>
                        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {loading ? <span className="spinner" /> : <><ArrowRight size={16}/> Authenticate</>}
                    </button>
                </form>
                <div style={{ marginBottom: 20, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>New organization? </span>
                    <Link to="/register" style={{ fontWeight: 700, textDecoration: 'underline' }}>Create Account</Link>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
                    <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                        <Shield size={11} style={{ display: 'inline', marginRight: 6 }} />
                        Team member? Use IAM login instead.
                    </p>
                    <Link to="/login/iam" className="btn btn-ghost mono" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '10px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.05em' }}>
                        Team Member Login →
                    </Link>
                </div>
            </div>
        </div>
    );
}
