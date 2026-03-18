import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCurrentUser, fetchWebsites, fetchPages, deployWebsite, removePageById } from '../services/api';
import { ArrowLeft, Globe, Paintbrush, Rocket, Activity, Cpu, Zap, Database, TrendingUp, AlertTriangle } from 'lucide-react';

export default function WebsiteDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pages');
    const [deploying, setDeploying] = useState(false);

    useEffect(() => { loadData(); }, [id]);

    async function loadData() {
        const u = await fetchCurrentUser();
        const w = await fetchWebsites();
        const p = fetchPages(id);
        setUser(u.user);
        setWebsite(w.websites?.find(s => s.id === id));
        setPages(p.pages || []);
        setLoading(false);
    }

    async function handleDeploy() {
        setDeploying(true);
        await deployWebsite(id);
        setTimeout(() => { setDeploying(false); loadData(); }, 800);
    }

    function handleDeletePage(pageId) {
        if (!confirm('Delete this page?')) return;
        removePageById(pageId);
        loadData();
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;
    if (!website) return <div className="empty-state"><h3>Website not found</h3></div>;

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <button className="btn btn-ghost mono" style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate('/dashboard/websites')}><ArrowLeft size={14} /> Back</button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                            <div style={{ width: 40, height: 40, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{website.settings?.favicon ? website.settings?.favicon : <Globe size={20} />}</div>
                            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{website.name}</h1>
                            <span className="badge mono" style={{ textTransform: 'uppercase' }}>{website.status}</span>
                        </div>
                        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>{website.domain?.subdomain}{website.domain?.custom ? ` · ${website.domain.custom}` : ''}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button className="btn btn-ghost mono" style={{ textTransform: 'uppercase' }} onClick={() => navigate(`/dashboard/websites/${id}/builder`)}><Paintbrush size={16} /> Open Builder</button>
                    <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={handleDeploy} disabled={deploying}>
                        {deploying ? 'Deploying...' : <> <Rocket size={16} /> Deploy</>}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                {['pages', 'observability', 'settings', 'seo'].map(t => (
                    <button key={t} className="mono" style={{ background: activeTab === t ? 'var(--text-high)' : 'transparent', color: activeTab === t ? 'var(--bg-primary)' : 'var(--text-muted)', border: '1px solid', borderColor: activeTab === t ? 'var(--text-high)' : 'transparent', padding: '8px 16px', borderRadius: 'var(--radius-hard)', cursor: 'pointer', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }} onClick={() => setActiveTab(t)}>
                        {t}
                    </button>
                ))}
            </div>

            {activeTab === 'pages' && (
                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages <span className="mono" style={{ color: 'var(--text-muted)' }}>({pages.length})</span></h2>
                        <button className="btn btn-primary btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={() => navigate(`/dashboard/websites/${id}/builder`)}>+ Add Page</button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    {['Page', 'Slug', 'Components', 'Version', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="mono" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map(page => (
                                    <tr key={page.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--text-high)' }}>{page.title}</td>
                                        <td className="mono" style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 12 }}>{page.slug}</td>
                                        <td className="mono" style={{ padding: '16px 24px', color: 'var(--text-high)', fontSize: 12 }}>{page.components?.length || 0}</td>
                                        <td style={{ padding: '16px 24px' }}><span className="badge mono" style={{ textTransform: 'uppercase' }}>v{page.version}</span></td>
                                        <td style={{ padding: '16px 24px' }}><span className="badge mono" style={{ textTransform: 'uppercase' }}>{page.status}</span></td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={() => navigate(`/dashboard/websites/${id}/builder?page=${page.id}`)}>Edit</button>
                                                <button className="btn btn-ghost btn-sm mono" style={{ color: 'var(--error)', textTransform: 'uppercase' }} onClick={() => handleDeletePage(page.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'observability' && (
                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usage Monitoring & Metrics</h2>
                    </div>

                    <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <AlertTriangle size={18} style={{ color: '#eab308', marginTop: 2 }} />
                        <div>
                            <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#ca8a04', marginBottom: 4, textTransform: 'uppercase' }}>Approaching Plan Limit</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Your website has consumed 85% of its monthly bandwidth limit. Consider upgrading your plan to ensure uninterrupted service.
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-3" style={{ gap: 16, marginBottom: 24 }}>
                        <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 12 }}>
                                <Activity size={16} /><span className="mono" style={{ fontSize: 11, textTransform: 'uppercase' }}>Monthly Traffic</span>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-high)', marginBottom: 4 }}>14,208</div>
                            <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} /> +12.4% vs last month</div>
                        </div>
                        <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 12 }}>
                                <Zap size={16} /><span className="mono" style={{ fontSize: 11, textTransform: 'uppercase' }}>Avg Load Time</span>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-high)', marginBottom: 4 }}>420ms</div>
                            <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} /> -50ms improvement</div>
                        </div>
                        <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 12 }}>
                                <Database size={16} /><span className="mono" style={{ fontSize: 11, textTransform: 'uppercase' }}>Bandwidth Usage</span>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--warning)', marginBottom: 4 }}>8.5 GB</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>85% of 10 GB limit</div>
                        </div>
                    </div>

                    <div className="grid grid-2" style={{ gap: 16 }}>
                        <div style={{ padding: 24, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)' }}>
                            <h3 className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-high)', textTransform: 'uppercase', marginBottom: 16 }}>Resource Utilization (CPU)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
                                    <div style={{ flex: 1, height: 8, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: '42%', height: '100%', background: 'var(--primary)' }} />
                                    </div>
                                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-high)' }}>42%</span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Peak utilization reached 78% during high traffic period on Tuesday.</div>
                            </div>
                        </div>
                        <div style={{ padding: 24, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)' }}>
                            <h3 className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-high)', textTransform: 'uppercase', marginBottom: 16 }}>Feature Consumption (API)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>AI Content Generations</span>
                                    <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-high)' }}>45 / 100</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ width: '45%', height: '100%', background: 'var(--success)' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Dynamic Backend Calls</span>
                                    <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-high)' }}>12K / 50K</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ width: '24%', height: '100%', background: 'var(--primary)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="card" style={{ maxWidth: 600, padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website Settings</h3>
                    <div style={{ marginBottom: 24 }}>
                        <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website Name</label>
                        <input className="input" defaultValue={website.name} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Favicon</label>
                        <input className="input" defaultValue={website.settings?.favicon || ''} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Language</label>
                        <select className="input" defaultValue={website.settings?.language || 'en'} style={{ width: '100%' }}>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                    <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Save Settings</button>
                </div>
            )}

            {activeTab === 'seo' && (
                <div className="card" style={{ maxWidth: 600, padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO Settings</h3>
                    <div style={{ marginBottom: 24 }}>
                        <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page Title</label>
                        <input className="input" defaultValue={website.settings?.seo?.title} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meta Description</label>
                        <textarea className="input" defaultValue={website.settings?.seo?.description} rows={4} style={{ width: '100%', resize: 'vertical' }} />
                    </div>
                    <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Save SEO</button>
                </div>
            )}
        </div>
    );
}
