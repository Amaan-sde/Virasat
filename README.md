# VIRASAT (विरासत) — Handcrafted Luxury & Cultural Elegance
> **A Production-Ready, Full-Stack Ethnic & Cultural E-Commerce Platform**
> Inspired by the cultural storytelling of **FolkBazar**, the operational robustness of **Amazon.in / Flipkart**, and the accessibility of **Meesho**.

---

## 🌟 Executive Overview

**VIRASAT** is an end-to-end, enterprise-grade e-commerce platform engineered specifically for luxury cultural and ethnic commerce (pure Kanjeevaram silk sarees, authentic Banarasi brocades, royal bridal lehengas, temple jewellery, and hand-embroidered pashminas).

Built with a modern **Next.js 14 App Router** architecture, **TypeScript**, **Tailwind CSS**, and a high-performance **zero-config embedded SQLite engine with WAL durability**, VIRASAT delivers a high-conversion shopping experience alongside a self-service administrative suite with **strict role separation between Store Owners (Clients) and Developers (Super Admins)**.

---

## 🚀 Key Highlights & Capabilities

### 🛍️ 1. Customer Storefront
- **Cultural Luxury Aesthetic**: Curated color palette (Royal Crimson `#6B1724`, Warm Antique Gold `#C5A059`, Warm Ivory `#FAF8F5`, Deep Charcoal `#1F2937`) with Playfair Display editorial typography.
- **Dynamic Homepage**: Fully driven by database records with zero hardcoded promotional copy. Features an announcement ticker, hero slider, category grid, featured seasonal collections, promo banners, best sellers, brand story, trust features, and newsletter subscription.
- **Product Discovery & Instant Search**:
  - Live search bar with debounced autocomplete and rich thumbnail previews.
  - Dedicated catalogue browsing (`/shop`) with dynamic multi-attribute filters: Categories, Curated Collections, Price Range sliders, and In-Stock toggles.
  - Sorting by Featured, Price (Low-High / High-Low), Newest Arrivals, and Alphabetical.
- **Product Detail Experience (`/products/[slug]`)**:
  - Multi-image gallery with interactive zoom and responsive thumbnail carousel.
  - Variant matrix (sizes, colors, custom measurements) with live SKU and stock binding.
  - Pincode delivery estimator with real-time Indian logistics transit calculations.
  - Interactive Size Guide modal with exact measurement charts (Chest, Waist, Hip, Length).
  - Customer review submission and verified buyer star rating breakdowns.
  - Automated structured data (`Product` and `Offer` JSON-LD) for rich Google search snippets.
- **Frictionless Shopping Cart & Wishlist**:
  - Slide-out Cart Drawer and full dedicated Cart page (`/cart`).
  - Real-time stock validation and live quantity increment/decrement.
  - Dynamic Free Shipping Progress Bar incentivizing higher average order value (AOV).
  - Promo coupon redemption box with instant server verification.
  - Wishlist drawer and dedicated `/wishlist` management page.
- **Multi-Step Checkout Flow (`/checkout`)**:
  - Delivery address form with Indian state dropdown and postal code validation.
  - Order review with real-time tax (GST), shipping fees, and discount calculations.
  - Dual payment channels: **Cash on Delivery (COD)** and **Razorpay Online Gateway** simulation.
  - Server-side price lock, inventory decrement, and duplicate submission prevention.
- **Order Confirmation & Tax Invoice (`/order-success/[orderId]`)**:
  - Instant order confirmation with tracking timeline.
  - Client-side printable GST-compliant Tax Invoice formatted for A4 printing and PDF export.
- **Customer Self-Service Portal (`/account`)**:
  - Customer registration and login with encrypted credentials.
  - Order history tracking with itemized receipts and current fulfillment status.
  - Saved delivery addresses management.
- **Dedicated Content & Policy Pages**:
  - `/about`, `/contact`, `/faq`, `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`.

---

### 🛡️ 2. Administrative Suite (`/admin`)

The administrative dashboard provides complete self-service control over the storefront, with strict role-based access control (RBAC):

#### **CLIENT / STORE ADMIN Permissions**
*Designed for non-technical store managers to run day-to-day operations without code changes.*
1. **Business Dashboard (`/admin`)**: Live gross sales, paid revenue, pending cash on delivery, low-stock inventory alerts, and real-time recent order feeds.
2. **Product Catalogue (`/admin/products`)**:
   - Add, edit, duplicate, archive, and delete products.
   - Comprehensive variant matrix editor (sizes, colors, individual SKU, stock, and price overrides).
   - Multi-image media uploader with primary thumbnail selection.
   - Bulk status actions (Publish, Draft, Archive, Delete).
   - Single-click CSV catalogue export and CSV bulk product import.
3. **Visual Homepage Editor (`/admin/homepage-editor`)**:
   - Drag/reorder homepage sections.
   - Toggle section visibility (published / draft).
   - Live editor for Hero carousel slides, promotional banners, and category showcases with immediate reflection on the customer storefront.
4. **Category & Collection Manager (`/admin/categories`)**:
   - Create and organize main shopping categories and seasonal collections.
   - Custom badge colors, hero banners, and display order.
5. **Navigation Menu Editor (`/admin/navigation`)**:
   - Customize header mega menu links and footer policy navigation links dynamically.
6. **Order Fulfillment (`/admin/orders`)**:
   - Complete order overview with status filtering (Pending, Processing, Shipped, Delivered, Cancelled).
   - Order fulfillment modal: update order status, assign courier (BlueDart, Delhivery, DTDC, India Post), and input AWB tracking numbers.
7. **Discount Coupons (`/admin/discounts`)**:
   - Create percentage-off or flat-amount coupon codes.
   - Minimum order requirements, expiry dates, and usage limits.
8. **SEO & SERP Manager (`/admin/seo`)**:
   - Manage meta titles, meta descriptions, OpenGraph social sharing images, and canonical tags.
   - Real-time Google SERP (Search Engine Results Page) snippet preview.

#### **DEVELOPER / SUPER ADMIN Permissions**
*Restricted technical controls strictly hidden from standard client accounts.*
1. **Diagnostics & Health Center (`/admin/diagnostics`)**:
   - Real-time Node.js runtime memory consumption, platform architecture, system uptime.
   - SQLite database size and table record counts across all relational tables.
2. **Audit Logs (`/admin/audit-logs`)**:
   - Comprehensive chronological security log of admin actions (logins, price changes, product deletions, order fulfillments) with actor IP, email, and timestamp.
3. **Staff User Provisioning (`/admin/users`)**:
   - Add and manage staff administrative users with granular role assignment (`developer`, `client_admin`, `customer`).
4. **Payment Gateway & API Secrets (`/admin/settings`)**:
   - Secure input fields for Razorpay Key ID and Key Secret.
   - Gated with developer authorization to prevent accidental client misconfiguration.

---

## 🔐 Default Access Credentials

The database comes pre-seeded with three tiers of accounts:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Developer (Super Admin)** | `developer@virasat.com` | `Developer@12345` | Full system access, diagnostics, audit trail, user provisioning, API keys |
| **Client (Store Admin)** | `client@virasat.com` | `Client@12345` | Catalog, visual homepage editor, orders, navigation, discounts, SEO |
| **Demo Customer** | `aradhya@example.com` | `Customer@12345` | Front-end shopping, customer account, order history, wishlist |

### Pre-Configured Promo Coupons
- `VIRASAT10`: 10% off on all orders (Min spend: ₹1,999)
- `FESTIVE15`: 15% off festive orders (Min spend: ₹4,999)
- `ROYALFLAT1000`: Flat ₹1,000 off on bridal couture (Min spend: ₹9,999)

---

## 🛠️ Technology Stack & Architecture

```
virasat/
├── app/
│   ├── (storefront)/         # Customer-facing routes (SSR / SSG / ISR)
│   │   ├── page.tsx          # Dynamic homepage with DB-driven sections
│   │   ├── shop/             # Catalogue with multi-filter & search
│   │   ├── categories/       # Category showcases & taxonomy
│   │   ├── collections/      # Curated seasonal collections
│   │   ├── products/[slug]/  # Product detail, variant matrix, size chart, reviews
│   │   ├── cart/             # Dedicated cart page
│   │   ├── checkout/         # Multi-step checkout with server verification
│   │   ├── order-success/    # Confirmation & printable GST invoice
│   │   ├── account/          # Customer portal & order history
│   │   ├── wishlist/         # Customer wishlist
│   │   ├── search/           # Live search results
│   │   └── policies/         # Shipping, returns, privacy, terms, about, FAQ
│   ├── admin/                # Gated Administrative Dashboard
│   │   ├── page.tsx          # KPI dashboard & revenue metrics
│   │   ├── products/         # Catalogue management, variant matrix, CSV export/import
│   │   ├── categories/       # Categories & collections manager
│   │   ├── homepage-editor/  # Visual drag/reorder homepage section editor
│   │   ├── navigation/       # Navigation menu links editor
│   │   ├── orders/           # Order management & AWB tracking fulfillment
│   │   ├── discounts/        # Promo coupons engine
│   │   ├── seo/              # Meta tags & live Google SERP preview
│   │   ├── settings/         # Business settings & gateway configuration
│   │   ├── users/            # [Developer-only] Staff user provisioning
│   │   ├── audit-logs/       # [Developer-only] Chronological security logs
│   │   └── diagnostics/      # [Developer-only] Database & system health
│   ├── api/                  # REST API Endpoints
│   │   ├── auth/             # Login, register, logout, me (JWT cookies)
│   │   ├── products/         # Product CRUD & CSV import/export
│   │   ├── categories/       # Category CRUD
│   │   ├── collections/      # Collection CRUD
│   │   ├── discounts/        # Coupon validation
│   │   ├── checkout/         # Order creation & server-side stock decrement
│   │   ├── orders/           # Order fulfillment & status updates
│   │   ├── upload/           # Media upload handler (/public/uploads/)
│   │   └── admin/            # Stats, diagnostics, users, audit logs
│   ├── sitemap.ts            # Dynamic XML sitemap generation (/sitemap.xml)
│   ├── robots.ts             # Search engine crawling rules (/robots.txt)
│   └── layout.tsx            # Root layout with fonts, metadata, and toast provider
├── components/
│   ├── cart/                 # CartDrawer, CartContext
│   ├── home/                 # Reusable homepage section components
│   ├── layout/               # Header (search autocomplete, mega menu), Footer, AnnouncementBar
│   ├── product/              # ProductCard, VariantSelector, ImageZoom, SizeGuideModal
│   └── ui/                   # Toast notification system
├── data/
│   └── virasat.db            # Embedded SQLite Database (WAL mode, ACID compliant)
├── lib/
│   ├── db.ts                 # Database access layer & typed queries (Node 24 node:sqlite)
│   ├── seed-data.ts          # Luxury catalogue & admin accounts seed
│   ├── auth.ts               # JWT token issuing, bcrypt password hashing, auth cookies
│   └── utils.ts              # Currency formatting (₹ INR), slugify, discount math
└── public/
    └── uploads/              # Storage directory for uploaded product media
```

---

## ⚡ Getting Started & Running the Project

### Prerequisites
- Node.js 18.17+ or **Node.js 24+** (Recommended)
- npm 9+ or pnpm 8+

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd Ecommerce_site
npm install
```

### 2. Development Mode
Start the development server with hot-reloading:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build & Start
Compile the optimized production build:
```bash
npm run build
npm run start
```
The server will boot in high-performance production mode on port 3000.

---

## 📖 Store Owner / Client Operations Manual

### How to Add a New Product
1. Log in to `/admin` using your client credentials (`client@virasat.com`).
2. Navigate to **Products** in the left sidebar and click **"+ Add New Product"**.
3. Fill in:
   - **Basic Details**: Product Name, Slug, Category, Curated Collection, Short & Full Descriptions.
   - **Pricing**: Selling Price (₹) and Compare-at Price (original MRP). The discount badge calculates automatically.
   - **Inventory**: Total stock quantity and SKU.
   - **Variants**: Add sizes (e.g., *S, M, L, XL, Free Size*) and colors (e.g., *Crimson Red, Antique Gold, Royal Peacock Blue*) with their specific stock counts.
   - **Images**: Upload high-resolution product photographs or paste image URLs.
   - **Specifications**: Fabric material, weave type, wash care instructions, origin.
4. Click **"Publish Product"**. The product immediately appears across the storefront, search autocomplete, and category filters.

### How to Customize the Homepage Without Code
1. Navigate to **Homepage Editor** in the admin sidebar.
2. Use the **Up/Down arrows** to reorder sections (e.g., move *Festive Collection* above *Best Sellers*).
3. Toggle section switches on/off to temporarily hide seasonal promotions without deleting content.
4. Click **"Edit Content"** on any section to customize promotional headlines, subheadings, slide images, and call-to-action buttons.
5. Click **"Save Layout & Publish"**. Changes reflect instantly for all visitors.

### How to Process & Ship Orders
1. Navigate to **Orders** in the admin sidebar.
2. Click on any order to open the **Fulfillment Drawer**.
3. Change status from `pending` to `processing` when packing items.
4. When dispatched with a courier, select the carrier (e.g., *BlueDart, Delhivery, DTDC, India Post*) and enter the tracking/AWB number.
5. Click **"Update Order"**. The customer's account order history automatically updates with tracking details.

---

## 🔧 Developer & Operations Guide

### Database Architecture (`lib/db.ts`)
The application uses Node.js 24's native `node:sqlite` (`DatabaseSync`), configured with:
- **Write-Ahead Logging (WAL)**: `PRAGMA journal_mode = WAL;` allows concurrent readers during writes.
- **Busy Timeout**: `PRAGMA busy_timeout = 10000;` prevents write contention locks during multi-threaded Next.js static generation builds.
- **Zero Daemon Setup**: No external MySQL, PostgreSQL, or Docker dependencies needed for local deployment or lightweight VPS hosting.

### Connecting Production Payment Gateway (Razorpay)
1. Sign up for a merchant account at [https://razorpay.com](https://razorpay.com).
2. Retrieve your `Key ID` and `Key Secret` from the Razorpay API Keys dashboard.
3. Log in as Developer (`developer@virasat.com`) and navigate to **Settings**.
4. In the Developer-gated section, paste your production credentials.
5. Alternatively, export them as environment variables:
   ```bash
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxx"
   RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxx"
   ```

### Technical SEO & Search Engine Indexing
- **Dynamic XML Sitemap**: Generated automatically at `/sitemap.xml` referencing all active products, categories, collections, and policy pages.
- **Robots.txt**: Hosted at `/robots.txt`, preventing web crawlers from indexing admin routes while opening public catalogue URLs.
- **Schema.org Structured Data**: Automatically injected on product pages (`Product`, `Offer`, `AggregateRating`) and storefront layout (`Organization`, `WebSite`, `BreadcrumbList`).

---

## 📄 License & Attribution
Designed and built for **VIRASAT Heritage Luxury**. All code is structured for commercial deployment.

