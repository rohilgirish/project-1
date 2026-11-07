# Anurag Enclave — Luxury Plotted Villa Development Platform

A high-craft, production-grade real estate web application for **Anurag Enclave**, a sanctioned 2.0-acre residential plotted development comprising 39 luxury villa plots (30×40 ft / 1,200 sq.ft) in Sakrayapatna, Kadur Taluk, Chikkamagaluru District, Karnataka, developed by **Anuragh Foundation**.

Built with **Next.js 16 (App Router)**, **React 19**, **Three.js (WebGL)**, and **Tailwind CSS v4**.

---

## 🌟 Key Capabilities & Features

### 1. Interactive 3D WebGL Masterplan (`/plots`)
- **3D Isometric & 2D Top-Down Views**: Real-time Three.js scene rendering all 39 plots with accurate dimensions (9.14m × 12.19m) and 9.0-meter wide asphalt avenues.
- **Live Inventory States**: Dynamic color-coded plots (`Green` = Available, `Blue` = Booked, `Red` = Sold).
- **Interactive Raycasting**: Hover plot highlights with Vastu facings, corner badges, and dimension tags; click opens detailed specifications modal.
- **Mobile Responsive**: Automatically defaults to an optimized high-performance Grid View on mobile screens (`< 768px`).
- **Filter & Sort Engine**: Filter by size (`/plots?size=30x40`), facing, price range, corner, and park-facing. Sort by plot number, price, or area.
- **Side-by-Side Plot Comparison**: Select and compare up to 3 plots concurrently in an evaluation matrix.

### 2. Statutory Compliance & Pricing Suite (`/pricing`)
- **Transparent Milestone Schedule**: 4-stage milestone schedule with aligned token advances (₹50,000 for standard / ₹1,00,000 for corner/park plots).
- **Karnataka Kaveri 2.0 Stamp Duty & Registration Engine**: Calculates 5% basic stamp duty + 10% cess + 2% surcharge (~5.6%) and 2% registration charges for Kadur Sub-Registrar jurisdiction.
- **Villa Plot EMI Financing Suite**: Interactive sliders for loan principal, interest rates, and loan tenure up to 20 years.
- **Structured Buying Guide & FAQ**: 4-step buyer journey and comprehensive answers covering title scrutiny, DC conversion under Section 95, and Grama Panchayat approvals.

### 3. Enterprise Security & DPDP Act 2023 Compliance
- **Zero-Lead-Loss Architecture**: Returns HTTP 503 with WhatsApp direct fallback if cloud database persistence fails, while asynchronously dispatching instant alerts via Next.js `after()`.
- **Strict Statutory Consent**: Enforces affirmative opt-in consent (`dpdpConsent === true`) per India's Digital Personal Data Protection (DPDP) Act 2023. Missing or false consent returns HTTP 400 Bad Request.
- **Cryptographic Phone-Gated Asset Downloads**: Official CAD masterplan blueprints are stored outside `public/` in `protected-assets/` and served exclusively via `/api/brochure/download` validated by a 15-minute cryptographically signed HMAC-SHA256 token.
- **Executive Admin Authentication**: HTTP-only, SameSite=Strict HMAC session cookies with timing-safe comparison (`crypto.timingSafeEqual`) and strict origin validation.
- **Rate Limiting & Honeypot Traps**: Anti-scraping and DDoS mitigation on `/api/leads` and administrative endpoints with invisible bot honeypot fields.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Dynamic Route Handlers)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **3D Visualizer**: [Three.js](https://threejs.org/) (WebGL Canvas, OrbitControls, Raycaster)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & PL/pgSQL atomic RPCs)
- **Quality & Testing**: [Playwright](https://playwright.dev/) (End-to-End Visual & Statutory Security Audits), TypeScript

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### 2. Environment Setup
Copy the environment template and populate your local keys:
```bash
cp .env.example .env.local
```

Key environment variables:
```ini
# Master Administrative Password (minimum 8 characters)
ADMIN_PASSWORD=your_secure_admin_password

# Cryptographic HMAC Signing Secret (generate with: openssl rand -hex 32)
ADMIN_SECRET_KEY=your_64_character_hex_secret

# Supabase Cloud Database (PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_private_service_role_key

# Canonical URL
NEXT_PUBLIC_SITE_URL=https://anuragenclave.com
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Execute the following SQL scripts in your Supabase SQL Editor:
1. `supabase-schema.sql` (Creates base `leads` table and Row Level Security policies)
2. `leads-hardening.sql` (Adds `leads_phone_unique` constraint, atomic `bump_lead_inquiry` RPC, and `audit_log` table)

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Verification

### Strict TypeScript Compilation
```bash
npx tsc --noEmit
```

### Production Build
```bash
npm run build
```

### Automated Playwright Test Suite
Run end-to-end security audits, rate-limiting tests, DPDP validation, and visual regression suites:
```bash
npm run test:visual
```

---

## 📄 License & Ownership
Copyright © 2026 **Anuragh Foundation**. All rights reserved.  
Project Location: Sakrayapatna, Kadur Taluk, Chikkamagaluru District, Karnataka.
