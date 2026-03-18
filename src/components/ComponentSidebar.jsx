import React, { useState } from 'react';
import { UI_COMPONENTS } from '../constants/components';
import { Layers, Type, Image as ImageIcon, Layout, ArrowRight, CreditCard } from 'lucide-react';

const CATEGORY_ICONS = {
    hero: <Layout size={18} />,
    features: <Layers size={18} />,
    testimonials: <Type size={18} />,
    cta: <ArrowRight size={18} />,
    footer: <Layout size={18} />,
    payment: <CreditCard size={18} />
};

export default function ComponentSidebar({ onDragStart }) {
    const [activeTab, setActiveTab] = useState('hero');
    const categories = Object.keys(UI_COMPONENTS);

    return (
        <div style={{
            width: 280,
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Components
                </h3>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', overflowX: 'auto', padding: '0 8px' }} className="no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        style={{
                            padding: '12px 16px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: activeTab === cat ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === cat ? '2px solid var(--primary)' : '2px solid transparent',
                            background: 'none',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        {CATEGORY_ICONS[cat]}
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                <div style={{ display: 'grid', gap: 16 }}>
                    {UI_COMPONENTS[activeTab].map(comp => (
                        <div
                            key={comp.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', comp.html);
                                e.dataTransfer.setData('application/json', JSON.stringify({ id: comp.id, name: comp.name }));
                                if (onDragStart) onDragStart(comp);
                            }}
                            className="card-hover"
                            style={{
                                padding: 16,
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'grab',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                userSelect: 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    {CATEGORY_ICONS[activeTab]}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-high)' }}>{comp.name}</span>
                            </div>
                            <div style={{
                                height: 80,
                                background: 'var(--bg-surface)',
                                borderRadius: 4,
                                border: '1px dashed var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                Drag to add
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
