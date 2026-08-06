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
    ? `${record.builderInfo.name}'s Official HH Goa 2026 Builder Pass`
    : 'Official HH Goa 2026 Builder Pass';

  const description = record?.builderInfo.builderTitle
    ? `${record.builderInfo.name} - ${record.builderInfo.builderTitle} (${record.builderInfo.role}) is attending HH Goa 2026. Create your custom builder pass!`
    : 'Join developers & tech innovators at HH Goa 2026. Create your custom profile frame and builder pass!';

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

export default async function CardSharePage({ params }: Props) {
  const { id } = await params;
  const record = await getGraphicRecord(id);

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            HH
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none tracking-tight">HH GOA 2026</h1>
            <p className="text-xs text-orange-400 font-medium">Official Builder Pass</p>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Create Yours
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full my-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        {/* Preview Graphic */}
        <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-orange-500/10 flex items-center justify-center relative group">
          {record?.imageDataUrl ? (
            <img
              src={record.imageDataUrl}
              alt="Generated Builder Card"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-3 animate-pulse" />
              <p className="font-semibold text-white">HH Goa 2026 Pass</p>
              <p className="text-sm mt-1">Generate your personalized pass to view graphic</p>
            </div>
          )}
        </div>

        {/* Card Details & Actions */}
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified HH Goa 2026 Builder Pass
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {record?.builderInfo.name || 'Alex Rivera'}
            </h2>
            <p className="text-xl text-orange-400 font-bold mt-1">
              {record?.builderInfo.builderTitle || 'The AI Architect'}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {record?.builderInfo.role || 'Full Stack Engineer'} • {record?.builderInfo.company || record?.builderInfo.college || 'Goa, India'}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-sm text-slate-300 space-y-2">
            <p className="font-semibold text-white">Event Info:</p>
            <p>📅 February 2026 • Goa, India</p>
            <p>🚀 Tag: #FrameInGoa</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {record?.imageDataUrl && (
              <a
                href={record.imageDataUrl}
                download={`HHGoa2026_Card_${id.slice(0, 8)}.png`}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" /> Download Pass PNG
              </a>
            )}

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Ready for HH Goa 2026 🚀\n\nJust created my official Builder Pass!\n\nCheck it out here:`
              )}&url=${encodeURIComponent(
                `https://hhgoa2026.vercel.app/card/${id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <Share2 className="w-5 h-5 text-orange-400" /> Share on X
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-500">
              Want your own official HH Goa 2026 Profile Frame or Builder Pass?
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-orange-400 hover:text-orange-300 font-semibold mt-1"
            >
              Create your graphic in 5 seconds →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-6 border-t border-slate-800/60 text-xs text-slate-500">
        © 2026 HH Goa • Hackathon & Builder Conference
      </footer>
    </div>
  );
}
