import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HH Goa 2026 • Official Profile Frame & Builder Pass Generator',
  description:
    'Generate branded profile picture overlays and official builder passes for HH Goa 2026. Pixel-perfect, high-res server rendering, zero login required.',
  keywords: [
    'HH Goa 2026',
    'HH Goa',
    'Builder Pass',
    'Profile Frame',
    'FrameInGoa',
    'Goa Hackathon',
    'Developer Pass',
  ],
  authors: [{ name: 'HH Goa Engineering Team' }],
  openGraph: {
    title: 'HH Goa 2026 • Official Profile Frame & Builder Pass Generator',
    description:
      'Generate branded profile picture overlays and official builder passes for HH Goa 2026.',
    url: 'https://hhgoa2026.vercel.app',
    siteName: 'HH Goa 2026',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HH Goa 2026 • Official Profile Frame & Builder Pass Generator',
    description: 'Generate branded profile picture overlays and official builder passes for HH Goa 2026.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-white dark:bg-[#050811] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
