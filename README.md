# जेवण फॅमिली रेस्टॉरंट — POS Billing & Table Management UI

A modern, responsive, and luxury-tier Point of Sale (POS) Billing and Table Management System built for **जेवण फॅमिली रेस्टॉरंट** using React 18, TypeScript, Tailwind CSS, and Lucide Icons.

---

## ✨ Key Enhancements Made

### 1. New Final Brand Logo & Identity
- Replaced the previous generic mandala icon and plain text with the authentic brand calligraphy logo: **"जेवण फॅमिली रेस्टॉरंट"**.
- Transparent PNG cropped to pixel-perfect bounding dimensions (`src/assets/logo.png`) for razor-sharp rendering on top navigation bars, slide-out navigation drawers, customer QR standees, and thermal print invoices.

### 2. Premium Components & Buttons
- **Luxury Royal Maroon & Gold Styling**: Deep maroon gradient buttons (`#7e1e24` to `#63161b`) accented with subtle champagne gold borders (`#dfb743`), micro-sheen highlights, and tactile active-press states.
- **Micro-Interactions**: Hover elevations, glowing status indicators, pulsing timer badges for seated tables, interactive status filtering chips, and segmented floor plan selectors.

### 3. Rich Typography Hierarchy
- **Serif / Display**: Google Fonts `Cinzel` & `Playfair Display` for bold titles and table IDs.
- **Devanagari Calligraphy**: `Tiro Devanagari Marathi` and `Rozha One` for authentic regional restaurant item names and billing receipts.
- **UI & Controls**: `Plus Jakarta Sans` for clean, high-contrast POS readability during peak service hours.
- **Monospace**: `JetBrains Mono` for currency values (`₹702.00`), bill numbers, and timers.

### 4. Removed the "Camera On" Square
- The intrusive maroon square box labeled "Camera On" in the bottom-right has been **completely eliminated**.
- Floor sections (**AC**, **Garden**, **Non-AC**, **Smoking-Zone**) now stretch seamlessly across the viewport with uniform spacing and fluid responsiveness.

### 5. 100% Responsive Architecture
- Works effortlessly across:
  - **POS Touch Terminals** (1080p, 1440p)
  - **Tablets & iPads** used by floor captains and waitstaff (Portrait & Landscape)
  - **Mobile Phones** with collapsible search, slide-over drawer, and adaptive grids

### 6. Comprehensive Interactive Features
- **Interactive Tables**: Click any table to open the order & billing sheet with live timer, server attribution, and item management.
- **Thermal Print Invoice**: Authentic 80mm thermal receipt preview with GSTIN, FSSAI number, itemized rates, taxes, and UPI QR code.
- **Table Reservations**: View and schedule bookings with party size, preferred zone, and instant seating.
- **Contactless Table QR**: Generate and download printable table standees with QR codes for self-ordering.
- **Move KOT / Merge Tables**: Seamlessly shift orders between tables.
- **Online Delivery & Takeaway**: Track Swiggy, Zomato, and Direct pick-up orders.

---

## 🚀 How to Run

### Option 1: Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Production Build
```bash
npm run build
```
The compiled, optimized static bundle is generated in the `dist/` directory with relative asset paths. You can preview it with:
```bash
npm run preview
```
or open `dist/index.html` directly in any web browser.

