import { useState, useEffect } from 'react';
import http from '../lib/http'; // use CodeYug http client
import { fetchWebsites } from '../services/api';
import { Rocket, Server, CheckCircle2, CircleDashed, Globe, Box, Boxes } from 'lucide-react';

export default function DeploymentsPage() {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [websites, setWebsites] = useState([]);
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState('');
    const [activeDeployLine, setActiveDeployLine] = useState(null);

    const handleDownload = async (websiteId, websiteName) => {
        try {
            const res = await http.get(`/export/${websiteId}/docker`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${websiteName}-docker-bundle.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error(err);
            alert('Failed to download bundle.');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [depRes, webRes] = await Promise.all([
                http.get('/deploy'),
                fetchWebsites()
            ]);
            setDeployments(depRes.data.data || []);
            setWebsites(webRes.websites || []);
        } catch (err) {
            console.error('Failed to load deployment data:', err);
        }
        setLoading(false);
    }

    async function handleDeploy() {
        if (!selectedWebsite) return;
        try {
            const res = await http.post('/deploy', {
                websiteId: selectedWebsite,
                environment: 'production',
                changelog: 'Auto-deployed from dashboard'
            });
            setShowDeployModal(false);
            startDeploymentStream(res.data.data._id);
            setDeployments(prev => [res.data.data, ...prev]);
        } catch (err) {
            alert(err.response?.data?.error || 'Deploy failed');
        }
    }

    function startDeploymentStream(deployId) {
        setActiveDeployLine({ id: deployId, state: null });
        readStreamWithToken(deployId);
    }

    async function readStreamWithToken(deployId) {
        const token = localStorage.getItem('authToken'); // CodeYug uses authToken
        try {
            const res = await fetch(`/api/deploy/${deployId}/stream`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.type === 'init' || data.type === 'update') {
                            setActiveDeployLine({ id: deployId, state: data.state });
                            setDeployments(prev => prev.map(d =>
                                d._id === deployId ? { ...d, status: data.state.status, url: data.state.url } : d
                            ));
                        } else if (data.type === 'done') {
                            setTimeout(() => {
                                setActiveDeployLine(null);
                                loadData();
                            }, 3000);
                            return;
                        }
                    } catch (e) { }
                }
            }
        } catch (e) {
            console.error('Stream err', e);
        }
    }

    const statusColors = { live: 'badge-success', building: 'badge-warning', deploying: 'badge-info', pending: 'badge-warning', failed: 'badge-danger', rolled_back: 'badge-danger' };

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Deployments</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Manage active deployments and view edge infrastructure logs.</p>
                </div>
                <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowDeployModal(true)}><Rocket size={16} /> Deploy to Render</button>
            </div>

            {/* Active Deployment Pipeline */}
            {activeDeployLine && activeDeployLine.state && (
                <div className="card" style={{ marginBottom: 40, padding: '24px 32px', borderLeft: '4px solid var(--primary)', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-high)', fontFamily: 'var(--font-display)' }}>
                            <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Running Pipeline
                        </h3>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'rgba(79, 70, 229, 0.1)', padding: '4px 12px', borderRadius: 'var(--radius-hard)' }}>{activeDeployLine.state.url}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', top: 20, left: 40, right: 40, height: 2, background: 'var(--border-color)', zIndex: 0 }} />

                        {activeDeployLine.state.steps.map((step, idx) => {
                            const isDone = step.status === 'done';
                            const isRunning = step.status === 'running';
                            const isPending = step.status === 'pending';

                            return (
                                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: 140 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isDone ? 'var(--primary)' : isRunning ? 'var(--bg-surface)' : 'var(--bg-primary)',
                                        border: `2px solid ${isDone ? 'var(--primary)' : isRunning ? 'var(--primary)' : 'var(--border-color)'}`,
                                        color: isDone ? 'white' : 'var(--text-primary)',
                                        boxShadow: isRunning ? '0 0 0 4px rgba(79, 70, 229, 0.15)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {isDone ? <CheckCircle2 size={16} /> : isRunning ? <CircleDashed size={16} className="spinner" style={{ animationDuration: '2s' }} /> :
                                            step.id === 'extract' ? <Boxes size={16} /> :
                                                step.id === 'build' ? <Box size={16} /> :
                                                    step.id === 'push' ? <Rocket size={16} /> :
                                                        step.id === 'map' ? <Globe size={16} /> : (idx + 1)
                                        }
                                    </div>
                                    <div className="mono" style={{ marginTop: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: isPending ? 'var(--text-muted)' : 'var(--text-high)', textAlign: 'center' }}>
                                        {step.name}
                                    </div>
                                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                        {step.time ? `${step.time}s` : '—'}
                                    </div>
                                    {(step.id === 'build' || step.id === 'map' || step.id === 'push') && step.logs?.length > 0 && (
                                        <div className="mono" style={{ marginTop: 12, fontSize: 10, color: 'var(--success)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            {step.logs.map((log, i) => <div key={i} style={{ display: 'flex', gap: 6 }}><Server size={12} /> {log}</div>)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deployment History</h2>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div> :
                deployments.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: 24 }}>
                            <Globe size={32} />
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8, fontWeight: 700 }}>No deployments yet</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Push your Docker bundle to a live Public IP.</p>
                        <button className="btn btn-primary" onClick={() => setShowDeployModal(true)}><Rocket size={16} /> Deploy to Render</button>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, borderRadius: 'var(--radius-subtle)', overflow: 'hidden', marginBottom: 40 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Project</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Version</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Environment</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Status</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Build Time</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Deployed</th>
                                    <th className="mono" style={{ padding: '16px 24px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deployments.map((d, i) => (
                                    <tr key={d._id} style={{ borderBottom: i === deployments.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                        <td className="mono" style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text-high)', fontWeight: 600 }}>{d.website?.name || '—'}</td>
                                        <td className="mono" style={{ padding: '16px 24px' }}><span className="badge mono" style={{ textTransform: 'uppercase' }}>v{d.version}</span></td>
                                        <td className="mono" style={{ padding: '16px 24px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d.environment?.toUpperCase()}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span className={`badge mono ${statusColors[d.status] || 'badge-warning'}`} style={{ display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content', textTransform: 'uppercase' }}>
                                                {activeDeployLine?.id === d._id && d.status !== 'live' && <CircleDashed size={12} className="spinner" />}
                                                {d.status?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="mono" style={{ padding: '16px 24px', fontSize: 12, color: 'var(--text-high)' }}>{d.buildTime ? `${d.buildTime}s` : '—'}</td>
                                        <td className="mono" style={{ padding: '16px 24px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleString()}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            {d.url && (d.status === 'live' || d.status === 'rolled_back') ? (
                                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <a href={`https://spit-hack.app.n8n.cloud/webhook/tenantflow-hosting/site/${d.website?.slug || d.website?.name}`} target="_blank" rel="noopener" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }} title="Live Preview">
                                                        View Live ↗
                                                    </a>
                                                    <button onClick={() => handleDownload(d.website._id, d.website.slug || d.website.name)} className="btn btn-ghost" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', padding: 0, height: 'auto', background: 'transparent' }} title="Download Docker Bundle">
                                                        Download 📦
                                                    </button>
                                                </div>
                                            ) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }

            {showDeployModal && (
                <div className="modal-overlay" onClick={() => setShowDeployModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, background: 'var(--bg-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-high)' }}>Deploy Pipeline</h3>
                            <button className="btn btn-ghost" onClick={() => setShowDeployModal(false)} style={{ padding: '0 8px' }}>✕</button>
                        </div>

                        <div style={{ marginBottom: 24, background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14 }}><Server size={16} /> Live Web Service (Docker)</strong>
                            <ul style={{ margin: 0, paddingLeft: 24, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: 13 }}>
                                <li>Docker Auto-Build logic</li>
                                <li>Automatic Port Exposure (8080)</li>
                                <li>IP Binding mapped to Render Instance</li>
                                <li>Public ephemeral URL routing</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label className="mono" style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-high)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Project</label>
                            <select className="input" value={selectedWebsite} onChange={e => setSelectedWebsite(e.target.value)}>
                                <option value="" disabled>Select Project to Deploy</option>
                                {websites.map(w => (
                                    <option key={w.id || w._id} value={w.id || w._id}>{w.name} (v{w.pageCount ? 1 : 0})</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button className="btn btn-ghost mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowDeployModal(false)}>Cancel</button>
                            <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={handleDeploy} disabled={!selectedWebsite}>Execute Deploy →</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
