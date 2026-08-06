# HH Goa 2026 — Official Frame & Builder Pass Generator

A **production-ready**, **pixel-perfect**, **mobile-first** web application built for the **HH Goa 2026 Conference & Hackathon**. 

Attendees and builders can upload their photo, customize their conference details, and generate high-resolution branded **Profile Picture Overlays** and **Builder Passes** in seconds.

---

## 🌟 Key Features

- **Dual Graphic Formats**:
  - **Profile Picture Frame**: Circular photo crop wrapped in official event branding and customizable themes.
  - **Builder Pass**: Apple Event & Google I/O inspired attendee badge featuring custom QR verification code, company/college details, and custom event hashtags.
- **Sharp Server Rendering**:
  - High-performance server-side image processing using **Sharp**.
  - Output options in **1080p Standard** and **2048p (4K Ultra HD)** lossless PNG.
  - Transparent background overlay toggle for profile picture frames.
- **HEIC & HEIF Automatic Conversion**:
  - Direct client/server support for iPhone HEIC photos using Sharp and `heic-convert` fallback.
- **AI Builder Title Generator**:
  - Witty, role-matched builder titles like *"The AI Architect"*, *"Frontend Wizard"*, *"Cloud Explorer"*, *"Shipping Machine"*, and *"Bug Hunter"*.
  - Interactive "Shuffle AI Title" button and quick suggestion pills.
- **Fine-Tuning Photo Framing**:
  - Interactive modal with zoom slider, 90° rotation, and horizontal/vertical pan controls for off-center selfies.
- **Dynamic Open Graph & Social Sharing**:
  - Dynamic shareable URLs (`/card/[id]` and `/frame/[id]`).
  - Next.js dynamic OpenGraph image API (`/api/og`) rendering live social media card previews when shared on X/Twitter, LinkedIn, or Slack.
- **Mobile-First & Accessible**:
  - Responsive design tested from 320px mobile screens up to 4K displays.
  - Dark Mode and Light Mode with system preference detection and persistence (`next-themes`).
- **Client-Side History & QR Code**:
  - Recent creations saved locally in `localStorage` for easy re-downloading.
  - Scan-to-verify QR code modal for mobile pass verification.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: TypeScript
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Image Processing Engine**: [Sharp](https://sharp.pixelplumbing.com/) & `heic-convert`
- **Animation & Confetti**: [Framer Motion](https://www.framer.com/motion/) & `canvas-confetti`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **QR Code**: `qrcode`
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # Sharp server-side image composite generator
│   │   ├── heic/route.ts       # Server-side HEIC/HEIF photo converter
│   │   ├── title/route.ts      # AI Builder Title generation endpoint
│   │   └── og/route.ts         # Dynamic Open Graph image provider
│   ├── card/[id]/page.tsx      # Dedicated shareable Builder Pass page
│   ├── frame/[id]/page.tsx     # Dedicated shareable Profile Frame page
│   ├── layout.tsx              # Root layout with Inter font & ThemeProvider
│   ├── globals.css             # TailwindCSS v4 design tokens
│   └── page.tsx                # Interactive Studio & Landing Page
├── components/
│   ├── generator/              # Studio inputs, preview canvases, uploaders & modals
│   ├── landing/                # Hero, Features, Output Gallery, FAQ accordion
│   └── layout/                 # Sticky Header & Footer
├── lib/
│   ├── image-processor.ts      # Sharp composite & SVG overlay rendering logic
│   ├── title-generator.ts      # AI title lookup and suggestion engine
│   ├── storage.ts              # In-memory & Vercel Blob storage manager
│   ├── constants.ts            # Themes, default values, max size limits
│   └── validation.ts           # Zod validation schemas
├── types/                      # TypeScript definitions
└── __tests__/                  # Vitest unit test suite
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation

```bash
git clone https://github.com/your-username/hh-goa-2026.git
cd hh-goa-2026
npm install
```

### 3. Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Run unit tests via Vitest:

```bash
npm test
```

---

## 📦 Production Build

To test the production build locally:

```bash
npm run build
npm run start
```

---

## ☁️ Deployment to Vercel

This application is ready for 1-click deployment on [Vercel](https://vercel.com).

### Optional Environment Variables:
If you wish to persist generated passes to Vercel Blob storage long-term:
- `BLOB_READ_WRITE_TOKEN`: Token obtained from your Vercel Blob Store.

*(Note: If no Vercel Blob token is supplied, generated passes remain instantly downloadable and cached in-memory).*

---

## 📄 License

MIT © 2026 HH Goa Conference Engineering Team.
