import { useState, useEffect } from 'react';
import { fetchCurrentUser, fetchTeam, inviteUser } from '../services/api';
import { UserPlus, X, Shield, Eye, Pencil, Crown, Lock } from 'lucide-react';
import { ROLE_META, PERMISSIONS } from '../lib/constants';

// Convert ROLE_META to array for easier iteration
const ROLES = Object.values(ROLE_META);

function RoleBadge({ role }) {
    const meta = ROLE_META[role] || { label: role, color: '#6b7280' };
    return (
        <span className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
            color: meta.color, border: `1px solid ${meta.color}55`,
            background: `${meta.color}10`, padding: '3px 8px',
            borderRadius: 'var(--radius-hard)', textTransform: 'uppercase',
        }}>
            {meta.label}
        </span>
    );
}

export default function TeamPage() {
    const [user, setUser]               = useState(null);
    const [members, setMembers]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showCreate, setShowCreate]   = useState(false);
    const [showPerms, setShowPerms]     = useState(false);
    const [saving, setSaving]           = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [form, setForm]               = useState({ name: '', email: '', password: '', role: 'editor' });

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const { user: u } = await fetchCurrentUser();
        setUser(u);
        if (u?.role === 'admin') {
            const { users } = await fetchTeam();
            setMembers(users || []);
        }
        setLoading(false);
    }

    async function handleCreateUser(e) {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setCreateError('Name, email and password are required.');
            return;
        }
        setSaving(true); setCreateError(''); setCreateSuccess('');
        const result = await inviteUser(form);
        if (result.ok) {
            setCreateSuccess(`✓ Account created for ${form.email} (${form.role})`);
            setForm({ name: '', email: '', password: '', role: 'editor' });
            loadData();
            setTimeout(() => { setShowCreate(false); setCreateSuccess(''); }, 2000);
        } else {
            setCreateError(result.error || 'Failed to create user.');
        }
        setSaving(false);
    }

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
    );

    const isAdmin = user?.role === 'admin';

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Team</h1>
                    <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase' }}>Manage team members and access levels</p>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowPerms(true)}>
                        <Shield size={14} /> Permissions
                    </button>
                    {isAdmin && (
                        <button className="btn btn-primary mono" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowCreate(true)}>
                            <UserPlus size={15} /> Add Member
                        </button>
                    )}
                </div>
            </div>

            {/* Your role card */}
            <div className="card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-surface)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name} <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>(you)</span></div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user?.email}</div>
                </div>
                <RoleBadge role={user?.role} />
            </div>

            {/* Members table – admin only */}
            {isAdmin && (
                <div className="card" style={{ padding: 0, borderRadius: 'var(--radius-subtle)', overflow: 'hidden', marginBottom: 40 }}>
                    {members.length === 0 ? (
                        <div style={{ padding: 48, textAlign: 'center' }}>
                            <UserPlus size={32} style={{ marginBottom: 16, opacity: 0.4 }} />
                            <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>No team members yet. Add editors or viewers.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                                    {['Member', 'Role', 'Joined'].map(h => (
                                        <th key={h} className="mono" style={{ padding: '14px 20px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m, i) => (
                                    <tr key={m.id || m._id} style={{ borderBottom: i === members.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-hard)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                                                    {m.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
                                                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}><RoleBadge role={m.role} /></td>
                                        <td className="mono" style={{ padding: '14px 20px', fontSize: 11, color: 'var(--text-muted)' }}>
                                            {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {!isAdmin && (
                <div style={{ padding: 48, textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-subtle)' }}>
                    <Lock size={32} style={{ marginBottom: 16, opacity: 0.4 }} />
                    <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Team management is only available to admins.</p>
                </div>
            )}

            {/* ── Create User Modal ──────────────────────────────────────────────── */}
            {showCreate && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(4px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 100, 
                    padding: 20 
                }} onClick={() => setShowCreate(false)}>
                    <div className="card" style={{ 
                        width: '100%', 
                        maxWidth: 460, 
                        margin: 'auto',
                        padding: 32, 
                        borderRadius: 'var(--radius-subtle)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Team Member</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowCreate(false)}><X size={20} /></button>
                        </div>

                        {createError && <div style={{ border: '1px solid #ef4444', padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 12, borderRadius: 'var(--radius-hard)' }}>{createError}</div>}
                        {createSuccess && <div style={{ border: '1px solid #10b981', padding: '10px 14px', marginBottom: 16, color: '#10b981', fontSize: 12, borderRadius: 'var(--radius-hard)' }}>{createSuccess}</div>}

                        <form onSubmit={handleCreateUser}>
                            <div style={{ marginBottom: 16 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" style={{ width: '100%' }} required />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                                <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" style={{ width: '100%' }} required />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial Password</label>
                                <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" style={{ width: '100%' }} required minLength={6} />
                                <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>Share this with the user — they log in at <strong>/login/iam</strong></p>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {ROLES.filter(r => r.id !== 'admin').map(r => (
                                        <div key={r.id} onClick={() => setForm({ ...form, role: r.id })} style={{
                                            flex: '1 1 120px', padding: '12px 14px', cursor: 'pointer',
                                            border: `1px solid ${form.role === r.id ? r.color : 'var(--border-color)'}`,
                                            borderRadius: 'var(--radius-hard)',
                                            background: form.role === r.id ? `${r.color}12` : 'var(--bg-primary)',
                                            transition: 'all 0.15s',
                                        }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: r.color, textTransform: 'uppercase', marginBottom: 4 }}>{r.label}</div>
                                            <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{r.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button type="button" className="btn btn-ghost mono" style={{ flex: 1, textTransform: 'uppercase', fontSize: 11 }} onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary mono" disabled={saving} style={{ flex: 1, textTransform: 'uppercase', fontSize: 11 }}>
                                    {saving ? <span className="spinner" /> : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Permissions Matrix Modal ───────────────────────────────────────── */}
            {showPerms && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }} onClick={() => setShowPerms(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: 580, padding: 32, borderRadius: 'var(--radius-subtle)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permission Matrix</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowPerms(false)}><X size={20} /></button>
                        </div>
                        {ROLES.map(role => (
                            <div key={role.id} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <RoleBadge role={role.id} />
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role.desc}</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {PERMISSIONS[role.id].map(p => (
                                        <span key={p} className="mono" style={{ fontSize: 10, padding: '3px 8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', color: 'var(--text-high)', textTransform: 'uppercase' }}>{p}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}