import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, fetchWebsites } from '../services/api';
import { Lock, Globe, Globe2, ArrowRight } from 'lucide-react';

export default function DomainsPage() {
    const [user, setUser] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [verifying, setVerifying] = useState(null);
    const [selectedSite, setSelectedSite] = useState('');

    useEffect(() => {
        async function init() {
            const u = await fetchCurrentUser();
            const w = await fetchWebsites();
            setUser(u.user);
            setWebsites(w.websites || []);
            setLoading(false);
        }
        init();
    }, []);

    function simulateVerify(siteId) {
        setVerifying(siteId);
        setTimeout(() => {
            setWebsites(websites.map(w => w.id === siteId ? { ...w, domain: { ...w.domain, verified: true, ssl: true } } : w));
            setVerifying(null);
        }, 3000);
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    const planCanCustomDomain = !['free'].includes(user?.tenant?.plan);

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Domains</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Manage custom domains for your websites</p>
                </div>
                {planCanCustomDomain && <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowAdd(true)}>+ Connect Domain</button>}
            </div>

            {!planCanCustomDomain && (
                <div className="card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--error)', marginBottom: 40, padding: 24, borderRadius: 'var(--radius-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 40, height: 40, border: '1px solid var(--error)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--error)' }}><Lock size={20} /></div>
                        <div>
                            <div className="mono" style={{ fontWeight: 700, fontSize: 12, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Custom Domains Unavailable</div>
                            <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upgrade to Starter or higher to connect custom domains</div>
                        </div>
                        <Link to="/dashboard/billing" className="btn btn-ghost btn-sm mono" style={{ marginLeft: 'auto', color: 'var(--error)', borderColor: 'var(--error)', textTransform: 'uppercase' }}>Upgrade</Link>
                    </div>
                </div>
            )}

            <div className="grid grid-2" style={{ gap: 24 }}>
                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Subdomains</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {websites.map(site => (
                            <div key={site.id} className="card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-surface)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 36, height: 36, background: 'var(--bg-primary)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--primary)', boxShadow: '0 4px 12px rgba(99,102,241,0.1)' }}>{site.settings?.favicon || <Globe size={16} />} </div>
                                    <div>
                                        <div className="mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-high)', marginBottom: 4 }}>{site.domain?.subdomain}</div>
                                        <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{site.name}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="badge mono" style={{ textTransform: 'uppercase', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>Active</span>
                                        <span className="badge mono" style={{ textTransform: 'uppercase', background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>SSL ✓</span>
                                    </div>
                                    <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />
                                    <a href={`https://spit-hack.app.n8n.cloud/webhook/tenantflow-hosting/site/${site.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mono" style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Visit Live <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom Domains</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {websites.filter(s => s.domain?.custom).map(site => (
                            <div key={site.id} className="card-hover" style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', background: 'var(--bg-surface)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ width: 36, height: 36, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-high)' }}><Globe2 size={16} /></div>
                                        <div>
                                            <div className="mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-high)', marginBottom: 4 }}>{site.domain.custom}</div>
                                            <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowRight size={10} /> {site.name}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {site.domain.verified ? (
                                                <><span className="badge mono" style={{ textTransform: 'uppercase', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>Verified</span><span className="badge mono" style={{ textTransform: 'uppercase', background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>SSL ✓</span></>
                                            ) : verifying === site.id ? (
                                                <span className="badge mono" style={{ textTransform: 'uppercase', background: 'var(--bg-primary)' }}>Verifying...</span>
                                            ) : (
                                                <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={() => simulateVerify(site.id)}>Verify DNS</button>
                                            )}
                                        </div>
                                        {site.domain.verified && (
                                            <>
                                                <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />
                                                <a href={`https://${site.domain.custom}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mono" style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Visit Live <ArrowRight size={14} />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!site.domain.verified && (
                                    <div style={{ marginTop: 16, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 16 }}>
                                        <div className="mono" style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DNS Configuration Required</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                            <div><div className="mono" style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}>Type</div><div className="mono" style={{ fontWeight: 600, fontSize: 11, color: 'var(--text-high)' }}>CNAME</div></div>
                                            <div><div className="mono" style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}>Name</div><div className="mono" style={{ fontWeight: 600, fontSize: 11, color: 'var(--text-high)' }}>www</div></div>
                                            <div><div className="mono" style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}>Value</div><div className="mono" style={{ fontWeight: 600, fontSize: 11, color: 'var(--text-high)' }}>proxy.tenantflow.app</div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {websites.filter(s => s.domain?.custom).length === 0 && (
                            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-hard)' }}>
                                <Globe2 size={24} style={{ marginBottom: 16 }} />
                                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>No custom domains</h3>
                                <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>{planCanCustomDomain ? 'Connect a custom domain to your website' : 'Upgrade to add custom domains'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowAdd(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 'var(--radius-subtle)', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connect Custom Domain</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowAdd(false)}>✕</button>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website</label>
                            <select className="input" value={selectedSite} onChange={e => setSelectedSite(e.target.value)} style={{ width: '100%' }}>
                                <option value="">Select a website</option>
                                {websites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 32 }}>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain Name</label>
                            <input className="input" value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="example.com" style={{ width: '100%' }} />
                        </div>
                        <button className="btn btn-primary mono" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => { setShowAdd(false); }}>Connect Domain</button>
                    </div>
                </div>
            )}
        </div>
    );
}
