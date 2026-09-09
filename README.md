# Horizon Heights — Premium Plotted Development Website

A modern, high-conversion residential plot-selling web application built with **Next.js 14 / 16 (App Router)**, **Three.js (WebGL)**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **Interactive 3D WebGL Site Plan**:
   - Complete 12.5-acre plotted layout with 120 individual empty villa plots.
   - Color-coded status: **Available (Green)**, **Reserved (Amber)**, **Sold Out (Red)**.
   - Orbit, Pan, and Zoom controls with touch gesture support.
   - Smooth cinematic camera flyover on initial load.
   - Interactive Raycasting: Mouse hover elevates plot with glow border and tooltip; click focuses camera on the plot and opens the detailed specifications drawer.
   - Real-time 3D orientation compass linked to camera bearing.
   - Sun-Path / Time of Day simulator (Morning Dawn, Bright Noon, Golden Hour Sunset).
   - 2D Blueprint Top-Down vs 3D Isometric view toggle.
   - Dynamic filter dimming: non-matching plots fade out gracefully.

2. **Plot Details & Lead Capture**:
   - Plot Dimensions (30×40, 40×60, 50×80 ft), Area (sq.ft / sq.yards), Facing (North, East, South, West).
   - Price breakdown (Total & per sq.ft) with base rate and corner/park premiums.
   - Photo gallery (boundary markers, street view, drone aerials).
   - Downloadable plot plan PDF button.
   - Direct WhatsApp click-to-chat button with pre-filled plot details.
   - VIP Chauffeur Site Tour booking form with doorstep cab pickup.
   - "Save to Shortlist" heart button (persisted in browser localStorage).

3. **Plot Comparison Engine**:
   - Select 2 or 3 plots to compare side-by-side in an evaluation matrix.

4. **Location & Connectivity**:
   - Interactive map embed with dark luxury theme.
   - Categorized distance cards (Transit, Education, Healthcare, Tech Parks, Shopping).
   - Commute time indicators and "Get Directions" link to Google Maps.

5. **Pricing & Interactive EMI Calculator**:
   - Transparent price tiers and milestone payment schedule.
   - Dynamic EMI slider (Loan Amount, Interest Rate, Tenure) with visual Principal vs Interest breakdown bar.

6. **Admin Dashboard (`/admin`)**:
   - Live plot inventory management: toggle any plot between Available, Reserved, and Sold in one click.
   - Real-time KPI counters (Available, Reserved, Sold counts).
   - Captured customer leads table with one-click **CSV Export**.

7. **Conversion Engines**:
   - Sticky CTA Bar (Desktop floating card / Mobile bottom fixed bar).
   - Exit-Intent Modal offering masterplan and price list PDF download.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
cd "C:\Users\Lenovo\Desktop\hello"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm start
```

---

## 📐 How to Swap in Your Real Layout

When you receive the actual layout drawing from your architect/surveyor:

1. **Plot Data File**: Open `src/data/plots.ts`.
2. Each plot has:
   - `number`: e.g. `"Plot 1"`
   - `size`: `"30x40" | "40x60" | "50x80"`
   - `width` and `depth`: in feet
   - `area`: in sq.ft
   - `facing`: `"North" | "East" | "South" | "West"`
   - `pos3D`: `[x, 0.25, z]` coordinates in the Three.js 3D world.
   - `dim3D`: `[width, 0.4, depth]` scaled dimensions.
3. You can adjust the positions to match your real cadastral survey or plotted layout map.

---

## ⚙️ Configuration & Customization

- **Project Details, Phone & WhatsApp**: Edit `src/data/landmarks.ts` under `PROJECT_SPECS`.
- **Amenities**: Edit `src/data/amenities.ts`.
- **Leads API**: `src/app/api/leads/route.ts` is ready to be connected to HubSpot, Zoho, or an email webhook.
