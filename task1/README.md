# Hacker House Goa 2026 — Profile Frame & Builder Pass Studio 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An official identity credential generator studio for **Hacker House Goa 2026** (28 – 31 Oct 2026, Goa, India). Built with Next.js 15 App Router, Sharp, `@resvg/resvg-js` vector SVG compositing, and Supabase Storage.

---

## ✨ Features

- **🎨 Dual Graphic Formats**:
  - **Profile Frame**: Circular avatar overlay with festival branding, custom title badge, hashtag, and location details.
  - **Builder Pass**: Printed conference pass credential with QR code, organization, role, and custom title stamp.

- **🔤 Pixel-Perfect Vector Text Rendering**:
  - Server-side text rendering powered by `@resvg/resvg-js` (Rust SVG engine) and self-hosted fonts (`Cormorant Garamond`, `IBM Plex Mono`, and `Oswald`).
  - Eliminates missing font glyphs / square blocks (`□`) across all exported PNG images.

- **📱 iPhone HEIC Photo Support**:
  - On-the-fly client/server conversion for native Apple `.heic` and `.heif` camera photos.

- **🤖 AI Builder Title Shuffler**:
  - Deterministic title generator giving builders fun, tailored titles like *"The AI Architect"*, *"Shipping Machine"*, *"Prompt Wizard"*, and *"Full-Stack Alchemist"*.

- **☁️ Supabase Cloud Storage**:
  - Uploads generated high-res PNG credentials directly to Supabase Storage (`hhgoa-graphics` bucket) for cloud link sharing.

- **🖼️ Dynamic Social Card Previews (X / Twitter)**:
  - Custom `/api/og` route serving dynamic OpenGraph image previews so tweets display the exact custom credential when shared on X/Twitter.

- **🛡️ Stateless URL Parameter Fallback**:
  - Encodes builder information directly in share URLs so graphics render seamlessly across any serverless lambdas or edge functions.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Vanilla CSS Design System |
| **Image Processing** | Sharp, `@resvg/resvg-js`, `heic-convert`, `html-to-image` |
| **Cloud Storage** | Supabase Storage (`@supabase/supabase-js`) |
| **Testing** | Vitest |
| **Icons & UI** | Lucide React, Canvas Confetti |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm / yarn / pnpm

### 1. Clone the repository
```bash
git clone https://github.com/your-org/hhgoa.git
cd hhgoa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Application Production URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Credentials (Storage Bucket: hhgoa-graphics)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Execute the automated test suite powered by Vitest:

```bash
npm run test
```

---

## 📦 Building for Production

```bash
npm run build
npm run start
```

---

## ☁️ Deployment Guides

### Deploying to Netlify
1. Connect your GitHub repository to Netlify.
2. In **Site Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-site.netlify.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Trigger a deployment. Netlify will use `@netlify/plugin-nextjs` and `netlify.toml` automatically.

### Deploying to Vercel
1. Import your repository into Vercel.
2. Set Environment Variables in **Project Settings → Environment Variables**.
3. Deploy!

---

## 📂 Project Structure

```text
├── public/
│   ├── fonts/           # Self-hosted TTF font files (Cormorant, IBM Plex Mono, Oswald)
│   └── favicon.webp     # Official application favicon
├── src/
│   ├── app/
│   │   ├── api/         # API routes (/api/generate, /api/og, /api/heic, /api/title)
│   │   ├── card/[id]/   # Builder Pass share page
│   │   ├── frame/[id]/  # Profile Frame share page
│   │   ├── layout.tsx   # Root layout & OpenGraph metadata
│   │   └── page.tsx     # Main Studio Page
│   ├── components/      # UI components (Generator, Landing, Layout, Share)
│   ├── lib/             # Core engines (image-processor, fonts, storage, supabase)
│   └── __tests__/       # Vitest test suites
├── netlify.toml         # Netlify deployment configuration
├── next.config.ts       # Next.js configuration
└── package.json
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Organized with ❤️ for **Hacker House Goa 2026**.
