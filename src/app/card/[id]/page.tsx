/* eslint-disable @next/next/no-img-element */
import { Metadata } from 'next';
import Link from 'next/link';
import { getGraphicRecord } from '@/lib/storage';
import { Share2, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getGraphicRecord(id);

  const title = record?.builderInfo?.name
    ? `${record.builderInfo.name}'s Official HH Goa 2026 Builder Pass`
    : 'Official HH Goa 2026 Builder Pass';

  const description = record?.builderInfo?.builderTitle
    ? `${record.builderInfo.name} - ${record.builderInfo.builderTitle} (${record.builderInfo.role}) is attending HH Goa 2026.`
    : 'Official Builder Pass Credential for HH Goa 2026.';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hhgoa2026.vercel.app';
  const ogImageUrl = `${baseUrl}/api/og?id=${id}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/card/${id}`,
      siteName: 'HH Goa 2026 Studio',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 1200,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CardSharePage({ params }: Props) {
  const { id } = await params;
  const record = await getGraphicRecord(id);

  const shareText = `Ready for HH Goa 2026 🚀\n\nJust created my official Builder Pass!\n\nCheck out my credential:`;
  const shareUrl = `https://hhgoa2026.vercel.app/card/${id}`;
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const imageSrc = record?.imageDataUrl || `/api/og?id=${id}`;

  return (
    <div className="min-h-screen bg-[#0E6B3A] text-[#F7F1DF] flex flex-col justify-between p-4 sm:p-8 font-editorial-mono">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b-2 border-[#1E5A3B]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center font-display font-bold text-lg shadow-[3px_3px_0px_#0A4C2B]">
            HH
          </div>
          <div>
            <h1 className="font-editorial-serif font-bold text-2xl leading-none text-[#FFD400]">HH GOA 2026</h1>
            <p className="text-xs text-[#F7F1DF]/80 font-bold">Official Builder Pass Credential</p>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-editorial-display font-bold text-[#0A4C2B] bg-[#FFD400] border-2 border-[#0A4C2B] px-4 py-2.5 rounded-full shadow-[3px_3px_0px_#0A4C2B] hover:translate-x-0.5 transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#0A4C2B]" /> Studio
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full my-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        {/* Prominent High-Res Pass Graphic (Downloaded PNG) */}
        <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-[#F7F1DF] border-2 border-[#1E5A3B] shadow-[8px_8px_0px_#0A4C2B] flex items-center justify-center relative group p-2">
          <img
            src={imageSrc}
            alt="Official HH Goa Builder Pass"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* Builder Details & Actions */}
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0A4C2B]">
            <CheckCircle2 className="w-4 h-4 text-[#FF007A]" /> Verified Official HH Goa Credential
          </div>

          <div>
            <h2 className="text-4xl font-editorial-serif font-bold text-[#F7F1DF] uppercase">
              {record?.builderInfo?.name || 'Alex Rivera'}
            </h2>
            <p className="text-xl text-[#FFD400] font-bold mt-1">
              {record?.builderInfo?.builderTitle || 'The AI Architect'}
            </p>
            <p className="text-[#F7F1DF]/90 text-sm mt-2 font-medium">
              {(record?.builderInfo?.role || 'Full Stack Engineer') + ' • ' + (record?.builderInfo?.company || record?.builderInfo?.college || '2:47 PM Studio') + ' • ' + (record?.builderInfo?.location || 'Goa, India')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={imageSrc}
              download={`HHGoa2026_BuilderPass_${id.slice(0, 8)}.png`}
              className="flex items-center gap-2 btn-editorial-pink px-6 py-3.5 rounded-full text-sm shadow-[4px_4px_0px_#0A4C2B] min-h-[48px]"
            >
              <Download className="w-5 h-5 text-white" /> Download Graphic PNG
            </a>

            <a
              href={twitterIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 btn-editorial-cream px-5 py-3.5 rounded-full text-sm shadow-[4px_4px_0px_#0A4C2B] min-h-[48px]"
            >
              <Share2 className="w-5 h-5 text-[#FF007A]" /> Share to X
            </a>
          </div>

          <div className="pt-4 border-t border-[#1E5A3B]">
            <p className="text-xs text-[#F7F1DF]/80">
              Want your own official HH Goa 2026 Profile Frame or Builder Pass?
            </p>
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#FFD400] hover:underline mt-1"
            >
              Create your graphic in studio →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-6 border-t border-[#1E5A3B] text-xs text-[#F7F1DF]/70">
        © 2026 HH Goa • Hackathon &amp; Builder Studio
      </footer>
    </div>
  );
}
