# TenantFlow AI — Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Approach & Methodology](#2-approach--methodology)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Smart Agent — Dynamic Backend Generation](#7-smart-agent--dynamic-backend-generation)
8. [Authentication & Authorization Flow](#8-authentication--authorization-flow)
9. [AI Website Generation Flow](#9-ai-website-generation-flow)
10. [Database Schema](#10-database-schema)
11. [API Reference](#11-api-reference)
12. [Deployment & Setup](#12-deployment--setup)

---

## 1. Project Overview

**TenantFlow AI** is a multi-tenant, AI-powered website builder platform. Users describe a website in natural language, and the platform generates a fully styled, responsive HTML website in real-time using LLM streaming. Each generated website also receives an auto-generated dynamic backend API through a smart agent flow.

### Key Capabilities
- 🤖 AI-powered website generation via Groq (LLaMA 3.3 70B)
- 🔄 Real-time SSE streaming with live preview
- 🔧 Smart agent that auto-generates REST APIs for each website
- 🏢 Multi-tenant architecture with plan-based limits
- 🔐 JWT authentication with Role-Based Access Control (RBAC)
- 📊 Dashboard with analytics, billing, team management, and deployment tracking

---

## 2. Approach & Methodology

### 2.1 Migration Strategy
The project was migrated from a **Next.js monolithic** architecture to a **decoupled MERN stack**:

```mermaid
graph LR
    subgraph Before ["❌ Before — Next.js Monolith"]
        A[Next.js App Router] --> B[API Routes in /app/api]
        A --> C[Server Components]
        A --> D[In-Memory Sessions]
    end
    subgraph After ["✅ After — Decoupled Stack"]
        E[React + Vite SPA] -->|REST API| F[Express.js Server]
        F -->|Mongoose| G[MongoDB Atlas]
        F -->|Groq SDK| H[LLaMA 3.3 70B]
    end
    Before -.->|"Migration"| After
```

### 2.2 Development Phases

| Phase | Activities | Output |
|-------|-----------|--------|
| **Planning** | Analyzed Next.js codebase, identified 8 models, 9 route groups, 13 pages | Implementation plan with file-by-file breakdown |
| **Backend Foundation** | Set up Express server, MongoDB connection, Mongoose models, JWT auth | 17 backend files (models, routes, middleware, services) |
| **Frontend Build** | Created React SPA with Vite, design system, routing, auth context | 16 frontend files (pages, components, context, API client) |
| **AI Integration** | Implemented Groq-powered streaming generation with SSE | Real-time website builder with chat interface |
| **Smart Agent** | Built agent flow that analyzes HTML → generates backend schemas | Dynamic per-website REST API endpoints |
| **Verification** | End-to-end testing of login, API routes, streaming, proxy | All systems operational |

### 2.3 Design Principles
1. **Separation of Concerns** — Frontend (port 3000) and backend (port 5000) are fully decoupled
2. **Tenant Isolation** — All data is scoped per tenant via `req.tenantId` middleware injection
3. **Streaming-First AI** — SSE for real-time generation instead of batch responses
4. **Defense in Depth** — JWT verification → tenant lookup → RBAC permission check on every request
5. **Graceful Degradation** — Retry logic (2 retries with exponential backoff) on AI rate limits

---

## 3. Technology Stack

### 3.1 Stack Overview

```mermaid
graph TB
    subgraph Client ["Frontend — Port 3000"]
        R[React 18] --> V[Vite 5]
        R --> RR[React Router DOM 6]
        R --> AX[Axios]
        R --> CSS[Custom CSS Design System]
    end
    subgraph Server ["Backend — Port 5000"]
        EX[Express.js 4] --> MG[Mongoose 8]
        EX --> JWT[jsonwebtoken]
        EX --> GR[Groq SDK]
        EX --> CRS[CORS + Helmet]
    end
    subgraph Data ["Data Layer"]
        MDB[(MongoDB Atlas)]
    end
    subgraph AI ["AI Layer"]
        GROQ[Groq Cloud API]
        LLM[LLaMA 3.3 70B Versatile]
    end
    Client -->|"HTTP / SSE"| Server
    Server --> Data
    Server --> AI
```

### 3.2 Detailed Stack Table

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Runtime** | React | 18.x | Component-based UI |
| **Build Tool** | Vite | 5.4 | Fast HMR, ES module bundling |
| **Routing** | React Router DOM | 6.x | Client-side SPA routing |
| **HTTP Client** | Axios | 1.x | API calls with JWT interceptors |
| **Styling** | Vanilla CSS | — | Custom dark-theme design system with glassmorphism |
| **Backend Runtime** | Node.js | 24.x | Server-side JavaScript |
| **Web Framework** | Express.js | 4.x | REST API, middleware pipeline |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Database** | MongoDB Atlas | 7.x | Cloud-hosted NoSQL database |
| **Auth** | jsonwebtoken | 9.x | JWT token signing and verification |
| **Password Hashing** | bcryptjs | 2.x | Secure password storage |
| **AI SDK** | groq-sdk | latest | LLM API for website generation |
| **AI Model** | LLaMA 3.3 70B | Versatile | Fast, high-quality code generation |
| **Security** | helmet, cors | latest | HTTP headers, cross-origin protection |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```mermaid
graph TB
    U[👤 User Browser] -->|"http://localhost:3000"| VITE[Vite Dev Server]
    VITE -->|"Proxy /api/*"| EXPRESS[Express.js API Server]
    EXPRESS -->|"Mongoose ODM"| MONGO[(MongoDB Atlas)]
    EXPRESS -->|"Groq SDK"| GROQ[Groq Cloud — LLaMA 3.3]
    
    subgraph Frontend ["React SPA"]
        VITE
        LP[Landing Page]
        AUTH_P[Login / Register]
        DASH[Dashboard Layout]
        BUILD[AI Builder]
        PAGES[10 Dashboard Pages]
    end
    
    subgraph Backend ["Express API"]
        EXPRESS
        AUTH_MW[JWT Auth Middleware]
        RBAC[RBAC Middleware]
        ROUTES[10 Route Modules]
        AGENT[Smart Agent Flow]
    end
    
    subgraph Database ["MongoDB Atlas"]
        MONGO
        M1[Users]
        M2[Tenants]
        M3[Websites]
        M4[SiteBackends]
        M5[Pages / Deployments / Logs / Invoices]
    end
```

### 4.2 Request Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant V as Vite Proxy
    participant E as Express
    participant MW as Auth + RBAC
    participant DB as MongoDB
    participant AI as Groq API
    
    B->>V: GET/POST /api/*
    V->>E: Forward to :5000
    E->>MW: JWT Verify → Tenant Lookup → Permission Check
    MW-->>E: req.user, req.tenantId
    
    alt Standard API Call
        E->>DB: CRUD Operation
        DB-->>E: Result
        E-->>B: JSON Response
    end
    
    alt AI Generation (SSE)
        E-->>B: SSE: {type: "start"}
        E->>AI: Streaming Chat Completion
        loop For each chunk
            AI-->>E: delta.content
            E-->>B: SSE: {type: "chunk", content}
        end
        E->>DB: Save generated HTML
        E->>AI: Smart Agent — Analyze HTML
        AI-->>E: Backend Schema JSON
        E->>DB: Save SiteBackend
        E-->>B: SSE: {type: "done", html, backend}
    end
```

---

## 5. Backend Architecture

### 5.1 Directory Structure

```
server/
├── index.js                 # Express app, middleware, route mounting
├── config/
│   └── db.js                # MongoDB Atlas connection
├── middleware/
│   ├── auth.js              # JWT verification, tenant injection
│   └── rbac.js              # Role-Based Access Control (20 permissions)
├── models/
│   ├── User.js              # User model (name, email, password, role, tenant)
│   ├── Tenant.js            # Tenant model (plan, limits, usage, branding)
│   ├── Website.js           # Website model (HTML, domain, status)
│   ├── Page.js              # Page model (content, versioning)
│   ├── SiteBackend.js       # Per-website backend (apiDefinition, data)
│   ├── Deployment.js        # Deployment history model
│   ├── ActivityLog.js       # Activity audit log
│   └── Invoice.js           # Billing invoice model
├── routes/
│   ├── auth.js              # POST /login, /register, /logout, GET /me
│   ├── tenants.js           # GET/PUT tenant settings
│   ├── websites.js          # CRUD websites
│   ├── pages.js             # CRUD pages with versioning
│   ├── ai.js                # POST /generate (SSE streaming)
│   ├── siteBackends.js      # Dynamic backend management + public API
│   ├── deploy.js            # Deployment management
│   ├── billing.js           # Plans, invoices, payment history
│   ├── team.js              # Team member management, invitations
│   └── analytics.js         # Traffic, top pages, referrers, activity
├── services/
│   ├── gemini.js            # Groq LLM streaming service
│   └── agentFlow.js         # Smart agent — HTML → backend schema
└── seed.js                  # Database seeding script
```

### 5.2 Middleware Pipeline

```mermaid
graph LR
    REQ[Incoming Request] --> CORS[CORS]
    CORS --> JSON[JSON Parser]
    JSON --> ROUTE[Route Handler]
    ROUTE --> AUTH[auth middleware]
    AUTH -->|"Verify JWT"| RBAC[rbac middleware]
    RBAC -->|"Check Permission"| HANDLER[Route Logic]
    HANDLER --> DB[(MongoDB)]
    HANDLER --> RES[Response]
```

### 5.3 RBAC Permission Matrix

| Role | Users | Websites | Pages | AI | Deploy | Billing | Team | Analytics |
|------|-------|----------|-------|----|--------|---------|------|-----------|
| **Owner** | ✅ All | ✅ All | ✅ All | ✅ | ✅ | ✅ All | ✅ All | ✅ |
| **Admin** | ✅ Read | ✅ All | ✅ All | ✅ | ✅ | ✅ Read | ✅ All | ✅ |
| **Editor** | ❌ | ✅ R/W | ✅ All | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Developer** | ❌ | ✅ R/W | ✅ All | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Viewer** | ❌ | ✅ Read | ✅ Read | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 6. Frontend Architecture

### 6.1 Component Tree

```mermaid
graph TB
    APP[App.jsx — Router] --> LAND[Landing]
    APP --> LOGIN[Login]
    APP --> REG[Register]
    APP --> PROT[ProtectedRoute]
    PROT --> DL[DashboardLayout]
    DL --> DASH[Dashboard]
    DL --> WEB[Websites]
    DL --> WD[WebsiteDetail]
    DL --> BUILD[Builder + BackendPanel]
    DL --> BRAND[Branding]
    DL --> DOM[Domains]
    DL --> TEAM[Team]
    DL --> ANA[Analytics]
    DL --> BILL[Billing]
    DL --> DEP[Deployments]
```

### 6.2 State Management

```mermaid
graph TB
    AC[AuthContext] -->|"user, token, login, logout"| ALL[All Components]
    API[api/client.js — Axios] -->|"JWT Interceptor"| ALL
    LS[localStorage] -->|"token persistence"| AC
    
    subgraph Per-Page State
        WS[Websites — list, modal]
        BS[Builder — messages, HTML, streaming, backend]
        DS[Dashboard — stats, recent]
    end
```

### 6.3 Page Inventory

| Page | Route | Key Features |
|------|-------|-------------|
| Landing | `/` | Hero, features grid, CTA, pricing preview |
| Login | `/login` | Email/password form, error handling, redirect |
| Register | `/register` | Name, email, password, organization |
| Dashboard | `/dashboard` | Stats cards, quick actions, recent websites, plan usage |
| Websites | `/dashboard/websites` | Website grid, create modal, status badges |
| Website Detail | `/dashboard/websites/:id` | Info card, iframe preview, action buttons |
| **AI Builder** | `/dashboard/websites/:id/builder` | Chat, streaming, preview, code, **backend panel** |
| Branding | `/dashboard/branding` | Color picker, font selector, live preview |
| Domains | `/dashboard/domains` | Domain management table, DNS setup guide |
| Team | `/dashboard/team` | Member list, invite modal, role management |
| Analytics | `/dashboard/analytics` | Traffic stats, top pages, referrers, activity log |
| Billing | `/dashboard/billing` | Plan cards, switch plan, payment history |
| Deployments | `/dashboard/deployments` | Deployment history table with status badges |

---

## 7. Smart Agent — Dynamic Backend Generation

### 7.1 Overview
Each AI-generated website automatically receives its own REST API through a two-phase agent flow:

### 7.2 Agent Flow Diagram

```mermaid
graph TB
    subgraph Phase1 ["Phase 1 — Website Generation"]
        P[User Prompt] -->|"SSE Stream"| GROQ1[Groq LLaMA 3.3]
        GROQ1 -->|"HTML chunks"| PREVIEW[Live Preview]
        GROQ1 -->|"Complete HTML"| SAVE[Save to Website model]
    end
    
    subgraph Phase2 ["Phase 2 — Smart Agent"]
        SAVE -->|"Trigger"| AGENT[Agent Flow]
        AGENT -->|"Send HTML for analysis"| GROQ2[Groq LLaMA 3.3]
        GROQ2 -->|"JSON schema"| PARSE[Parse Response]
        PARSE --> EP[Endpoints Definition]
        PARSE --> COLL[Collections Definition]
        PARSE --> DATA[Sample Data]
        EP --> SB[(SiteBackend Model)]
        COLL --> SB
        DATA --> SB
    end
    
    subgraph Phase3 ["Phase 3 — Live API"]
        SB -->|"GET /api/site-backends/public/:id/:endpoint"| PUB_GET[Public GET — Serve Data]
        SB -->|"POST /api/site-backends/public/:id/:endpoint"| PUB_POST[Public POST — Accept Submissions]
    end
    
    style Phase1 fill:#1a1a2e,stroke:#8b5cf6,color:#fff
    style Phase2 fill:#1a1a2e,stroke:#06b6d4,color:#fff
    style Phase3 fill:#1a1a2e,stroke:#22c55e,color:#fff
```

### 7.3 Example: Restaurant Website → Auto-Generated API

When a user generates a restaurant website, the smart agent produces:

| Method | Endpoint | Auto-Generated Data |
|--------|----------|-------------------|
| `GET` | `/menu` | 3 sample menu items (name, price, category) |
| `POST` | `/reservations` | Accepts: name, email, phone, date, time, guests |
| `POST` | `/contact` | Accepts: name, email, message |
| `GET` | `/testimonials` | 2 sample reviews with ratings |
| `GET` | `/site-info` | Website title, description, metadata |

### 7.4 Agent Schema Format
```json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/menu",
      "description": "Returns restaurant menu items",
      "handler": "getMenu",
      "fields": ["name", "description", "price", "category"],
      "sampleData": [{"name": "Margherita", "price": 14.99, "category": "Pizza"}]
    }
  ],
  "collections": [
    {
      "name": "menu",
      "schema": {"name": "string", "price": "number", "category": "string"}
    }
  ]
}
```

---

## 8. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant BE as Express API
    participant DB as MongoDB
    
    Note over U,DB: Registration Flow
    U->>FE: Fill register form
    FE->>BE: POST /api/auth/register
    BE->>DB: Create Tenant + User (bcrypt hash)
    DB-->>BE: Saved
    BE-->>FE: {token, user, tenant}
    FE->>FE: Store token in localStorage
    FE->>FE: Set AuthContext
    FE->>U: Redirect to /dashboard
    
    Note over U,DB: Login Flow
    U->>FE: Enter credentials
    FE->>BE: POST /api/auth/login
    BE->>DB: Find user, verify bcrypt
    DB-->>BE: User found
    BE-->>FE: {token, user, tenant}
    FE->>FE: Store token, set context
    
    Note over U,DB: Authenticated Request
    FE->>BE: GET /api/websites (Authorization: Bearer <token>)
    BE->>BE: auth middleware: verify JWT
    BE->>DB: Find user by decoded ID
    BE->>BE: Inject req.user, req.tenantId
    BE->>BE: rbac middleware: check permission
    BE->>DB: Query with tenant filter
    DB-->>BE: Results
    BE-->>FE: {success: true, data: [...]}
    
    Note over U,DB: Token Expiry
    FE->>BE: Any request with expired token
    BE-->>FE: 401 Unauthorized
    FE->>FE: Axios interceptor clears token
    FE->>U: Redirect to /login
```

---

## 9. AI Website Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CHAT as Builder Chat UI
    participant API as Express /api/ai/generate
    participant GROQ as Groq API
    participant AGENT as Smart Agent
    participant DB as MongoDB
    
    U->>CHAT: Types prompt or clicks starter
    CHAT->>API: POST {prompt, history, websiteId}
    API->>API: Check tenant AI generation limits
    API->>DB: Load existing HTML (if editing)
    API-->>CHAT: SSE: {type: "start"}
    
    API->>GROQ: chat.completions.create({stream: true})
    
    loop Streaming Chunks
        GROQ-->>API: chunk.choices[0].delta.content
        API-->>CHAT: SSE: {type: "chunk", content: "..."}
        CHAT->>CHAT: Accumulate HTML
        CHAT->>CHAT: Strip markdown fences
        CHAT->>CHAT: Update iframe.srcdoc
    end
    
    API->>API: cleanGeneratedHTML(fullHTML)
    API->>DB: Save website.generatedHTML
    API->>DB: Increment tenant.usage.aiGenerations
    
    Note over API,AGENT: Smart Agent Phase
    API->>AGENT: analyzeAndGenerateBackendSchema(html)
    AGENT->>GROQ: Analyze HTML → JSON schema
    GROQ-->>AGENT: {endpoints, collections, sampleData}
    AGENT->>DB: Save SiteBackend
    
    API-->>CHAT: SSE: {type: "done", html, backend, usage}
    CHAT->>CHAT: Show success: "✅ 250 lines · 6 sections · 5 API endpoints"
    
    alt Rate Limit (429)
        GROQ-->>API: Error: RESOURCE_EXHAUSTED
        API-->>CHAT: SSE: {type: "status", message: "Retrying in 5s..."}
        API->>API: Wait 5s
        API->>GROQ: Retry (up to 2 retries)
    end
```

---

## 10. Database Schema

### 10.1 Entity Relationship Diagram

```mermaid
erDiagram
    TENANT ||--o{ USER : "has members"
    TENANT ||--o{ WEBSITE : "owns"
    TENANT ||--o{ INVOICE : "billed"
    TENANT ||--o{ ACTIVITY_LOG : "tracked"
    
    WEBSITE ||--o{ PAGE : "contains"
    WEBSITE ||--o{ DEPLOYMENT : "deployed"
    WEBSITE ||--|| SITE_BACKEND : "has backend"
    
    USER ||--o{ ACTIVITY_LOG : "performs"
    
    TENANT {
        ObjectId _id
        string name
        string slug
        string plan
        object limits
        object usage
        object branding
    }
    
    USER {
        ObjectId _id
        string name
        string email
        string passwordHash
        string role
        ObjectId tenant
    }
    
    WEBSITE {
        ObjectId _id
        string name
        string domain
        string generatedHTML
        int currentVersion
        string status
        ObjectId tenant
    }
    
    SITE_BACKEND {
        ObjectId _id
        ObjectId website
        ObjectId tenant
        object apiDefinition
        object data
        string status
        string apiBaseUrl
    }
    
    PAGE {
        ObjectId _id
        string title
        string slug
        string content
        int version
        ObjectId website
    }
    
    DEPLOYMENT {
        ObjectId _id
        string environment
        string status
        string url
        ObjectId website
    }
```

### 10.2 Model Summary Table

| Model | Key Fields | Relationships |
|-------|-----------|---------------|
| **Tenant** | name, slug, plan, limits (websites, pages, AI gens, storage), usage counters, branding (colors, fonts) | Has many Users, Websites, Invoices |
| **User** | name, email, passwordHash (bcrypt), role (owner/admin/editor/developer/viewer) | Belongs to Tenant |
| **Website** | name, domain, generatedHTML, currentVersion, status, businessType | Belongs to Tenant, has Pages, Deployments, SiteBackend |
| **SiteBackend** | apiDefinition (endpoints + collections), data (dynamic key-value store), status, apiBaseUrl | Belongs to Website + Tenant |
| **Page** | title, slug, content, version, previousVersions[] | Belongs to Website |
| **Deployment** | environment, status, url, buildTime, commitMessage | Belongs to Website |
| **ActivityLog** | user info, action, entityType, entityId, details, ipAddress | Belongs to Tenant |
| **Invoice** | amount, currency, status, plan, periodStart/End | Belongs to Tenant |

---

## 11. API Reference

### 11.1 Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Create tenant + user account |
| `POST` | `/api/auth/login` | — | Authenticate, returns JWT |
| `POST` | `/api/auth/logout` | JWT | Invalidate session |
| `GET` | `/api/auth/me` | JWT | Get current user + tenant |

### 11.2 Websites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/websites` | JWT | List tenant's websites |
| `POST` | `/api/websites` | JWT + `websites.create` | Create website |
| `GET` | `/api/websites/:id` | JWT | Get website detail |
| `PUT` | `/api/websites/:id` | JWT + `websites.update` | Update website |
| `DELETE` | `/api/websites/:id` | JWT + `websites.delete` | Delete website |

### 11.3 AI Generation
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/generate` | JWT + `ai.generate` | SSE stream: generate/modify website via Groq |

### 11.4 Dynamic Site Backends
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/site-backends/:websiteId` | JWT | Get backend config |
| `POST` | `/api/site-backends/:websiteId/generate` | JWT | Trigger smart agent |
| `PUT` | `/api/site-backends/:websiteId/data/:collection` | JWT | Update collection data |
| `GET` | `/api/site-backends/public/:websiteId/:endpoint` | — | Public GET data |
| `POST` | `/api/site-backends/public/:websiteId/:endpoint` | — | Public form submission |

### 11.5 Other Routes
| Group | Endpoints | Description |
|-------|-----------|-------------|
| **Tenants** | `GET/PUT /api/tenants/current` | Read/update tenant settings |
| **Pages** | `CRUD /api/pages` | Page management with versioning |
| **Deploy** | `POST/GET /api/deploy` | Trigger and list deployments |
| **Billing** | `GET/POST /api/billing` | Plans, invoices, payment history |
| **Team** | `GET/POST/DELETE /api/team` | Invite, list, remove members |
| **Analytics** | `GET /api/analytics` | Traffic, pages, referrers, logs |

---

## 12. Deployment & Setup

### 12.1 Environment Variables
```env
MONGODB_URI=mongodb+srv://...          # MongoDB Atlas connection string
GROQ_API_KEY=gsk_...                   # Groq API key for LLaMA
JWT_SECRET=your_jwt_secret             # JWT signing secret
PORT=5000                              # Express server port
```

### 12.2 Quick Start
```bash
# Install dependencies
npm install

# Seed database with demo data
node server/seed.js

# Start both servers (frontend + backend)
npm run dev

# Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000

# Demo login
# Email:    marco@bellacucina.com
# Password: demo123
```

### 12.3 Demo Accounts (from seed)

| Email | Password | Tenant | Plan |
|-------|----------|--------|------|
| `marco@bellacucina.com` | `demo123` | Bella Cucina | Free |
| `sarah@designpixel.io` | `demo123` | Design Pixel | Starter |
| `james@greenleaf.com` | `demo123` | GreenLeaf Organics | Professional |

---

*Document generated: February 21, 2026*
*Platform: TenantFlow AI v1.0*
