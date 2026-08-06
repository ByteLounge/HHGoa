import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

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
  title: 'HH Goa 2026 • Official Editorial Profile Frame & Builder Pass Studio',
  description:
    'Generate festival-grade profile picture overlays and official builder credentials for HH Goa 2026. High-res server rendering, zero login required.',
  keywords: [
    'HH Goa 2026',
    'HH Goa',
    'Builder Pass',
    'Profile Frame',
    'FrameInGoa',
    'Goa Hackathon',
    'Developer Pass',
  ],
  authors: [{ name: 'HH Goa Engineering & Design Team' }],
  openGraph: {
    title: 'HH Goa 2026 • Official Editorial Profile Frame & Builder Pass Studio',
    description:
      'Generate festival-grade profile picture overlays and official builder credentials for HH Goa 2026.',
    url: 'https://hhgoa2026.vercel.app',
    siteName: 'HH Goa 2026',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HH Goa 2026 • Official Editorial Profile Frame & Builder Pass Studio',
    description: 'Generate festival-grade profile picture overlays and official builder credentials for HH Goa 2026.',
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
