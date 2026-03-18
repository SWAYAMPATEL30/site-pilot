import { useState, useEffect } from 'react';
import { User, Clock, Code, ArrowLeft, Eye } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWebsite, fetchVersions, rollbackVersion } from '../services/api';

export default function VersionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [website, setWebsite] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoringId, setRestoringId] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null); // version being previewed

    useEffect(() => {
        async function load() {
            const [{ website: w }, { versions: v }] = await Promise.all([
                fetchWebsite(id),
                fetchVersions(id),
            ]);
            setWebsite(w);
            setVersions(v || []);
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleRestore(versionId) {
        setRestoringId(versionId);
        const result = await rollbackVersion(id, versionId);
        setRestoringId(null);
        if (result.ok) {
            // Refresh versions list
            const { versions: v } = await fetchVersions(id);
            setVersions(v || []);
        } else {
            alert('Restore failed: ' + result.error);
        }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;
    if (!website) return <div className="empty-state"><h3>Project not found</h3></div>;

    // Identify the active version
    const activeVersionId = website.activeVersionId;

    return (
        <div className="animate-slide-up">
            {previewHtml && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                        <span className="mono" style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Version Preview</span>
                        <button className="btn btn-ghost btn-sm mono" onClick={() => setPreviewHtml(null)} style={{ textTransform: 'uppercase' }}>Close</button>
                    </div>
                    <iframe srcDoc={previewHtml} style={{ flex: 1, border: 'none', background: 'white' }} title="Version Preview" sandbox="allow-scripts" />
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <button className="btn btn-ghost mono" style={{ textTransform: 'uppercase', display:'flex', alignItems:'center', gap:4 }} onClick={() => navigate(`/dashboard/websites/${id}`)}><ArrowLeft size={14}/> Back</button>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 8 }}>Version History</h1>
                        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>{website.name} · {versions.length} version{versions.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {versions.length === 0 ? (
                <div style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-subtle)' }}>
                    <Code size={32} style={{ marginBottom: 16, opacity: 0.4 }} />
                    <p className="mono" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 12 }}>No versions yet — generate your first website in the Builder.</p>
                </div>
            ) : (
                <div style={{ position: 'relative', paddingLeft: 40 }}>
                    <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 1, background: 'var(--border-color)' }} />
                    {versions.map((v, i) => {
                        const isActive = String(v._id) === String(activeVersionId);
                        const date = new Date(v.createdAt).toLocaleString();
                        return (
                            <div key={v._id} className="card" style={{ marginBottom: 24, position: 'relative', animation: `slideUp 0.4s ease ${i * 0.1}s both`, padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                                <div style={{ position: 'absolute', left: -25, top: 36, width: 11, height: 11, borderRadius: 'var(--radius-hard)', background: isActive ? 'var(--text-high)' : 'var(--bg-primary)', border: '1px solid var(--text-high)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                            <span className="badge mono" style={{ textTransform: 'uppercase' }}>v{v.versionNumber}</span>
                                            {isActive && <span className="badge mono" style={{ background: 'var(--text-high)', color: 'var(--bg-primary)', textTransform: 'uppercase' }}>Active</span>}
                                        </div>
                                        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-high)', fontStyle: 'italic' }}>
                                            "{v.userPrompt?.slice(0, 100)}{v.userPrompt?.length > 100 ? '...' : ''}"
                                        </p>
                                        <div className="mono" style={{ display: 'flex', gap: 24, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', flexWrap: 'wrap' }}>
                                            <span style={{display:'flex',alignItems:'center',gap:4}}><User size={12}/> {v.brandingSnapshot?.companyName || 'Unknown'}</span>
                                            <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={12}/> {date}</span>
                                            <span style={{display:'flex',alignItems:'center',gap:4}}><Code size={12}/> {v.htmlCode?.split('\n').length || 0} lines</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                                        <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setPreviewHtml(v.htmlCode)}>
                                            <Eye size={12} /> Preview
                                        </button>
                                        {!isActive && (
                                            <button className="btn btn-primary btn-sm mono" onClick={() => handleRestore(v._id)} disabled={restoringId === v._id} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {restoringId === v._id ? 'Restoring...' : 'Restore'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
