import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const cormorant = localFont({
  src: [
    { path: '../../public/fonts/cormorant-garamond-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/cormorant-garamond-600.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/cormorant-garamond-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

const ibmPlexMono = localFont({
  src: [
    { path: '../../public/fonts/ibm-plex-mono-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ibm-plex-mono-500.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/ibm-plex-mono-600.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/ibm-plex-mono-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-ibm-mono',
  display: 'swap',
});

const oswald = localFont({
  src: [
    { path: '../../public/fonts/oswald-500.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/oswald-600.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/oswald-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hacker House Goa 2026 • Task 2 — Voice-Enabled RAG System',
  description:
    'Ultra low-latency (<200ms) voice query search powered by Sarvam AI Speech-to-Text, FAISS vector indexing, BM25 hybrid retrieval, and grounded LLM synthesis.',
  keywords: [
    'Hacker House Goa 2026',
    'Voice RAG',
    'Sarvam AI STT',
    'FAISS',
    'Low Latency RAG',
    'MSMARCO-XI',
    'Hybrid Retrieval',
    'HH Goa',
  ],
  authors: [{ name: 'Hacker House Goa AI & RAG Engineering Team' }],
  icons: {
    icon: '/favicon.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${ibmPlexMono.variable} ${oswald.variable}`}
    >
      <body className="min-h-screen bg-[#0E6B3A] text-[#F7F1DF] font-mono selection:bg-[#FF007A] selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
