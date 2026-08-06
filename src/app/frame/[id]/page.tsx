/* eslint-disable @next/next/no-img-element */
import { Metadata } from 'next';
import Link from 'next/link';
import { getGraphicRecord } from '@/lib/storage';
import { Sparkles, Share2, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getGraphicRecord(id);

  const title = record?.builderInfo.name
    ? `${record.builderInfo.name}'s Official HH Goa 2026 Profile Frame`
    : 'Official HH Goa 2026 Profile Frame';

  const description = record?.builderInfo.name
    ? `${record.builderInfo.name} has framed their photo for HH Goa 2026! Generate your branded frame now.`
    : 'Frame your profile picture for HH Goa 2026. Instant high-res download!';

  const ogImageUrl = `/api/og?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

export default async function FrameSharePage({ params }: Props) {
  const { id } = await params;
  const record = await getGraphicRecord(id);

  return (
    <div className="min-h-screen bg-[#06080d] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            HH
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight">HH GOA 2026</h1>
            <p className="text-xs text-orange-400 font-medium">Official Profile Frame</p>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-[#0e131f] border border-white/10 px-4 py-2 rounded-xl transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Create Yours
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full my-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        {/* Preview Graphic */}
        <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-[#0e131f] border border-white/10 shadow-2xl shadow-orange-500/10 flex items-center justify-center relative group">
          {record?.imageDataUrl ? (
            <img
              src={record.imageDataUrl}
              alt="Generated Profile Frame"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-3 animate-pulse" />
              <p className="font-extrabold text-white">HH Goa 2026 Frame</p>
              <p className="text-sm mt-1">Generate your frame to view graphic</p>
            </div>
          )}
        </div>

        {/* Frame Details & Actions */}
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Official HH Goa 2026 Profile Overlay
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {record?.builderInfo.name || 'HH Goa Attendee'}
            </h2>
            <p className="text-xl text-orange-400 font-extrabold mt-1">
              #FrameInGoa Profile Frame
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {record?.imageDataUrl && (
              <a
                href={record.imageDataUrl}
                download={`HHGoa2026_Frame_${id.slice(0, 8)}.png`}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] min-h-[48px]"
              >
                <Download className="w-5 h-5" /> Download Frame PNG
              </a>
            )}

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Framed my photo for HH Goa 2026! 🚀\n\n#FrameInGoa`
              )}&url=${encodeURIComponent(
                `https://hhgoa2026.vercel.app/frame/${id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0e131f] hover:bg-white/10 border border-white/10 text-white font-extrabold px-5 py-3.5 rounded-xl transition-all min-h-[48px]"
            >
              <Share2 className="w-5 h-5 text-orange-400" /> Share on X
            </a>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400">
              Want your own branded profile picture overlay?
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-orange-400 hover:text-orange-300 font-extrabold mt-1"
            >
              Create your profile frame in seconds →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-6 border-t border-white/10 text-xs text-slate-500">
        © 2026 HH Goa • Hackathon &amp; Builder Residency
      </footer>
    </div>
  );
}
