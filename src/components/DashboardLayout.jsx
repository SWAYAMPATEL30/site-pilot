import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { fetchCurrentUser, logoutUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LEVEL, ROLE_COLOR } from '../lib/constants';
import { BarChart, Globe, Globe2, Rocket, Users, TrendingUp, CreditCard, ArrowRightCircle, ArrowLeftCircle, Lock, Zap, Menu, X } from 'lucide-react';

// minRole: minimum role needed to see this nav item
const NAV_ITEMS = [
    { icon: <BarChart size={16} />, label: 'Dashboard',   href: '/dashboard',              minRole: 'viewer' },
    { icon: <Globe size={16} />,   label: 'Websites',    href: '/dashboard/websites',     minRole: 'viewer' },
    { icon: <Zap size={16} />,     label: 'Branding',    href: '/dashboard/branding',     minRole: 'editor' },
    { icon: <Globe2 size={16} />,  label: 'Domains',     href: '/dashboard/domains',      minRole: 'admin'  },
    { icon: <Rocket size={16} />,  label: 'Deployments', href: '/dashboard/deployments',  minRole: 'admin'  },
    { icon: <Users size={16} />,   label: 'Team',        href: '/dashboard/team',         minRole: 'admin'  },
    { icon: <TrendingUp size={16} />, label: 'Analytics',href: '/dashboard/analytics',    minRole: 'viewer' },
    { icon: <CreditCard size={16} />, label: 'Billing',  href: '/dashboard/billing',      minRole: 'admin'  },
];

function canSeeItem(userRole, minRole) {
    return (ROLE_LEVEL[userRole] || 0) >= (ROLE_LEVEL[minRole] || 1);
}

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: authUser, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const profileRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest('button[aria-label="Toggle sidebar"]')) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleResize() {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchCurrentUser().then(d => {
            if (!d.user) { navigate('/login'); return; }
            setUser(d.user);
            setLoading(false);
        }).catch(() => navigate('/login'));
    }, [navigate]);

    async function handleLogout() {
        await logoutUser();
        logout();
        navigate('/login');
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    if (!user) return null;

    const planColors = { free: '#6b6b80', starter: '#3498db', professional: '#8b5cf6', enterprise: '#f59e0b' };
    const sidebarWidth = isMobile ? '100vw' : (sidebarCollapsed ? 70 : 260);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Mobile Header */}
            {isMobile && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 50 }}>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        aria-label="Toggle sidebar"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-high)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <Zap size={20} />
                        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.05em', textTransform: 'uppercase' }}>Site Pilot</span>
                    </div>
                    <button 
                        onClick={() => setProfileOpen(!profileOpen)} 
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-hard)', background: 'var(--text-high)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    </button>
                </div>
            )}

            {/* Sidebar Overlay (Mobile) */}
            {isMobile && sidebarOpen && (
                <div 
                    style={{ position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 40 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                ref={sidebarRef}
                style={{ 
                    width: sidebarWidth, 
                    background: 'var(--bg-surface)', 
                    borderRight: '1px solid var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    transition: 'width 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    flexShrink: 0, 
                    position: isMobile ? 'fixed' : 'sticky', 
                    top: isMobile ? 60 : 0, 
                    height: isMobile ? 'calc(100vh - 60px)' : '100vh', 
                    overflow: 'hidden',
                    transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
                    zIndex: 41
                }}>
                {!isMobile && (
                    <div style={{ padding: sidebarCollapsed ? '20px 14px' : '20px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <Zap size={22} />
                        {!sidebarCollapsed && <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.05em', textTransform: 'uppercase' }}>Site Pilot</span>}
                    </div>
                )}

                {!sidebarCollapsed && !isMobile && (
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, letterSpacing: '-0.02em' }}>{user?.tenant?.name || 'Tenant'}</div>
                        <span className="badge mono" style={{ background: 'var(--bg-primary)', color: 'var(--text-high)' }}>
                            {user?.tenant?.plan?.toUpperCase()}
                        </span>
                    </div>
                )}

                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'y', overflowY: 'auto' }}>
                    {NAV_ITEMS.filter(item => canSeeItem(user?.role, item.minRole)).map(item => {
                        const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                        return (
                            <Link 
                                key={item.href} 
                                to={item.href} 
                                onClick={() => isMobile && setSidebarOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: sidebarCollapsed ? '10px 14px' : '10px 14px', borderRadius: 'var(--radius-hard)', fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-high)' : 'var(--text-muted)', background: isActive ? 'var(--bg-primary)' : 'transparent', border: isActive ? '1px solid var(--border-color)' : '1px solid transparent', textDecoration: 'none', transition: 'all 0.15s', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-primary)'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                {!sidebarCollapsed && !isMobile && item.label}
                                {!sidebarCollapsed && isMobile && item.label}
                            </Link>
                        );
                    })}
                </nav>

                {!isMobile && (
                    <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px' }}>
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="btn btn-ghost btn-sm mono" style={{ width: '100%', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', fontSize: 11, textTransform: 'uppercase' }}>
                            {sidebarCollapsed ? <ArrowRightCircle size={14}/> : <><ArrowLeftCircle size={14}/> Collapse</>}
                        </button>
                    </div>
                )}

                <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }} ref={profileRef}>
                    {!isMobile && (
                        <button onClick={() => setProfileOpen(!profileOpen)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', width: '100%', padding: 0 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-hard)', background: 'var(--text-high)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            {!sidebarCollapsed && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', letterSpacing: '-0.02em' }}>{user?.name}</div>
                                    <div className="mono" style={{ fontSize: 10, color: ROLE_COLOR[user?.role] || 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.05em' }}>{user?.role}</div>
                                </div>
                            )}
                        </button>
                    )}

                    {!isMobile && profileOpen && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', zIndex: 1000 }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.name}</div>
                                <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
                            </div>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                                <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Organization</div>
                                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.tenant?.name}</div>
                                <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Plan: {user?.tenant?.plan?.toUpperCase()}</div>
                            </div>
                            <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'transparent', color: '#ef4444', textAlign: 'left', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }} onMouseEnter={e => e.target.style.background = 'var(--bg-primary)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Profile Modal */}
            {isMobile && profileOpen && (
                <div style={{ position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={() => setProfileOpen(false)}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 0, width: '100%', maxWidth: 300, marginTop: 0, maxHeight: '100%', overflow: 'y', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.name}</div>
                            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{user?.email}</div>
                        </div>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                            <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Organization</div>
                            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.tenant?.name}</div>
                            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Plan: {user?.tenant?.plan?.toUpperCase()}</div>
                        </div>
                        <button onClick={handleLogout} style={{ width: '100%', padding: '16px', border: 'none', background: 'transparent', color: '#ef4444', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Logout
                        </button>
                    </div>
                </div>
            )}

            <main style={{ flex: 1, padding: isMobile ? '76px 16px 16px' : '32px 40px', minWidth: 0, background: 'var(--bg-primary)', marginTop: isMobile ? 0 : 0 }}>
                <Outlet />
            </main>
        </div>
    );
}
