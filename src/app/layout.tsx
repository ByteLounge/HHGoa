import type { Metadata } from 'next';
import { Cormorant_Garamond, IBM_Plex_Mono, Oswald } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-mono',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
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
