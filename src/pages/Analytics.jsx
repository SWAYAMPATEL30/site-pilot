import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, fetchWebsites } from '../services/api';
import { BarChart, Eye, User, RotateCcw, Clock, Bot, Smartphone, Image, FileText } from 'lucide-react';

export default function AnalyticsPage() {
    const [user, setUser] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSite, setSelectedSite] = useState('');

    useEffect(() => {
        async function init() {
            const u = await fetchCurrentUser();
            const w = fetchWebsites();
            setUser(u.user);
            setWebsites(w.websites || []);
            setSelectedSite(w.websites?.[0]?.id || '');
            setLoading(false);
        }
        init();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    const planHasAnalytics = !['free'].includes(user?.tenant?.plan);

    if (!planHasAnalytics) return (
        <div className="animate-fade">
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 24 }}>Analytics</h1>
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                <BarChart size={48} style={{ marginBottom: 16 }} />
                <h2 style={{ marginBottom: 8 }}>Analytics Not Available</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Upgrade to Starter or higher to access website analytics</p>
                <Link to="/dashboard/billing" className="btn btn-primary">Upgrade Plan</Link>
            </div>
        </div>
    );

    const analyticsData = {
        'site-1': { views: 45230, visitors: 12840, bounce: 32.5, session: 245, dailyViews: [820, 950, 1100, 980, 1250, 1400, 1320, 1100, 890, 1050, 1200, 1380, 1500, 1420], topPages: [{ p: '/', v: 18920 }, { p: '/menu', v: 15340 }, { p: '/contact', v: 10970 }], referrers: [{ s: 'Google', v: 6420 }, { s: 'Direct', v: 3120 }, { s: 'Instagram', v: 2100 }, { s: 'Yelp', v: 1200 }], perf: { lcp: 1.8, fid: 45, cls: 0.05, ttfb: 320 } },
        'site-3': { views: 22150, visitors: 8930, bounce: 28.1, session: 380, dailyViews: [420, 380, 510, 440, 620, 580, 490, 530, 610, 670, 720, 680, 590, 640], topPages: [{ p: '/', v: 12200 }, { p: '/courses', v: 9950 }], referrers: [{ s: 'Google', v: 4200 }, { s: 'LinkedIn', v: 2100 }, { s: 'Direct', v: 1630 }], perf: { lcp: 2.1, fid: 52, cls: 0.08, ttfb: 280 } },
        'site-4': { views: 67800, visitors: 24500, bounce: 25.3, session: 312, dailyViews: [1200, 1350, 1500, 1420, 1680, 1800, 1720, 1580, 1450, 1620, 1780, 1900, 1850, 1700], topPages: [{ p: '/', v: 28400 }, { p: '/portfolio', v: 22100 }, { p: '/team', v: 17300 }], referrers: [{ s: 'Google', v: 12200 }, { s: 'Dribbble', v: 5300 }, { s: 'Behance', v: 3800 }], perf: { lcp: 1.5, fid: 38, cls: 0.03, ttfb: 250 } },
    };

    const data = analyticsData[selectedSite] || { views: Math.floor(Math.random() * 5000) + 500, visitors: Math.floor(Math.random() * 2000) + 100, bounce: (Math.random() * 40 + 15).toFixed(1), session: Math.floor(Math.random() * 300) + 60, dailyViews: Array.from({ length: 14 }, () => Math.floor(Math.random() * 200) + 50), topPages: [{ p: '/', v: Math.floor(Math.random() * 500) + 100 }], referrers: [{ s: 'Direct', v: Math.floor(Math.random() * 200) + 50 }], perf: { lcp: 2.0, fid: 50, cls: 0.05, ttfb: 300 } };

    const maxDailyView = Math.max(...(data.dailyViews || [1]));

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Analytics</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Monitor traffic and performance</p>
                </div>
                <select className="input mono" value={selectedSite} onChange={e => setSelectedSite(e.target.value)} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {websites.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>

            <div className="grid grid-4" style={{ marginBottom: 40, gap: 24 }}>
                {[
                    { icon: <Eye size={20} />, label: 'Page Views', value: data.views.toLocaleString(), change: '+12.5%', positive: true },
                    { icon: <User size={20} />, label: 'Unique Visitors', value: data.visitors.toLocaleString(), change: '+8.3%', positive: true },
                    { icon: <RotateCcw size={20} />, label: 'Bounce Rate', value: data.bounce + '%', change: '-2.1%', positive: true },
                    { icon: <Clock size={20} />, label: 'Avg Session', value: Math.floor(data.session / 60) + 'm ' + (data.session % 60) + 's', change: '+15s', positive: true },
                ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: 24, borderRadius: 'var(--radius-subtle)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                            <div className="mono" style={{ fontSize: 11, color: s.positive ? 'var(--text-high)' : 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{s.change}</div>
                        </div>
                        <div>
                            <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-high)', marginBottom: 4, letterSpacing: '-0.02em' }}>{s.value}</div>
                            <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-2" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: 40, gap: 24 }}>
                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Traffic (Last 14 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
                        {(data.dailyViews || []).map((v, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: '100%', height: `${(v / maxDailyView) * 180}px`, background: 'var(--text-high)', borderRadius: 'var(--radius-hard)', transition: 'height 0.5s ease', minHeight: 4 }} />
                                <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Referrers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {(data.referrers || []).map((r, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span className="mono" style={{ fontSize: 12, color: 'var(--text-high)', textTransform: 'uppercase' }}>{r.s}</span>
                                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-high)' }}>{r.v.toLocaleString()}</span>
                                </div>
                                <div style={{ height: 4, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(r.v / (data.referrers[0]?.v || 1)) * 100}%`, background: 'var(--text-high)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-2" style={{ gap: 24, marginBottom: 40 }}>
                <div className="card" style={{ padding: 0, borderRadius: 'var(--radius-subtle)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Pages</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Page</th>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.topPages || []).map((p, i) => (
                                <tr key={i} style={{ borderBottom: i === (data.topPages || []).length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                    <td className="mono" style={{ padding: '16px 32px', fontSize: 13, color: 'var(--text-high)' }}>{p.p}</td>
                                    <td className="mono" style={{ padding: '16px 32px', textAlign: 'right', fontWeight: 700, fontSize: 13, color: 'var(--text-high)' }}>{p.v.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Web Vitals</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'LCP (Largest Contentful Paint)', value: data.perf.lcp + 's', good: data.perf.lcp < 2.5, target: '< 2.5s' },
                            { label: 'FID (First Input Delay)', value: data.perf.fid + 'ms', good: data.perf.fid < 100, target: '< 100ms' },
                            { label: 'CLS (Cumulative Layout Shift)', value: data.perf.cls, good: data.perf.cls < 0.1, target: '< 0.1' },
                            { label: 'TTFB (Time to First Byte)', value: data.perf.ttfb + 'ms', good: data.perf.ttfb < 500, target: '< 500ms' },
                        ].map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                                <div>
                                    <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-high)', marginBottom: 4, textTransform: 'uppercase' }}>{m.label}</div>
                                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target: {m.target}</div>
                                </div>
                                <span className="badge mono" style={{ textTransform: 'uppercase', border: m.good ? '1px solid var(--text-high)' : '1px solid var(--error)', color: m.good ? 'var(--text-high)' : 'var(--error)', background: 'transparent' }}>{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)', border: '1px solid var(--text-high)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <Bot size={40} style={{ background: 'var(--text-high)', color: 'var(--bg-primary)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Optimization Suggestions</h3>
                </div>
                <div className="grid grid-3" style={{ gap: 24 }}>
                    {[
                        { icon: <Smartphone size={24} />, title: 'Mobile Optimization', desc: 'Consider adding a mobile-specific hero section to reduce bounce rate on mobile devices.' },
                        { icon: <Image size={24} />, title: 'Image Optimization', desc: 'Compress gallery images to improve LCP score by an estimated 300ms.' },
                        { icon: <FileText size={24} />, title: 'Content Update', desc: "Your FAQ page hasn't been updated in 30 days. Fresh content improves SEO rankings." },
                    ].map((s, i) => (
                        <div key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 24 }}>
                            <div style={{ fontSize: 24, marginBottom: 16 }}>{s.icon}</div>
                            <div className="mono" style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-high)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
