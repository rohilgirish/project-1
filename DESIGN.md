# ANURAG ENCLAVE — DESIGN SYSTEM & HIGH-CRAFT SPECIFICATION
> Guided by **Taste-133**, **Impeccable Design Directives**, and **Emil Kowalski Motion Principles**.

---

## 1. Brand Philosophy & Aesthetic Identity
Anurag Enclave is an elite, 2-acre DTCP-approved plotted development by **Anuragh Foundation** in Sakrayapatna, Chikkamagaluru, Karnataka.
The design language is **"Quiet Luxury & Verdant Heritage"** — blending the natural serenity of the Western Ghats coffee landscape with architectural precision and high-trust transparency.

### Anti-Slop Directives (No Generic AI Patterns)
- ❌ **No cliché AI gradient backgrounds**: No generic purple/blue or neon pink gradients.
- ❌ **No low-contrast grey-on-dark text**: Every label, dimension, and spec must pass WCAG AA contrast (minimum 4.5:1 ratio).
- ❌ **No ungrounded card boxes**: Cards must have purposeful surface layering, specular gold highlight lines (`border-slate-800` with gold micro-accents), and authentic depth.
- ❌ **No arbitrary animations**: Motion must serve spatial continuity. No bouncing emojis or spinning icons without user intent.
- ❌ **No center-scaled popovers**: Modals and drawers must expand from their interaction origin.

---

## 2. Color Tokens & Figma Variables
```css
:root {
  /* Surface Layers */
  --surface-estate-base:    #020617; /* Deepest night sky / dark slate */
  --surface-card-primary:   rgba(15, 23, 42, 0.85); /* 85% slate-900 glass */
  --surface-card-raised:    rgba(30, 41, 59, 0.7);  /* Slate-800 elevated */
  --surface-border-subtle:  rgba(51, 65, 85, 0.6);  /* Slate-700 calibrated */
  
  /* Brand Luxury Accents */
  --brand-gold-base:        #bd9f67; /* Architectural Warm Gold */
  --brand-gold-glow:        #d4af37; /* Metallic Champagne */
  --brand-gold-subtle:      rgba(189, 159, 103, 0.15); /* 15% Gold Tint */
  
  /* Status & Compliance */
  --status-available:       #10b981; /* Emerald Green */
  --status-reserved:        #f59e0b; /* Amber Gold */
  --status-sold:            #f43f5e; /* Rose / Ruby */
  
  /* Typography */
  --text-primary:           #f8fafc; /* Crisp slate-50 */
  --text-secondary:         #cbd5e1; /* High-readability slate-300 */
  --text-muted:             #94a3b8; /* Slate-400 for secondary metrics */
}
```

---

## 3. Emil Kowalski Motion Principles (`animations.dev`)

### Timing & Duration
- **Micro-interactions (Buttons, Toggles, Chips)**: `120ms – 180ms`.
- **Drawers & Modals**: `220ms – 280ms`. Maximum threshold: **300ms**.
- **Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring ease-out).

### Origin-Aware Expansions
```css
/* Origin-aware plot detail animation */
.origin-aware-dialog {
  transform-origin: var(--click-x, 50%) var(--click-y, 50%);
  animation: dialog-enter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Mobile Bottom Drawers (`Vaul`)
- On screens `< 768px`, plot details must NOT render as an awkward desktop modal.
- Render as a native iOS-style bottom drawer with a tactile drag handle (`w-12 h-1.5 rounded-full bg-slate-700`), snap points, and gesture flick dismiss.

### Tactile Feedback (`Sonner`)
- When a lead submits a site visit or inquiry:
  - Trigger `toast.success("Site Visit Scheduled", { description: "Our Land Specialist will connect with you via WhatsApp/Phone." })`.
  - Rich tactile confirmation without aggressive full-page reloads.

---

## 4. Figma MCP Integration Map
| Figma Component | Web Component | Tailwind / Token |
| :--- | :--- | :--- |
| `Brand/EmblemLogo` | `src/components/ui/BrandLogo.tsx` | `#bd9f67` Gold filter + SVG |
| `Cards/PlotCard` | `src/components/plots/PlotCard.tsx` | `bg-slate-900/85 border border-slate-800` |
| `Modals/PlotDrawer` | `src/components/plots/PlotDetailModal.tsx` | `Vaul.Root` + origin-aware dialog |
| `Modals/CompareDrawer` | `src/components/plots/PlotCompareModal.tsx` | `emil-spring-modal` + side-by-side grid |
| `Finance/EMICalculator` | `src/components/pricing/EMICalculator.tsx` | `#bd9f67` Gold numbers + emerald progress |
| `Hero/StatusPill` | `src/components/home/HeroSection.tsx` | `bg-emerald-500/10 border-emerald-500/30` |
| `Navigation/Dock` | `src/components/layout/MenuListButtons.tsx` | Gliding icon micro-animation |

---

## 5. Visual Testing & Playwright Verification
- Automated headless browser tests run across:
  1. **Desktop Chrome (1440×900)**: Visual hero balance, 3D Canvas, grid symmetry.
  2. **Mobile Safari / iPhone 14 (390×844)**: Bottom sticky bar, drawer gesture, touch targets ≥ 44×44px.
  3. **Interactive E2E Flows**: EMI slider verification, plot compare modals, and zero console errors.

---

## 6. Security, Data Privacy & Zero-Trust Governance

### Security Philosophy
Anurag Enclave treats buyer data, phone numbers, and land inquiries with bank-grade privacy. Security must never be a clumsy after-thought or an ugly alert box — it is an integral dimension of high craft.

### Zero-Trust & Data Hygiene Directives
- **Zero Public SELECT Access**: In Supabase, the table `leads` has RLS enabled with `SELECT` revoked from the public `anon` role. Only server-side authenticated sessions can access customer records.
- **Strict Input Sanitization**: All form inputs are sanitized on ingress. HTML tags, non-printable control characters, and CSV formula injection characters (`=`, `+`, `-`, `@`) are stripped or neutralized.
- **Mobile Number Verification**: Client and server reject spoofed numbers with 10-digit Indian E.164 mobile regex (`^[6-9]\d{9}$`).
- **Invisible Bot Traps (Honeypot)**: Silent decoy fields (`website_url_check`) trap automated scraping bots without imposing friction on human buyers.
- **Sliding-Window Rate Limiting**: All API routes enforce IP-based rate limiting (5 POSTs per 10 minutes; 30 GETs per minute) returning `429 Too Many Requests` with dynamic retry headers.
- **HTTP Security Headers**: Enforced across every route in `next.config.ts`:
  - `X-Frame-Options: DENY` (Anti-Clickjacking)
  - `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (Enforced HTTPS)
  - `Referrer-Policy: strict-origin-when-cross-origin` (Confidential query isolation)
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Device API lockdown)
  - `Content-Security-Policy`: Whitelisted script, style, and media boundaries.

### Executive Admin Gate (Taste-133 & Emil Kowalski)
- When visiting `/admin`, unauthorized visitors are met with a luxury frosted-glass security lockscreen (`bg-slate-900/90 border border-slate-800` with warm gold accents and specular highlights).
- Incorrect PIN codes trigger a tactile spring error micro-shake (`animate-shake` powered by `cubic-bezier(0.16, 1, 0.3, 1)`).
- Session tokens are stored in ephemeral `sessionStorage` (auto-terminated on tab close) with a one-click "Lock Desk" logout command.

---

## 7. The 3 Impeccable Design Audit Lenses

When reviewing or building new components for Anurag Enclave, apply these 3 continuous audit lenses:

1. **`polish` (Alignment & Contrast)**:
   - Ensure all touch targets on mobile are at least 44×44px.
   - Align all numerical metrics with tabular figures (`font-mono`) to prevent layout jitter when numbers change.
   - Guarantee WCAG AA color contrast (minimum 4.5:1 ratio) on every label.
2. **`bolder` (High-Impact Proof Points)**:
   - Never bury key selling points in fine print: prominently highlight the DTCP approval status, ₹15.6L launch rate, and 48m botanical buffer.
   - Use warm architectural gold (`#bd9f67`) and emerald (`#10b981`) for high-value transactional buttons.
3. **`distill` (Eliminate Clutter)**:
   - Remove redundant iconography and placeholder badges.
   - Keep forms under 4 essential fields (Full Name, Phone Number, Preferred Date, Plot Preference).

