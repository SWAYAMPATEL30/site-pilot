import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCurrentUser, generateAIWebsite, fetchWebsite } from '../services/api';
import http from '../lib/http';
import { ArrowLeft, Bot, Coffee, Rocket, Palette, ShoppingCart, Hospital, BookOpen, Scale, Lightbulb, Monitor, Smartphone, Tablet, Check, BarChart, Layers, Server, History, RefreshCw, Send, Copy, Download } from 'lucide-react';
import SkeletalTemplateBuilder from '../components/SkeletalTemplateBuilder';
import ComponentSidebar from '../components/ComponentSidebar';

function VersionPanel({ websiteId, onRestore, currentVersion }) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(null);

    useEffect(() => { loadVersions(); }, [websiteId, currentVersion]);

    async function loadVersions() {
        try {
            const res = await http.get(`/websites/${websiteId}/versions`);
            setVersions(res.data.data);
        } catch (err) {
            console.error('Failed to load versions:', err);
        }
        setLoading(false);
    }

    async function handleRestore(v) {
        if (v.isCurrent) return;
        setRestoring(v.version);
        await onRestore(v.version);
        setRestoring(null);
    }

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}><span className="spinner" /> Loading history...</div>;

    return (
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-high)' }}>
                <History size={20} style={{ color: 'var(--primary)' }} /> Version History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {versions.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No previous versions found.</p>}
                {versions.slice().reverse().map((v, i) => (
                    <div key={i} className={`card ${v.isCurrent ? '' : 'card-hover'}`}
                        style={{
                            padding: '16px 20px',
                            border: v.isCurrent ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            background: v.isCurrent ? 'var(--bg-surface)' : 'var(--bg-primary)',
                            cursor: v.isCurrent ? 'default' : 'pointer',
                            opacity: restoring && restoring !== v.version ? 0.5 : 1
                        }}
                        onClick={() => !v.isCurrent && !restoring && handleRestore(v)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: v.isCurrent ? 'var(--primary)' : 'var(--text-high)' }}>
                                {v.label || `Version ${v.version}`} {v.isCurrent && <span className="badge badge-success" style={{ marginLeft: 8 }}>Live</span>}
                            </span>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(v.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, fontStyle: v.isCurrent ? 'normal' : 'italic', lineHeight: 1.5 }}>
                            "{v.prompt || 'Manual Edit/Generation'}"
                        </p>
                        {!v.isCurrent && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary btn-sm" disabled={!!restoring}>
                                    {restoring === v.version ? 'Restoring...' : 'Restore this version'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function BackendPanel({ websiteId }) {
    const [backend, setBackend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [expandedEp, setExpandedEp] = useState(null);

    useEffect(() => { loadBackend(); }, [websiteId]);

    async function loadBackend() {
        try {
            const res = await http.get(`/site-backends/${websiteId}`);
            setBackend(res.data.data);
        } catch (err) {
            // No backend yet
        }
        setLoading(false);
    }

    async function generateBackend() {
        setGenerating(true);
        try {
            const res = await http.post(`/site-backends/${websiteId}/generate`);
            setBackend(res.data.data);
        } catch (err) {
            console.error('Backend generation failed:', err);
        }
        setGenerating(false);
    }

    const methodColors = { GET: 'var(--success)', POST: 'var(--primary)', PUT: 'var(--warning)', DELETE: 'var(--danger)' };

    if (loading) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-color)' }}><span className="spinner" /> Loading backend...</div>;

    if (!backend) return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-hard)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: 24 }}>
                <Server size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 12, textAlign: 'center', color: 'var(--text-high)' }}>Dynamic Backend</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, maxWidth: 480, textAlign: 'center', lineHeight: 1.6 }}>
                AI will analyze your website and auto-generate REST API endpoints, form handlers, and data collections.
            </p>
            <button className="btn btn-primary btn-lg" onClick={generateBackend} disabled={generating}>
                {generating ? <><span className="spinner" style={{ marginRight: 8 }} /> Generating...</> : <><RefreshCw size={18} /> Generate Backend</>}
            </button>
        </div>
    );

    return (
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-high)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Server size={20} style={{ color: 'var(--primary)' }} /> Dynamic Backend API
                    </h3>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', alignItems: 'center' }}>
                        <span className={`badge badge-${backend.status === 'active' ? 'success' : 'warning'}`}>{backend.status.toUpperCase()}</span>
                        <span className="mono">{backend.apiDefinition?.endpoints?.length || 0} ENDPOINTS</span>
                        <span className="mono">{backend.apiDefinition?.collections?.length || 0} COLLECTIONS</span>
                    </div>
                </div>
                <button className="btn btn-secondary" onClick={generateBackend} disabled={generating}>
                    {generating ? '⏳ Regenerating...' : <><RefreshCw size={16} /> Regenerate</>}
                </button>
            </div>

            <div className="card" style={{ padding: '16px 20px', marginBottom: 24, background: 'var(--bg-surface)', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>API Base URL</div>
                <code style={{ fontSize: 14, color: 'var(--text-high)', fontWeight: 600, wordBreak: 'break-all' }}>
                    {window.location.origin}{backend.apiBaseUrl}
                </code>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-high)' }}>Endpoints</div>
            {backend.apiDefinition?.endpoints?.map((ep, i) => (
                <div key={i} className="card" style={{ marginBottom: 12, padding: 0, border: '1px solid var(--border-color)', overflow: 'hidden', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => setExpandedEp(expandedEp === i ? null : i)}>
                    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, background: expandedEp === i ? 'var(--bg-surface)' : 'var(--bg-primary)', transition: 'background 0.2s' }}>
                        <span className="mono" style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: 'white', background: methodColors[ep.method] || '#888', minWidth: 48, textAlign: 'center' }}>{ep.method}</span>
                        <code style={{ fontSize: 14, color: 'var(--text-high)', fontWeight: 600 }}>{ep.path}</code>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>{ep.description}</span>
                    </div>
                    {expandedEp === i && (
                        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                            {ep.fields?.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Expected Fields:</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {ep.fields.map(f => <code key={f} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-high)' }}>{f}</code>)}
                                    </div>
                                </div>
                            )}
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>cURL Example:</div>
                            <code style={{ display: 'block', padding: 16, borderRadius: 'var(--radius-sm)', background: '#1E1E2E', fontSize: 13, color: '#A6ACCD', wordBreak: 'break-all', lineHeight: 1.5 }}>
                                {ep.method === 'GET'
                                    ? `curl ${window.location.origin}/api/site-backends/public/${websiteId}${ep.path}`
                                    : `curl -X ${ep.method} ${window.location.origin}/api/site-backends/public/${websiteId}${ep.path} \\
     -H "Content-Type: application/json" \\
     -d '${JSON.stringify(Object.fromEntries(ep.fields?.map(f => [f, 'value']) || []), null, 2)}'`}
                            </code>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function DeploymentPanel({ websiteSlug }) {
    const dockerfile = [
        "FROM node:20-alpine",
        "WORKDIR /app",
        "COPY package*.json ./",
        "RUN npm install --production",
        "COPY . .",
        "EXPOSE 8080",
        "CMD [\"npm\", \"start\"]"
    ].join('\n');

    const serverCode = [
        "const express = require('express');",
        "const cors = require('cors');",
        "const fs = require('fs');",
        "const path = require('path');",
        "",
        "const app = express();",
        "app.use(cors());",
        "app.use(express.json());",
        "app.use(express.static('public'));",
        "",
        "// Load embedded database snapshot",
        "let db = { apiDefinition: { endpoints: [], collections: [] }, data: {} };",
        "...",
        "const PORT = process.env.PORT || 8080;",
        "app.listen(PORT, () => {",
        "    console.log('Server running locally on port ' + PORT);",
        "    console.log('Serving frontend at http://localhost:' + PORT);",
        "});"
    ].join('\n');

    return (
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-high)' }}>
                Deployment Bundle
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                This is the standalone configuration that gets generated when you download the Docker bundle.
                It includes a self-contained Express server and the infrastructure to run your site anywhere.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>DOCKERFILE</div>
                    <pre style={{ padding: 20, background: '#1E1E2E', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#A6ACCD', fontSize: 13, lineHeight: 1.5, overflow: 'auto' }}>
                        <code>{dockerfile}</code>
                    </pre>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>SERVER.JS (PREVIEW)</div>
                    <pre style={{ padding: 20, background: '#1E1E2E', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#A6ACCD', fontSize: 13, lineHeight: 1.5, overflow: 'auto' }}>
                        <code>{serverCode}</code>
                    </pre>
                </div>
            </div>

            <div className="card" style={{ marginTop: 24, padding: 20, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Server size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-high)' }}>How to deploy?</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    1. Click <b>"Download Bundle"</b> in the top right toolbar.<br />
                    2. Unzip the file on your local machine or server.<br />
                    3. Run <code className="mono">docker build -t {websiteSlug || 'my-app'} .</code><br />
                    4. Start your container with <code className="mono">docker run -p 8080:8080 {websiteSlug || 'my-app'}</code>
                </p>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [streaming, setStreaming] = useState(false);
    const [generatedHTML, setGeneratedHTML] = useState('');
    const [viewMode, setViewMode] = useState('preview');
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [history, setHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [aiUsage, setAiUsage] = useState(null);
    const [templatePayload, setTemplatePayload] = useState(null);
    const [showTemplateBuilder, setShowTemplateBuilder] = useState(true);
    const [projectName, setProjectName] = useState('');
    const [selectedElement, setSelectedElement] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(1);
    const chatEndRef = useRef(null);
    const iframeRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        async function init() {
            try {
                const data = await fetchCurrentUser();
                setUser(data.user);

                if (id) {
                    const { website } = await fetchWebsite(id);
                    if (website) {
                        setProjectName(website.name);

                        // Check if we have chat history available for codeyug context setup
                        try {
                            const chatRes = await http.get(`/websites/${id}/chat`);
                            if (chatRes.data?.data) {
                                const { chatHistory, promptHistory } = chatRes.data.data;
                                if (chatHistory?.length) setMessages(chatHistory);
                                if (promptHistory?.length) setHistory(promptHistory);
                            }
                        } catch (e) { /* ignore chat history missing */ }

                        const existingHtml = website.activeVersion?.htmlCode;
                        if (existingHtml) {
                            setGeneratedHTML(existingHtml);
                            setShowTemplateBuilder(false);
                            setCurrentVersion(website.activeVersion?.versionNumber || 1);
                            if (messages.length === 0) {
                                setMessages([{
                                    role: 'assistant',
                                    content: `Loaded v${website.activeVersion.versionNumber || 1} of "${website.name}".\n\nYou can type a prompt below to regenerate or modify it.`,
                                    timestamp: new Date(),
                                }]);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Builder Init Error", err);
            }
        }
        init();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleTemplateGenerate(payload) {
        setTemplatePayload(payload);
        setShowTemplateBuilder(false);
        handleSend(null, payload);
    }

    async function handleSend(promptText, injectedPayload, overrideHTML) {
        const text = promptText || prompt;
        const activePayload = injectedPayload || templatePayload;

        // Build final prompt including target element if active
        let finalPrompt = (activePayload && messages.length === 0)
            ? activePayload.enhancedPrompt
            : (text || activePayload?.enhancedPrompt);

        if (selectedElement) {
            finalPrompt = `Modify exactly this HTML element: \n\`\`\`html\n${selectedElement.outerHTML}\n\`\`\`\n\nInstructions: ${finalPrompt}`;
        }

        if (!finalPrompt?.trim() || streaming) return;

        if (!id) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: No project selected.', timestamp: new Date(), error: true }]);
            return;
        }

        const displayText = selectedElement ? `[Targeting ${selectedElement.tagName.toLowerCase()}] ${text}` : (text || (activePayload?.templateName ? `Generate with ${activePayload.templateName} template` : 'Generate website'));

        setMessages(prev => [...prev, { role: 'user', content: displayText, timestamp: new Date(), templateName: activePayload?.templateName }]);
        setPrompt('');
        setSelectedElement(null);
        setStreaming(true);

        const aiMsgId = Date.now();
        setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: aiMsgId, timestamp: new Date() }]);

        try {
            const result = await generateAIWebsite(finalPrompt, history, id, overrideHTML || generatedHTML);

            if (!result.ok) {
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: `Error: ${result.error}`, streaming: false, error: true } : m));
            } else {
                const htmlContent = result.html;
                setGeneratedHTML(htmlContent);
                setCurrentVersion(result.versionNumber || 1);

                // Fire and forget backend generation
                http.post(`/site-backends/${id}/generate`).catch(() => { });

                setHistory(prev => [...prev, { prompt: text, businessType: result.businessType }]);
                setAiUsage(result.usage);

                const sectionCount = (htmlContent.match(/<section/g) || []).length;
                const lineCount = htmlContent.split('\n').length;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? {
                    ...m,
                    content: `Website generated successfully!\n\n**${lineCount} lines** of code | **${sectionCount} sections** | **v${result.versionNumber || 1}** saved\n\nYour website is live in the preview. Click "🔧 Backend" to see auto-generated APIs.`,
                    streaming: false,
                    meta: { versionNumber: result.versionNumber },
                } : m));
            }
        } catch (err) {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: `Unexpected error: ${err.message}`, streaming: false, error: true } : m));
        }
        setStreaming(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function copyCode() {
        navigator.clipboard.writeText(generatedHTML);
    }

    async function downloadDockerBundle() {
        try {
            const token = localStorage.getItem('authToken');
            const downloadUrl = `http://localhost:5000/api/export/${id}/docker?token=${token}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-docker-bundle.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error('Failed to download bundle:', err);
        }
    }

    async function handleRestoreVersion(v) {
        try {
            const res = await http.post(`/websites/${id}/versions/${v}/restore`);
            setGeneratedHTML(res.data.data.html);
            setCurrentVersion(res.data.data.version);
            setViewMode('preview');
            // Refresh history
            http.get(`/websites/${id}/chat`).then(r => {
                if (r.data?.data?.chatHistory) setMessages(r.data.data.chatHistory);
            });
        } catch (err) {
            console.error('Failed to restore version:', err);
        }
    }

    const previewWidth = previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px';
    const hasGenerated = generatedHTML.length > 0;

    // Inject iframe inspector script for visual selection AND drag & drop Component Sidebar support
    const previewHTMLWithInspector = (viewMode === 'preview' || viewMode === 'split') ? generatedHTML.replace('</body>', `
<style>
  .tenantflow-hover-outline { outline: 2px dashed #6366f1 !important; outline-offset: 2px!important; cursor: crosshair!important; background: rgba(99, 102, 241, 0.05)!important; }
  .tenantflow-selected-outline { outline: 3px solid #6366f1!important; outline-offset: 2px!important; background: rgba(99, 102, 241, 0.1)!important; }
</style>
<script>
  let lastHovered = null;
  let currentlySelected = null;
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName.toLowerCase() === 'html' || e.target.tagName.toLowerCase() === 'body') return;
    if (lastHovered && lastHovered !== currentlySelected) lastHovered.classList.remove('tenantflow-hover-outline');
    lastHovered = e.target;
    if (lastHovered !== currentlySelected) lastHovered.classList.add('tenantflow-hover-outline');
  });
  
  document.addEventListener('mouseout', (e) => {
    if (lastHovered && lastHovered !== currentlySelected) lastHovered.classList.remove('tenantflow-hover-outline');
  });

  document.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentlySelected) currentlySelected.classList.remove('tenantflow-selected-outline');

    if (e.target.tagName.toLowerCase() === 'html' || e.target.tagName.toLowerCase() === 'body' || e.target === currentlySelected) {
        currentlySelected = null;
        window.parent.postMessage({type: 'ELEMENT_SELECTED', element: null }, '*');
        return;
    }

    currentlySelected = e.target;
    currentlySelected.classList.remove('tenantflow-hover-outline');
    currentlySelected.classList.add('tenantflow-selected-outline');

    const clone = currentlySelected.cloneNode(true);
    clone.classList.remove('tenantflow-selected-outline');

    window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        element: { tagName: clone.tagName, id: clone.id, className: clone.className, outerHTML: clone.outerHTML }
    }, '*');
  }, true);

  // DROPZONE LOGIC FOR SIDEBAR COMPONENTS
  let dropTarget = null;
  document.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.target !== dropTarget) {
          if (dropTarget) dropTarget.style.borderBottom = '';
          dropTarget = e.target;
          dropTarget.style.borderBottom = '4px solid #6366F1';
      }
  });

  document.addEventListener('dragleave', (e) => {
      if (e.target === dropTarget) {
          dropTarget.style.borderBottom = '';
          dropTarget = null;
      }
  });

  document.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dropTarget) dropTarget.style.borderBottom = '';
      const htmlString = e.dataTransfer.getData('text/plain');
      if (htmlString) {
          if (dropTarget) {
              dropTarget.insertAdjacentHTML('afterend', htmlString);
          } else {
              document.body.insertAdjacentHTML('beforeend', htmlString);
          }
          window.parent.postMessage({ type: 'COMPONENT_DROPPED', html: document.documentElement.outerHTML }, '*');
      }
      dropTarget = null;
  });
</script></body>`) : generatedHTML;

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data?.type === 'ELEMENT_SELECTED') {
                setSelectedElement(e.data.element);
            } else if (e.data?.type === 'COMPONENT_DROPPED') {
                let cleanHTML = e.data.html;
                cleanHTML = cleanHTML.replace(/<style>[\s\S]*?\.tenantflow-hover-outline[\s\S]*?<\/style>/i, '');
                cleanHTML = cleanHTML.replace(/<script>[\s\S]*?lastHovered[\s\S]*?<\/script>/i, '');
                cleanHTML = cleanHTML.replace(/tenantflow-(hover|selected)-outline/g, '');

                // Show loading indicator instantly in UI by updating generated HTML to the messy raw version momentarily
                setGeneratedHTML(cleanHTML);

                // Trigger an AI Refinement to structure and seamlessly embed the new component into the layout
                const aiRefinementPrompt = "I just dropped a new component into the document. Revise the layout. Ensure the newly added component perfectly matches the overall aesthetic, styling, color palette, and layout structure. Clean up the surrounding spacing. Return a stunning, seamless finalized page structure.";
                handleSend(aiRefinementPrompt, { enhancedPrompt: aiRefinementPrompt, templateName: 'Component Styling' }, cleanHTML);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div style={{ margin: '-32px -40px', height: 'calc(100vh)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
            `}</style>

            {/* Top Bar */}
            <div style={{ height: 56, background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate(`/dashboard/websites/${id}`)}><ArrowLeft size={14} /> Back</button>
                    <div style={{ height: 24, width: 1, background: 'var(--border-color)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bot size={16} />
                        <span className="mono" style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Builder</span>
                        {projectName && (
                            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', borderLeft: '1px solid var(--border-color)', paddingLeft: 8 }}>
                                {projectName}
                            </span>
                        )}
                        {currentVersion > 0 && <span className="badge badge-success mono">v{currentVersion}</span>}
                    </div>
                    {messages.length === 0 && !showTemplateBuilder && (
                        <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setShowTemplateBuilder(true)}>
                            <Layers size={12} /> Templates
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {hasGenerated && (
                        <>
                            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 2, gap: 2 }}>
                                {[{ id: 'desktop', icon: <Monitor size={16} /> }, { id: 'tablet', icon: <Tablet size={16} /> }, { id: 'mobile', icon: <Smartphone size={16} /> }].map(d => (
                                    <button key={d.id} onClick={() => setPreviewDevice(d.id)}
                                        style={{ padding: '6px 12px', borderRadius: 'var(--radius-hard)', border: 'none', background: previewDevice === d.id ? 'var(--text-high)' : 'transparent', color: previewDevice === d.id ? 'var(--bg-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}>
                                        {d.icon}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', padding: 2, gap: 2 }}>
                                {[{ id: 'preview', label: 'Preview' }, { id: 'split', label: 'Split' }, { id: 'code', label: 'Code' }, { id: 'backend', label: 'Backend' }, { id: 'deploy', label: 'Deploy' }, { id: 'history', label: 'History' }].map(v => (
                                    <button key={v.id} className="mono" onClick={() => setViewMode(v.id)}
                                        style={{ padding: '6px 16px', borderRadius: 'var(--radius-hard)', border: 'none', background: viewMode === v.id ? 'var(--text-high)' : 'transparent', color: viewMode === v.id ? 'var(--bg-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s' }}>
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    <div style={{ display: 'flex', gap: 8, paddingLeft: 16, borderLeft: hasGenerated ? '1px solid var(--border-color)' : 'none' }}>
                        <button className="btn btn-ghost btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={copyCode}><Copy size={14} /> Copy File</button>
                        <button className="btn btn-primary btn-sm mono" style={{ textTransform: 'uppercase' }} onClick={downloadDockerBundle}><Download size={14} /> Docker Bundle</button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Visual Editor Sidebar (Targeting + Elements) */}
                {hasGenerated && (viewMode === 'preview') && (
                    <ComponentSidebar />
                )}

                {/* Chat Panel */}
                <div style={{ width: hasGenerated ? 400 : '100%', maxWidth: hasGenerated ? 400 : '100%', margin: 0, background: 'var(--bg-primary)', borderRight: hasGenerated ? '1px solid var(--border-color)' : 'none', borderLeft: hasGenerated && viewMode === 'preview' ? '1px solid var(--border-color)' : 'none', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'all 0.3s ease', overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflow: 'auto', padding: (messages.length === 0 && showTemplateBuilder) ? 0 : (hasGenerated ? 24 : '64px 32px') }}>
                        {messages.length === 0 && showTemplateBuilder && (
                            <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <SkeletalTemplateBuilder onGenerate={handleTemplateGenerate} />
                            </div>
                        )}

                        {messages.length === 0 && !showTemplateBuilder && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                                <Bot size={32} style={{ marginBottom: 16, animation: 'float 3s ease-in-out infinite', opacity: 0.5 }} />
                                <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Building your website...</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} style={{ marginBottom: 24, display: 'flex', gap: 16, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                {msg.role === 'assistant' && (
                                    <div style={{ width: 32, height: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}><Bot size={14} /></div>
                                )}
                                <div className="mono" style={{
                                    maxWidth: hasGenerated ? '85%' : '70%',
                                    padding: '16px 20px',
                                    borderRadius: 'var(--radius-hard)',
                                    background: msg.role === 'user' ? 'var(--text-high)' : 'transparent',
                                    color: msg.role === 'user' ? 'var(--bg-primary)' : msg.error ? 'var(--error)' : 'var(--text-high)',
                                    border: msg.role === 'user' ? 'none' : `1px solid ${msg.error ? 'var(--error)' : 'var(--border-color)'}`,
                                    fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                }}>
                                    {msg.streaming ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <span style={{ width: 6, height: 6, background: 'var(--text-high)', animation: 'pulse 1.4s ease infinite' }} />
                                                <span style={{ width: 6, height: 6, background: 'var(--text-high)', animation: 'pulse 1.4s ease infinite', animationDelay: '0.2s' }} />
                                                <span style={{ width: 6, height: 6, background: 'var(--text-high)', animation: 'pulse 1.4s ease infinite', animationDelay: '0.4s' }} />
                                            </div>
                                            <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Building...</span>
                                        </div>
                                    ) : (
                                        msg.content.split('\n').map((line, j) => (
                                            <span key={j}>
                                                {line.replace(/\*\*(.*?)\*\*/g, (_, text) => text).split('•').map((part, k) => (
                                                    k > 0 ? <span key={k}><br />• {part}</span> : <span key={k}>{part}</span>
                                                ))}
                                                {j < msg.content.split('\n').length - 1 && <br />}
                                            </span>
                                        ))
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="mono" style={{ width: 32, height: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-hard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, textTransform: 'uppercase' }}>
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ padding: hasGenerated ? '16px 24px' : '24px 32px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: (messages.length === 0 && showTemplateBuilder) ? 'none' : undefined }}>

                        {/* Selector Indicator */}
                        {selectedElement && (
                            <div style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 600 }}>
                                    <Layers size={14} />
                                    <span>Targeting: {selectedElement.tagName.toLowerCase()}{selectedElement.id ? `#${selectedElement.id}` : ''}{selectedElement.className ? `.${selectedElement.className.split(' ').join('.')}` : ''}</span>
                                </div>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', height: 'auto', minHeight: 0, fontSize: 11 }} onClick={() => setSelectedElement(null)}>Clear</button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                            <textarea ref={textareaRef} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown}
                                placeholder={selectedElement ? 'Describe how to change this element...' : (messages.length === 0 ? 'Describe the website you want to build...' : 'Describe changes to your website...')}
                                rows={1} className="mono" style={{ flex: 1, resize: 'none', padding: '16px', borderRadius: 'var(--radius-hard)', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-high)', fontSize: 12, outline: 'none', transition: 'border-color 0.2s', lineHeight: 1.5, minHeight: 52, maxHeight: 160 }}
                                onFocus={e => e.target.style.borderColor = 'var(--text-high)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'; }}
                            />
                            <button onClick={() => handleSend()} disabled={!prompt.trim() || streaming}
                                style={{ width: 52, height: 52, borderRadius: 'var(--radius-hard)', border: '1px solid', borderColor: prompt.trim() && !streaming ? 'var(--text-high)' : 'var(--border-color)', background: prompt.trim() && !streaming ? 'var(--text-high)' : 'transparent', color: prompt.trim() && !streaming ? 'var(--bg-primary)' : 'var(--text-muted)', cursor: prompt.trim() && !streaming ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transition: 'all 0.2s', flexShrink: 0 }}>
                                {streaming ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }} /> : '→'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Area: Previews & Split */}
                {hasGenerated && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: viewMode === 'split' ? 'row' : 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: previewDevice === 'desktop' ? 0 : 32, overflow: 'auto', borderRight: viewMode === 'split' ? '1px solid var(--border-color)' : 'none' }}>
                                <div style={{ width: previewWidth, flex: previewDevice === 'desktop' ? 1 : 'none', height: '100%', transition: 'all 0.3s ease', border: previewDevice !== 'desktop' ? '1px solid var(--border-color)' : 'none', borderLeft: previewDevice === 'desktop' ? '1px solid var(--border-color)' : 'none', display: 'flex' }}>
                                    <iframe ref={iframeRef} srcDoc={previewHTMLWithInspector} style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: 'white' }} title="Website Preview" sandbox="allow-scripts allow-same-origin" />
                                </div>
                            </div>
                        )}

                        {(viewMode === 'code' || viewMode === 'split') && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 0, borderLeft: viewMode === 'code' ? '1px solid var(--border-color)' : 'none', maxWidth: viewMode === 'split' ? '50%' : '100%' }}>
                                <div style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', padding: '12px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>index.html — {generatedHTML.split('\n').length} lines</span>
                                </div>
                                <pre className="mono" style={{ padding: '24px', margin: 0, fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)', background: '#111', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto', tabSize: 2 }}>
                                    <code style={{ color: '#E5E7EB' }}>{generatedHTML}</code>
                                </pre>
                            </div>
                        )}

                        {viewMode === 'backend' && <BackendPanel websiteId={id} />}
                        {viewMode === 'deploy' && <DeploymentPanel websiteSlug={projectName} websiteId={id} />}
                        {viewMode === 'history' && <VersionPanel websiteId={id} currentVersion={currentVersion} onRestore={handleRestoreVersion} />}
                    </div>
                )}
            </div>
        </div>
    );
}
