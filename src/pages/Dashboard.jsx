import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, fetchWebsites } from '../services/api';
import { Globe, FileText, Users, Cpu, Palette, Rocket, User, Zap, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const userData = await fetchCurrentUser();
            const sitesData = await fetchWebsites();
            setUser(userData.user);
            setWebsites(sitesData.websites || []);
            setLoading(false);
        }
        load();
    }, []);

    if (loading || !user) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>;

    const tenant = user.tenant;
    const limits = tenant?.planLimits || { websites: 1, pages: 3, storage: 100, ai: 5, domains: 0 };
    const usage = tenant?.usage || {};

    const stats = [
        { icon: <Globe size={16} />, label: 'Websites', value: websites.length, limit: limits.websites, change: '+1 this week', positive: true, color: '#8b5cf6' },
        { icon: <FileText size={16} />, label: 'Total Pages', value: websites.reduce((a, w) => a + (w.pageCount || 0), 0), limit: limits.pages, change: '+5 this week', positive: true, color: '#06b6d4' },
        { icon: <Users size={16} />, label: 'Team Members', value: tenant?.members?.length || 1, change: 'No change', positive: true, color: '#10b981' },
        { icon: <Cpu size={16} />, label: 'AI Generations', value: usage.aiGenerations || 0, limit: limits.ai, change: '+12 today', positive: true, color: '#f59e0b' },
    ];

    const recentActivity = [
        { icon: <Palette size={14} />, action: 'Design updated', target: websites[0]?.name || 'Website', time: '2m ago' },
        { icon: <Rocket size={14} />, action: 'Site published', target: websites[0]?.name || 'Website', time: '1h ago' },
        { icon: <Cpu size={14} />, action: 'AI content generated', target: 'Landing page', time: '3h ago' },
        { icon: <User size={14} />, action: 'Team member invited', target: 'developer@team.com', time: '1d ago' },
    ];

    return (
        <div className="animate-slide-up">
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                    Welcome back, {user.name?.split(' ')[0]}
                </h1>
                <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Overview for {tenant?.name}</p>
            </div>

            <div className="grid grid-4" style={{ marginBottom: 40 }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ animation: `slideUp 0.4s ease ${i * 0.1}s both`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140, padding: 24, borderRadius: 'var(--radius-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: 32, height: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                            <div className="mono" style={{ fontSize: 11, color: s.positive ? 'var(--primary)' : 'var(--text-muted)' }}>{s.change}</div>
                        </div>
                        <div>
                            <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-high)', lineHeight: 1, marginBottom: 8 }}>{s.value}<span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s.limit ? `/${s.limit}` : ''}</span></div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Websites</h2>
                        <Link to="/dashboard/websites" className="btn btn-ghost btn-sm mono" style={{ fontSize: 11, textTransform: 'uppercase', display:'flex', alignItems:'center', gap:4 }}>View all <ArrowRight size={12} /></Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {websites.slice(0, 4).map((site, i) => (
                            <Link key={site.id} to={`/dashboard/websites/${site.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', textDecoration: 'none', animation: `slideUp 0.4s ease ${i * 0.1}s both`, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 40, height: 40, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{site.settings?.favicon || <Globe size={20} />}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-high)', marginBottom: 4 }}>{site.name}</div>
                                        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{site.domain?.subdomain} · {site.pageCount || 0} pages</div>
                                    </div>
                                </div>
                                <span className="badge mono" style={{ textTransform: 'uppercase' }}>{site.status}</span>
                            </Link>
                        ))}
                        {websites.length === 0 && (
                            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-hard)' }}>
                                <div style={{ fontSize: 24, marginBottom: 16 }}><Globe size={24} /></div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No websites yet</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Create your first website to get started</p>
                                <Link to="/dashboard/websites" className="btn btn-primary btn-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create Website</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Log</h2>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {recentActivity.map((act, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <div style={{ width: 32, height: 32, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{act.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-high)', marginBottom: 4 }}>{act.action}</div>
                                        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{act.target}</div>
                                    </div>
                                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{act.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Usage</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { label: 'Websites', used: websites.length, total: limits.websites },
                                { label: 'Storage', used: usage.storage || 0, total: limits.storage, unit: 'MB' },
                                { label: 'AI Generations', used: usage.aiGenerations || 0, total: limits.ai },
                            ].map((m, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                        <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
                                        <span className="mono" style={{ fontWeight: 600, color: 'var(--text-high)' }}>{m.used}{m.unit || ''} / {m.total}{m.unit || ''}</span>
                                    </div>
                                    <div style={{ height: 4, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: (m.used / m.total) > 0.9 ? 'var(--error)' : 'var(--text-high)', width: `${Math.min((m.used / m.total) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                            <Link to="/dashboard/billing" className="btn btn-ghost btn-sm mono" style={{ display: 'flex', justifyContent:'center', alignItems:'center', gap:4, marginTop: 8, textTransform: 'uppercase' }}>Upgrade Plan <ArrowRight size={12} /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
