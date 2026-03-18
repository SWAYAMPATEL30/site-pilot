import { useState } from 'react';
import { Layers, Sliders, Check, ArrowRight, ChevronRight } from 'lucide-react';
import { PREBUILT_TEMPLATES, COMPONENT_LIBRARY, compilePayload } from '../lib/template-builder';

// ─── Mini Wireframe: Template Preview ─────────────────────────────────────────
function TemplateWireframe({ id }) {
  const cfg = {
    professional: {
      bg: '#FFFFFF', heroBg: '#F9FAFB',
      navBg: '#FFFFFF', navBorder: '#E5E7EB',
      accent: '#0066FF', text: '#111111', muted: '#9CA3AF',
      cardBg: '#FFFFFF', cardBorder: '#E5E7EB', cardRadius: 0,
      cardShadow: 'none', footerBg: '#F3F4F6',
      btnStyle: { background: '#0066FF', borderRadius: 0, border: 'none' },
      heavyBorder: false, orbs: false,
    },
    casual: {
      bg: '#0D0D1A', heroBg: 'transparent',
      navBg: 'rgba(255,255,255,0.03)', navBorder: 'rgba(255,255,255,0.08)',
      accent: '#8B5CF6', accent2: '#06B6D4', text: '#FFFFFF', muted: '#a0a0b8',
      cardBg: 'rgba(255,255,255,0.05)', cardBorder: 'rgba(255,255,255,0.1)', cardRadius: 12,
      cardShadow: '0 4px 16px rgba(0,0,0,0.4)', footerBg: 'rgba(255,255,255,0.02)',
      btnStyle: { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)', borderRadius: 99 },
      heavyBorder: false, orbs: true,
    },
    funky: {
      bg: '#FFFFF0', heroBg: '#FFEC3D',
      navBg: '#FFFFF0', navBorder: '#0A0A0A',
      accent: '#FF6B35', text: '#0A0A0A', muted: '#0A0A0A',
      cardBg: '#FFFFFF', cardBorder: '#0A0A0A', cardRadius: 0,
      cardShadow: '3px 3px 0px #0A0A0A', footerBg: '#0A0A0A',
      btnStyle: { background: '#FFEC3D', border: '2px solid #0A0A0A', borderRadius: 0, boxShadow: '2px 2px 0px #0A0A0A' },
      heavyBorder: true, orbs: false,
    },
    elegant: {
      bg: '#080808', heroBg: '#080808',
      navBg: '#080808', navBorder: 'rgba(212,175,55,0.4)',
      accent: '#D4AF37', text: '#FFFFFF', muted: '#6B7280',
      cardBg: '#141414', cardBorder: 'rgba(212,175,55,0.2)', cardRadius: 2,
      cardShadow: '0 2px 12px rgba(212,175,55,0.08)', footerBg: '#0C0C0C',
      btnStyle: { background: 'transparent', border: '1px solid #D4AF37', borderRadius: 2 },
      heavyBorder: false, orbs: false,
    },
    playful: {
      bg: '#E8ECF0', heroBg: '#E8ECF0',
      navBg: '#E8ECF0', navBorder: 'transparent',
      accent: '#6C63FF', text: '#2D3748', muted: '#718096',
      cardBg: '#E8ECF0', cardBorder: 'transparent', cardRadius: 16,
      cardShadow: '4px 4px 8px #c8cdd3, -4px -4px 8px #ffffff', footerBg: '#E0E5EB',
      btnStyle: { background: '#6C63FF', borderRadius: 20, border: 'none' },
      heavyBorder: false, orbs: false,
    },
  };
  const c = cfg[id] || cfg.professional;

  return (
    <div style={{ width: '100%', height: '100%', background: c.bg, position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
      {c.orbs && (
        <>
          <div style={{ position: 'absolute', top: '5%', left: '10%', width: 70, height: 70, borderRadius: '50%', background: `${c.accent}25`, filter: 'blur(24px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 50, height: 50, borderRadius: '50%', background: `${c.accent2 || c.accent}25`, filter: 'blur(18px)', pointerEvents: 'none' }} />
        </>
      )}

      {/* Nav */}
      <div style={{
        height: 18, background: c.navBg, position: 'relative', zIndex: 1,
        borderBottom: c.heavyBorder ? `2px solid ${c.navBorder}` : `1px solid ${c.navBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px',
      }}>
        <div style={{ width: 30, height: 5, background: c.accent, borderRadius: c.heavyBorder ? 0 : 3 }} />
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[12, 10, 12].map((w, i) => (
            <div key={i} style={{ width: w, height: 3, background: `${c.muted}80`, borderRadius: 2 }} />
          ))}
          <div style={{ width: 24, height: 10, marginLeft: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', ...c.btnStyle }}>
            <div style={{ width: 12, height: 2, background: c.btnStyle.background === 'transparent' ? c.accent : '#fff', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        height: 56, background: c.heroBg, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0 12px',
        borderBottom: c.heavyBorder ? `2px solid ${c.navBorder}` : 'none',
      }}>
        <div style={{ width: 40, height: 4, background: `${c.accent}70`, borderRadius: 99 }} />
        <div style={{ width: '78%', height: 7, background: c.text, borderRadius: c.heavyBorder ? 0 : 3 }} />
        <div style={{ width: '55%', height: 3.5, background: `${c.muted}90`, borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 5, marginTop: 2 }}>
          <div style={{ width: 32, height: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', ...c.btnStyle }}>
            <div style={{ width: 16, height: 2, background: c.btnStyle.background === 'transparent' ? c.accent : '#fff', borderRadius: 2 }} />
          </div>
          <div style={{
            width: 26, height: 10, background: 'transparent', borderRadius: c.cardRadius,
            border: c.heavyBorder ? `2px solid ${c.text}` : `1px solid ${c.accent}`,
            boxShadow: c.heavyBorder ? `2px 2px 0 ${c.text}` : 'none',
          }} />
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'flex', gap: 5, padding: '8px 10px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 42, background: c.cardBg,
            border: c.heavyBorder ? `2px solid ${c.cardBorder}` : `1px solid ${c.cardBorder}`,
            borderRadius: c.cardRadius, boxShadow: c.cardShadow,
            display: 'flex', flexDirection: 'column', padding: '5px 6px', gap: 3,
          }}>
            <div style={{ width: 12, height: 5, background: c.accent, borderRadius: c.heavyBorder ? 0 : 2 }} />
            <div style={{ width: '85%', height: 3, background: `${c.text}80`, borderRadius: 2 }} />
            <div style={{ width: '65%', height: 2.5, background: `${c.muted}60`, borderRadius: 2 }} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 18,
        background: c.footerBg,
        borderTop: c.heavyBorder ? `2px solid ${c.navBorder}` : `1px solid ${c.cardBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: i === 1 ? 24 : 14, height: 2.5, background: `${i === 1 ? c.accent : c.muted}60`, borderRadius: 2 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Wireframe: Component Variant Preview ─────────────────────────────────
function VariantWireframe({ section, variantIndex }) {
  const ac = 'var(--text-high)';
  const mu = 'var(--text-muted)';
  const bd = 'var(--border-color)';

  const wireframes = {
    navbar: [
      // 1: Classic App Bar
      <div key="n1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, background: ac, borderRadius: 2 }} />
          <div style={{ width: 28, height: 4, background: ac, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[14, 18, 14].map((w, i) => <div key={i} style={{ width: w, height: 3, background: `${mu}80`, borderRadius: 2 }} />)}
        </div>
        <div style={{ width: 36, height: 16, background: ac, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 18, height: 2, background: 'var(--bg-primary)', borderRadius: 2 }} />
        </div>
      </div>,
      // 2: Centered Brand
      <div key="n2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', height: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 5, position: 'absolute', left: 10 }}>
          {[14, 12].map((w, i) => <div key={i} style={{ width: w, height: 3, background: `${mu}80`, borderRadius: 2 }} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, background: ac, borderRadius: 2 }} />
          <div style={{ width: 32, height: 5, background: ac, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', gap: 5, position: 'absolute', right: 10 }}>
          {[12, 14].map((w, i) => <div key={i} style={{ width: w, height: 3, background: `${mu}80`, borderRadius: 2 }} />)}
        </div>
      </div>,
      // 3: Mega Menu
      <div key="n3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 8, height: 8, background: ac, borderRadius: 2 }} />
          <div style={{ width: 22, height: 4, background: ac, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {['Prod ▾', 'Feat ▾', 'Docs ▾'].map((l, i) => (
            <div key={i} style={{ padding: '2px 4px', border: `1px solid ${bd}`, borderRadius: 2, fontSize: 6, color: `${mu}` }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1px solid ${bd}` }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1px solid ${bd}` }} />
        </div>
      </div>,
      // 4: Minimal Strip
      <div key="n4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, background: ac, borderRadius: 2 }} />
          <div style={{ width: 30, height: 4, background: ac, borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 10, color: mu }}>···</div>
        <div style={{ width: 40, height: 16, background: ac, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 20, height: 2, background: 'var(--bg-primary)', borderRadius: 2 }} />
        </div>
      </div>,
      // 5: Announcement + Nav
      <div key="n5" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: '35%', background: `${ac}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60%', height: 3, background: 'var(--bg-primary)', borderRadius: 2, opacity: 0.7 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderTop: `1px solid ${bd}` }}>
          <div style={{ width: 24, height: 4, background: ac, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[12, 14, 12].map((w, i) => <div key={i} style={{ width: w, height: 2.5, background: `${mu}80`, borderRadius: 2 }} />)}
          </div>
          <div style={{ width: 28, height: 12, background: ac, borderRadius: 2 }} />
        </div>
      </div>,
    ],

    hero: [
      // 1: Centered Minimal
      <div key="h1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6, padding: '0 12px' }}>
        <div style={{ width: 42, height: 5, background: `${ac}30`, border: `1px solid ${bd}`, borderRadius: 99 }} />
        <div style={{ width: '80%', height: 8, background: ac, borderRadius: 2 }} />
        <div style={{ width: '60%', height: 8, background: ac, borderRadius: 2, opacity: 0.7 }} />
        <div style={{ width: '70%', height: 4, background: `${mu}60`, borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 42, height: 14, background: ac, borderRadius: 2 }} />
          <div style={{ width: 36, height: 14, border: `1px solid ${bd}`, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ width: 18, height: 3, background: `${mu}40`, borderRadius: 2 }} />)}
        </div>
      </div>,
      // 2: Split Screen
      <div key="h2" style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, padding: '0 10px' }}>
          <div style={{ width: 32, height: 4, background: `${ac}40`, borderRadius: 99 }} />
          <div style={{ width: '90%', height: 7, background: ac, borderRadius: 2 }} />
          <div style={{ width: '75%', height: 7, background: ac, borderRadius: 2, opacity: 0.7 }} />
          <div style={{ width: '80%', height: 3, background: `${mu}60`, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 36, height: 12, background: ac, borderRadius: 2 }} />
            <div style={{ width: 30, height: 12, border: `1px solid ${bd}`, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ flex: 1, margin: '8px 8px 8px 0', background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 20, opacity: 0.3 }}>⬜</div>
        </div>
      </div>,
      // 3: Typographic Bold
      <div key="h3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 12px', gap: 6 }}>
        <div style={{ width: '100%', height: 12, background: ac, borderRadius: 2 }} />
        <div style={{ width: '85%', height: 12, background: ac, borderRadius: 2, opacity: 0.8 }} />
        <div style={{ width: '40%', height: 12, background: 'var(--primary)', borderRadius: 2 }} />
        <div style={{ width: '55%', height: 4, background: `${mu}60`, borderRadius: 2, marginTop: 4 }} />
        <div style={{ width: 44, height: 14, background: ac, borderRadius: 2 }} />
      </div>,
      // 4: Bento Grid
      <div key="h4" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 10px', gap: 5 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '70%', height: 7, background: ac, borderRadius: 2, margin: '0 auto 4px' }} />
          <div style={{ width: '50%', height: 3, background: `${mu}60`, borderRadius: 2, margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4 }}>
          <div style={{ gridRow: '1 / 3', background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 3 }} />
          <div style={{ background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 3 }} />
          <div style={{ background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 3 }} />
        </div>
      </div>,
      // 5: Immersive Overlay
      <div key="h5" style={{ position: 'relative', height: '100%', background: `linear-gradient(135deg, ${ac}15, ${ac}30)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <div style={{ position: 'absolute', inset: 0, background: `${ac}15`, borderRadius: 'inherit' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ width: 80, height: 8, background: ac, borderRadius: 2, margin: '0 auto 5px' }} />
          <div style={{ width: 60, height: 8, background: ac, borderRadius: 2, margin: '0 auto 5px', opacity: 0.8 }} />
          <div style={{ width: 50, height: 3.5, background: `${mu}80`, borderRadius: 2, margin: '0 auto 8px' }} />
          <div style={{ width: 40, height: 12, background: 'var(--bg-primary)', borderRadius: 2, margin: '0 auto' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 6, fontSize: 10, opacity: 0.5, color: ac }}>↓</div>
      </div>,
    ],

    features: [
      // 1: Icon Card Grid
      <div key="f1" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 10px', gap: 6 }}>
        <div style={{ textAlign: 'center', marginBottom: 2 }}>
          <div style={{ width: '55%', height: 6, background: ac, borderRadius: 2, margin: '0 auto 3px' }} />
          <div style={{ width: '40%', height: 3, background: `${mu}60`, borderRadius: 2, margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, background: `${ac}06`, border: `1px solid ${bd}`, borderRadius: 4, padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ width: 14, height: 14, background: `${ac}20`, border: `1px solid ${bd}`, borderRadius: 2 }} />
              <div style={{ width: '85%', height: 3.5, background: ac, borderRadius: 2 }} />
              <div style={{ width: '70%', height: 2.5, background: `${mu}50`, borderRadius: 2 }} />
              <div style={{ width: '55%', height: 2.5, background: `${mu}40`, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>,
      // 2: Alternating Rows
      <div key="f2" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 10px', gap: 5 }}>
        {[0, 1].map(row => (
          <div key={row} style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
            {row % 2 === 0 ? (
              <>
                <div style={{ flex: 1, height: '90%', background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 3 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ width: '90%', height: 4, background: ac, borderRadius: 2 }} />
                  {[70, 60, 50].map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <div style={{ width: 5, height: 5, background: `${ac}60`, borderRadius: '50%' }} />
                      <div style={{ width: `${w}%`, height: 2.5, background: `${mu}50`, borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ width: '90%', height: 4, background: ac, borderRadius: 2 }} />
                  {[65, 55, 48].map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <div style={{ width: 5, height: 5, background: `${ac}60`, borderRadius: '50%' }} />
                      <div style={{ width: `${w}%`, height: 2.5, background: `${mu}50`, borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, height: '90%', background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: 3 }} />
              </>
            )}
          </div>
        ))}
      </div>,
      // 3: Stats + Cards
      <div key="f3" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 10px', gap: 5 }}>
        <div style={{ background: `${ac}06`, border: `1px solid ${bd}`, borderRadius: 3, padding: '6px 8px', display: 'flex', justifyContent: 'space-between' }}>
          {['99K+', '100%', '24/7', '150+'].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: `${ac}`, fontFamily: 'JetBrains Mono, monospace' }}>{s}</div>
              <div style={{ width: 20, height: 2, background: `${mu}40`, borderRadius: 2, margin: '2px auto 0' }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 5 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, background: `${ac}06`, border: `1px solid ${bd}`, borderRadius: 3, padding: '5px 4px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ width: 10, height: 10, background: `${ac}25`, borderRadius: 2 }} />
              <div style={{ width: '80%', height: 3, background: ac, borderRadius: 2 }} />
              <div style={{ width: '60%', height: 2.5, background: `${mu}50`, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>,
      // 4: Tabbed
      <div key="f4" style={{ display: 'flex', height: '100%', gap: 6, padding: '8px 10px' }}>
        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Tab 1', 'Tab 2', 'Tab 3'].map((t, i) => (
            <div key={i} style={{
              padding: '6px 8px', border: `1px solid ${bd}`, borderRadius: 3, fontSize: 7, color: i === 0 ? ac : mu,
              background: i === 0 ? `${ac}10` : 'transparent', fontFamily: 'JetBrains Mono, monospace',
              borderLeft: i === 0 ? `2px solid ${ac}` : `1px solid ${bd}`,
            }}>{t} →</div>
          ))}
        </div>
        <div style={{ flex: 1, background: `${ac}05`, border: `1px solid ${bd}`, borderRadius: 3, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: '80%', height: 5, background: ac, borderRadius: 2 }} />
          <div style={{ width: '90%', height: 2.5, background: `${mu}60`, borderRadius: 2 }} />
          {[70, 60, 50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <div style={{ width: 4, height: 4, background: `${ac}60`, borderRadius: '50%' }} />
              <div style={{ width: `${w}%`, height: 2, background: `${mu}40`, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>,
      // 5: Timeline
      <div key="f5" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 12px', gap: 6 }}>
        <div style={{ width: '50%', height: 5, background: ac, borderRadius: 2, margin: '0 auto 4px' }} />
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', top: '30%', left: '10%', right: '10%', height: 1, background: `${bd}`, zIndex: 0 }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: i === 1 ? ac : `${ac}20`, border: `1px solid ${bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: i === 1 ? 'var(--bg-primary)' : ac, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{i}</div>
              <div style={{ width: 24, height: 3, background: `${mu}60`, borderRadius: 2 }} />
              <div style={{ width: 20, height: 2, background: `${mu}40`, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>,
    ],

    footer: [
      // 1: Simple Brand
      <div key="fo1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4, padding: '4px 10px' }}>
        <div style={{ width: 32, height: 5, background: ac, borderRadius: 2 }} />
        <div style={{ width: 50, height: 2.5, background: `${mu}60`, borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 10, height: 10, background: `${ac}20`, border: `1px solid ${bd}`, borderRadius: 2 }} />)}
        </div>
        <div style={{ width: '80%', height: 1, background: bd }} />
        <div style={{ width: 60, height: 2.5, background: `${mu}40`, borderRadius: 2 }} />
      </div>,
      // 2: Mega Footer
      <div key="fo2" style={{ display: 'flex', gap: 6, padding: '6px 10px', height: '100%', alignItems: 'flex-start' }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 28, height: 5, background: ac, borderRadius: 2 }} />
          <div style={{ width: '90%', height: 2, background: `${mu}50`, borderRadius: 2 }} />
          <div style={{ width: '75%', height: 2, background: `${mu}40`, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, background: `${ac}20`, borderRadius: 2 }} />)}
          </div>
        </div>
        {['Prod', 'Co.', 'Legal'].map((label, col) => (
          <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ width: '70%', height: 3, background: ac, borderRadius: 2, marginBottom: 2 }} />
            {[1,2,3,4].map(i => <div key={i} style={{ width: `${75-i*5}%`, height: 2, background: `${mu}50`, borderRadius: 2 }} />)}
          </div>
        ))}
      </div>,
      // 3: Newsletter CTA
      <div key="fo3" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '6px 10px', gap: 4 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <div style={{ width: '55%', height: 6, background: ac, borderRadius: 2 }} />
          <div style={{ width: '45%', height: 2.5, background: `${mu}60`, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 0, marginTop: 3 }}>
            <div style={{ width: 60, height: 14, background: `${ac}10`, border: `1px solid ${bd}`, borderRadius: '2px 0 0 2px' }} />
            <div style={{ width: 28, height: 14, background: ac, borderRadius: '0 2px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 2, background: 'var(--bg-primary)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: bd }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 22, height: 4, background: ac, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: 14, height: 2.5, background: `${mu}50`, borderRadius: 2 }} />)}
          </div>
          <div style={{ width: 24, height: 2.5, background: `${mu}40`, borderRadius: 2 }} />
        </div>
      </div>,
      // 4: Two-Column
      <div key="fo4" style={{ display: 'flex', gap: 6, padding: '6px 10px', height: '100%', alignItems: 'flex-start' }}>
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 30, height: 5, background: ac, borderRadius: 2 }} />
          <div style={{ width: '90%', height: 2, background: `${mu}50`, borderRadius: 2 }} />
          <div style={{ width: '80%', height: 2, background: `${mu}40`, borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: 8, height: 8, background: `${ac}20`, borderRadius: 2 }} />)}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {['Services', 'Company'].map((label, col) => (
            <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ width: '70%', height: 3, background: ac, borderRadius: 2, marginBottom: 2 }} />
              {[1,2,3,4].map(i => <div key={i} style={{ width: `${80-i*5}%`, height: 2, background: `${mu}50`, borderRadius: 2 }} />)}
            </div>
          ))}
        </div>
      </div>,
      // 5: Minimal Strip
      <div key="fo5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 12px', borderTop: `1px solid ${bd}` }}>
        <div style={{ width: 28, height: 4, background: ac, borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 14, height: 2.5, background: `${mu}60`, borderRadius: 2 }} />)}
        </div>
        <div style={{ width: 30, height: 2.5, background: `${mu}40`, borderRadius: 2 }} />
      </div>,
    ],
  };

  const frames = wireframes[section];
  if (!frames || variantIndex >= frames.length) return null;
  return frames[variantIndex];
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SkeletalTemplateBuilder({ onGenerate }) {
  const [tab, setTab] = useState('prebuilt');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selections, setSelections] = useState({});
  const [prompt, setPrompt] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  function handleTemplateSelect(id) {
    setSelectedTemplate(prev => prev === id ? null : id);
  }

  function handleVariantSelect(section, variantId) {
    setSelections(prev => ({
      ...prev,
      [section]: prev[section] === variantId ? null : variantId,
    }));
  }

  function handleGenerate() {
    if (!prompt.trim() && !selectedTemplate && Object.keys(selections).filter(k => selections[k]).length === 0) return;
    const payload = compilePayload({
      mode: tab,
      templateId: selectedTemplate,
      selections,
      userPrompt: prompt,
    });
    onGenerate(payload);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  const customSelectCount = Object.values(selections).filter(Boolean).length;
  const canGenerate = tab === 'prebuilt' ? !!selectedTemplate : customSelectCount >= 1;

  const S = {
    container: {
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
      background: 'var(--bg-primary)',
    },
    header: {
      padding: '32px 40px 0', flexShrink: 0,
    },
    tabBar: {
      display: 'flex', gap: 2, padding: '0 40px', marginBottom: 0,
      borderBottom: '1px solid var(--border-color)', flexShrink: 0,
    },
    tabBtn: (active) => ({
      padding: '12px 20px', border: 'none', background: 'transparent',
      cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
      fontWeight: active ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.06em',
      color: active ? 'var(--text-high)' : 'var(--text-muted)',
      borderBottom: active ? '2px solid var(--text-high)' : '2px solid transparent',
      marginBottom: -1, transition: 'all 0.15s',
    }),
    scrollArea: {
      flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 32,
    },
    sectionLabel: {
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
    },
    bottomBar: {
      borderTop: '1px solid var(--border-color)', padding: '20px 40px', flexShrink: 0,
      background: 'var(--bg-primary)',
    },
  };

  return (
    <div style={S.container}>
      <style>{`
        .stb-template-card { transition: all 0.18s ease; cursor: pointer; }
        .stb-template-card:hover { transform: translateY(-3px); }
        .stb-variant-card { transition: all 0.15s ease; cursor: pointer; }
        .stb-variant-card:hover { border-color: var(--text-high) !important; }
        .stb-scroll-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
        .stb-scroll-row::-webkit-scrollbar { height: 3px; }
        .stb-scroll-row::-webkit-scrollbar-track { background: transparent; }
        .stb-scroll-row::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }
        .stb-generate-btn { transition: all 0.2s; }
        .stb-generate-btn:hover:not(:disabled) { opacity: 0.85; }
        .stb-generate-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8 }}>
              Skeletal Template Builder
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', margin: 0 }}>
              Design Your Website
            </h2>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>
            {tab === 'prebuilt'
              ? selectedTemplate ? `1 template selected` : 'select a template'
              : customSelectCount > 0 ? `${customSelectCount} component${customSelectCount > 1 ? 's' : ''} selected` : 'select components'}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={S.tabBar}>
        <button style={S.tabBtn(tab === 'prebuilt')} onClick={() => setTab('prebuilt')}>
          <Layers size={12} style={{ display: 'inline', marginRight: 6 }} />
          Prebuilt Templates
        </button>
        <button style={S.tabBtn(tab === 'custom')} onClick={() => setTab('custom')}>
          <Sliders size={12} style={{ display: 'inline', marginRight: 6 }} />
          Custom Builder
        </button>
      </div>

      {/* ── Scrollable Content ── */}
      <div style={S.scrollArea}>

        {/* ─── PREBUILT TAB ─────────────────────────────────────── */}
        {tab === 'prebuilt' && (
          <div>
            <div style={S.sectionLabel}>
              <span>5 Design Systems — Pick One</span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {PREBUILT_TEMPLATES.map(template => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    className="stb-template-card"
                    onClick={() => handleTemplateSelect(template.id)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    style={{
                      flexShrink: 0, width: 188,
                      border: isSelected ? '2px solid var(--text-high)' : '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* Wireframe Preview */}
                    <div style={{ height: 150, position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-color)' }}>
                      <TemplateWireframe id={template.id} />
                    </div>

                    {/* Check Overlay */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 20, height: 20, background: 'var(--text-high)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 5,
                      }}>
                        <Check size={12} color="var(--bg-primary)" />
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {template.name}
                        </span>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {template.subtitle}
                        </span>
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 10 }}>
                        {template.description}
                      </div>
                      {/* Color Swatches */}
                      <div style={{ display: 'flex', gap: 4 }}>
                        {template.palette.map((color, i) => (
                          <div
                            key={i}
                            title={color}
                            style={{
                              width: 14, height: 14,
                              background: color.startsWith('rgba') ? color : color,
                              border: '1px solid var(--border-color)',
                              flexShrink: 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Template Details */}
            {selectedTemplate && (() => {
              const t = PREBUILT_TEMPLATES.find(t => t.id === selectedTemplate);
              return t ? (
                <div style={{ marginTop: 20, border: '1px solid var(--border-color)', padding: '16px 20px' }}>
                  <div style={S.sectionLabel}>
                    <span>{t.name} — Sections Included ({t.sections.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {t.sections.map((s, i) => (
                      <div key={i} className="mono" style={{
                        padding: '4px 10px', border: '1px solid var(--border-color)',
                        fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}>
                        {i + 1}. {s}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* ─── CUSTOM TAB ──────────────────────────────────────── */}
        {tab === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {Object.entries(COMPONENT_LIBRARY).map(([sectionKey, sectionData], sectionIdx) => (
              <div key={sectionKey}>
                <div style={{ ...S.sectionLabel, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, marginRight: 4 }}>{sectionData.icon}</span>
                  <span>{sectionData.label}</span>
                  {selections[sectionKey] && (
                    <span style={{ color: 'var(--text-high)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Check size={10} />
                      <span>{sectionData.variants.find(v => v.id === selections[sectionKey])?.name}</span>
                    </span>
                  )}
                </div>

                <div className="stb-scroll-row">
                  {sectionData.variants.map((variant, varIdx) => {
                    const isSelected = selections[sectionKey] === variant.id;
                    const wireframeHeight = sectionKey === 'navbar' ? 42 : sectionKey === 'footer' ? 60 : sectionKey === 'hero' ? 90 : 80;
                    return (
                      <div
                        key={variant.id}
                        className="stb-variant-card"
                        onClick={() => handleVariantSelect(sectionKey, variant.id)}
                        style={{
                          flexShrink: 0, width: 168,
                          border: isSelected ? '2px solid var(--text-high)' : '1px solid var(--border-color)',
                          background: 'var(--bg-primary)', cursor: 'pointer', position: 'relative',
                        }}
                      >
                        {/* Wireframe Preview */}
                        <div style={{ height: wireframeHeight, overflow: 'hidden', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                          <VariantWireframe section={sectionKey} variantIndex={varIdx} />
                        </div>

                        {/* Check */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 5, right: 5, width: 16, height: 16,
                            background: 'var(--text-high)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={10} color="var(--bg-primary)" />
                          </div>
                        )}

                        {/* Label */}
                        <div style={{ padding: '8px 10px' }}>
                          <div className="mono" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                            {variant.name}
                          </div>
                          <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {variant.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Bar ── */}
      <div style={S.bottomBar}>
        {/* Template Reminder */}
        {(selectedTemplate || customSelectCount > 0) && (
          <div className="mono" style={{
            fontSize: 10, color: 'var(--text-muted)', marginBottom: 10,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <ChevronRight size={10} />
            {tab === 'prebuilt' && selectedTemplate
              ? `${PREBUILT_TEMPLATES.find(t => t.id === selectedTemplate)?.name} template selected — describe your website below`
              : `${customSelectCount} component${customSelectCount > 1 ? 's' : ''} selected — describe your website below`}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              tab === 'prebuilt' && !selectedTemplate
                ? 'Select a template above, then describe your website...'
                : 'Describe your website — business name, purpose, content...'
            }
            rows={2}
            className="mono"
            style={{
              flex: 1, resize: 'none', padding: '14px 16px', background: 'transparent',
              border: '1px solid var(--border-color)', color: 'var(--text-high)', fontSize: 12,
              outline: 'none', lineHeight: 1.6, minHeight: 52, maxHeight: 120,
              transition: 'border-color 0.15s', fontFamily: 'JetBrains Mono, monospace',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--text-high)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          />
          <button
            onClick={handleGenerate}
            disabled={!canGenerate && !prompt.trim()}
            className="stb-generate-btn mono"
            style={{
              height: 52, padding: '0 24px', flexShrink: 0,
              background: canGenerate || prompt.trim() ? 'var(--text-high)' : 'transparent',
              color: canGenerate || prompt.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              cursor: canGenerate || prompt.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            Build
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Enter to build · Shift+Enter for new line · A prompt is optional if a template is selected
        </div>
      </div>
    </div>
  );
}
