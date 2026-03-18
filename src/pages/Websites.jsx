import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, fetchWebsites, createWebsite, removeWebsiteById } from '../services/api';
import { Globe, FileText, Globe2, Trash2, Plus } from 'lucide-react';

export default function WebsitesPage() {
    const navigate = useNavigate();
    const [websites, setWebsites] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newSite, setNewSite] = useState({ name: '', slug: '' });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const u = await fetchCurrentUser();
        const s = await fetchWebsites();
        setUser(u.user);
        setWebsites(s.websites || []);
        setLoading(false);
    }

    async function handleCreateWebsite(e) {
        e.preventDefault();
        setCreating(true); setError('');
        const result = await createWebsite(newSite);
        if (result.ok) { setShowCreate(false); setNewSite({ name: '', slug: '' }); loadData(); }
        else { setError(result.error || 'Failed to create'); }
        setCreating(false);
    }

    async function deleteSite(id) {
        if (!confirm('Delete this website? This cannot be undone.')) return;
        await removeWebsiteById(id);
        loadData();
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Websites</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Manage your websites and pages</p>
                </div>
                {user?.role !== 'viewer' && <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowCreate(true)}>+ New Website</button>}
            </div>

            <div className="grid grid-3" style={{ gap: 24 }}>
                {websites.map((site, i) => (
                    <div key={site.id} className="card" style={{ animation: `slideUp 0.4s ease ${i * 0.1}s both`, padding: 24, borderRadius: 'var(--radius-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                                <div style={{ width: 48, height: 48, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{site.settings?.favicon || <Globe size={24} />}</div>
                                <span className="badge mono" style={{ textTransform: 'uppercase' }}>{site.status}</span>
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-high)' }}>{site.name}</h3>
                            <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{site.domain?.subdomain}</p>
                            <div className="mono" style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                <span><FileText size={14}/> {site.pageCount || 0} pages</span>
                                {site.domain?.custom && <span><Globe2 size={14}/> {site.domain.custom}</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary btn-sm mono" style={{ flex: 1, textTransform: 'uppercase' }} onClick={() => navigate(`/dashboard/websites/${site.id}`)}>Manage</button>
                            {user?.role !== 'viewer' && <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={() => navigate(`/dashboard/websites/${site.id}/builder`)}>Builder</button>}
                            {user?.role === 'admin' && <button className="btn btn-ghost btn-sm mono" style={{ color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => deleteSite(site.id)} title="Delete"><Trash2 size={16} /></button>}
                        </div>
                    </div>
                ))}
            </div>

            {websites.length === 0 && (
                <div style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-subtle)' }}>
                    <Globe size={32} style={{ marginBottom: 16 }} />
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>No websites yet</h3>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24, textTransform: 'uppercase' }}>Create your first website to start building</p>
                    <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowCreate(true)}>Create Website</button>
                </div>
            )}

            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowCreate(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 'var(--radius-subtle)', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create New Website</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowCreate(false)}>✕</button>
                        </div>
                        {error && <div className="mono" style={{ background: 'var(--bg-primary)', border: '1px solid var(--error)', padding: 12, marginBottom: 24, color: 'var(--error)', fontSize: 11, textTransform: 'uppercase' }}>{error}</div>}
                        <form onSubmit={handleCreateWebsite}>
                            <div style={{ marginBottom: 24 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website Name</label>
                                <input className="input" value={newSite.name} onChange={e => setNewSite({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="My Awesome Website" required style={{ width: '100%' }} />
                            </div>
                            <div style={{ marginBottom: 32 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL Slug</label>
                                <input className="input" value={newSite.slug} onChange={e => setNewSite({ ...newSite, slug: e.target.value })} placeholder="my-website" style={{ width: '100%', marginBottom: 8 }} />
                                <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{user?.tenant?.slug}-{newSite.slug || 'slug'}.tenantflow.app</span>
                            </div>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <button type="button" className="btn btn-ghost mono" style={{ flex: 1, textTransform: 'uppercase' }} onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary mono" disabled={creating} style={{ flex: 1, textTransform: 'uppercase' }}>{creating ? 'Creating...' : 'Create Website'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
