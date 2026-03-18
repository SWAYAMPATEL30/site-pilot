import { useState, useEffect } from 'react';
import { fetchCurrentUser, fetchBilling, changePlan } from '../services/api';
import { formatINR } from '../lib/currency';

const ALL_PLANS = [
    { id: 'free', name: 'Free', price: 0, features: ['1 Website', '3 Pages/site', '100MB Storage', '5 AI Gen/mo', 'Platform Subdomain'] },
    { id: 'starter', name: 'Starter', price: 9, features: ['3 Websites', '10 Pages/site', '1GB Storage', '50 AI Gen/mo', '1 Custom Domain', 'Analytics', '3 Team Members'] },
    { id: 'professional', name: 'Professional', price: 29, features: ['10 Websites', '50 Pages/site', '10GB Storage', '500 AI Gen/mo', '5 Custom Domains', 'Analytics', '10 Team Members', 'Version History', 'Collaboration'] },
    { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Unlimited Websites', 'Unlimited Pages', '100GB Storage', 'Unlimited AI', 'Unlimited Domains', 'Full Analytics', 'Unlimited Team', 'Priority Support'] },
];

export default function BillingPage() {
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        async function init() {
            const u = await fetchCurrentUser();
            const b = fetchBilling();
            setUser(u.user);
            setSubscription(b.subscription);
            setLoading(false);
        }
        init();
    }, []);

    function handlePlanChange(planId) {
        setSelectedPlan(planId);
        setShowPayment(true);
    }

    function confirmPlanChange() {
        setProcessing(true);
        const currentPlan = ALL_PLANS.find(p => p.id === user?.tenant?.plan);
        const newPlan = ALL_PLANS.find(p => p.id === selectedPlan);
        const action = newPlan.price > (currentPlan?.price || 0) ? 'upgrade' : 'downgrade';

        changePlan({ action, planId: selectedPlan, paymentMethod: 'Visa •••• 4242' });

        const u = fetchCurrentUser();
        const b = fetchBilling();
        setUser(u.user);
        setSubscription(b.subscription);
        setShowPayment(false);
        setShowUpgrade(false);
        setProcessing(false);
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    const currentPlan = ALL_PLANS.find(p => p.id === user?.tenant?.plan) || ALL_PLANS[0];

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Billing & Subscription</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Manage your subscription plan and billing</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 40, padding: 32, borderRadius: 'var(--radius-subtle)', border: '1px solid var(--text-high)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Current Plan</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{currentPlan.name}</span>
                            <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{formatINR(currentPlan.price)}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></span>
                        </div>
                        {subscription && <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status: <span style={{ color: 'var(--text-high)', fontWeight: 700 }}>Active</span> · Renews: {subscription.renewalDate}</div>}
                    </div>
                    <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setShowUpgrade(true)}>Change Plan</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--border-color)' }}>
                    {currentPlan.features.map((f, i) => <span key={i} className="badge mono" style={{ fontSize: 10, textTransform: 'uppercase', background: 'var(--bg-surface)' }}>{f}</span>)}
                </div>
            </div>

            <div className="grid grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 40 }}>
                <div className="card" style={{ padding: 0, borderRadius: 'var(--radius-subtle)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment History</h2>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Date</th>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Amount</th>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Method</th>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Status</th>
                                <th className="mono" style={{ padding: '12px 32px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(subscription?.payments || []).map((p, i) => (
                                <tr key={i} style={{ borderBottom: i === (subscription?.payments || []).length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                    <td className="mono" style={{ padding: '16px 32px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.date}</td>
                                    <td className="mono" style={{ padding: '16px 32px', fontWeight: 700, fontSize: 13, color: 'var(--text-high)' }}>{formatINR(p.amount)}</td>
                                    <td className="mono" style={{ padding: '16px 32px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.method}</td>
                                    <td style={{ padding: '16px 32px' }}><span className="badge mono" style={{ textTransform: 'uppercase' }}>{p.status}</span></td>
                                    <td style={{ padding: '16px 32px', textAlign: 'right' }}><button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase' }}>PDF</button></td>
                                </tr>
                            ))}
                            {(!subscription?.payments || subscription.payments.length === 0) && (
                                <tr><td colSpan={5} className="mono" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, textTransform: 'uppercase' }}>No payment history</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)' }}>
                            <div className="mono" style={{ width: 48, height: 32, background: 'var(--text-high)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>VISA</div>
                            <div>
                                <div className="mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-high)', marginBottom: 4 }}>•••• •••• •••• 4242</div>
                                <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expires 12/2027</div>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-sm mono" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Payment Method</button>
                    </div>

                    <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-subtle)' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billing Address</h2>
                        <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, textTransform: 'uppercase', padding: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', marginBottom: 24 }}>
                            <span style={{ color: 'var(--text-high)', fontWeight: 700 }}>{user?.tenant?.name}</span><br />
                            123 Business Street<br />
                            New York, NY 10001<br />
                            United States
                        </div>
                        <button className="btn btn-ghost btn-sm mono" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edit Address</button>
                    </div>
                </div>
            </div>

            {showUpgrade && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowUpgrade(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: 1000, padding: 40, borderRadius: 'var(--radius-subtle)', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <h3 style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Change Plan</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }} onClick={() => setShowUpgrade(false)}>✕</button>
                        </div>
                        <div className="grid grid-4" style={{ gap: 16 }}>
                            {ALL_PLANS.map(p => (
                                <div key={p.id} style={{ background: 'var(--bg-primary)', border: p.id === currentPlan.id ? '2px solid var(--text-high)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 24, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    {p.id === currentPlan.id && <div className="mono" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--text-high)', color: 'var(--bg-primary)', padding: '2px 12px', borderRadius: 'var(--radius-hard)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT</div>}
                                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{p.name}</div>
                                    <div className="mono" style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{formatINR(p.price)}<span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                                        {p.features.slice(0, 5).map((f, i) => <div key={i} className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>✓ {f}</div>)}
                                    </div>
                                    <button className={`btn ${p.id === currentPlan.id ? 'btn-ghost' : 'btn-primary'} btn-sm mono`} style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => handlePlanChange(p.id)} disabled={p.id === currentPlan.id}>
                                        {p.id === currentPlan.id ? 'Current' : p.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showPayment && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowPayment(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 'var(--radius-subtle)', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Plan Change</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowPayment(false)}>✕</button>
                        </div>
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 16, marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>New Plan</span>
                                <span className="mono" style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-high)', textTransform: 'uppercase' }}>{ALL_PLANS.find(p => p.id === selectedPlan)?.name}</span>
                            </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>Monthly Cost</span>
                                <span className="mono" style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-high)', textTransform: 'uppercase' }}>{formatINR(ALL_PLANS.find(p => p.id === selectedPlan)?.price)}/mo</span>
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Number</label>
                            <input className="input mono" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                            <div><label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expiry</label><input className="input mono" placeholder="12/27" defaultValue="12/27" style={{ width: '100%' }} /></div>
                            <div><label className="mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CVC</label><input className="input mono" placeholder="123" defaultValue="123" style={{ width: '100%' }} /></div>
                        </div>
                        <button className="btn btn-primary mono" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={confirmPlanChange} disabled={processing}>
                            {processing ? 'Processing...' : `Confirm & Pay ${formatINR(ALL_PLANS.find(p => p.id === selectedPlan)?.price)}/mo`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
