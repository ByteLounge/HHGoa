'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Do I need an account or sign up to generate my pass?',
    a: 'No! HH Goa Studio requires zero authentication. Simply upload your photo, customize your details, and download your high-res pass instantly.',
  },
  {
    q: 'What file formats and image sizes are supported?',
    a: 'We support JPG, PNG, WEBP, and iPhone HEIC/HEIF files up to 15MB. HEIC files are automatically converted on the fly without loss of clarity.',
  },
  {
    q: 'Are the downloaded images low resolution or pixelated?',
    a: 'Not at all. Downloads are rendered server-side using Sharp in native 1080x1080 or 2048x2048 (4K Ultra HD) resolution with crisp lossless PNG output.',
  },
  {
    q: 'How does link sharing on X / Twitter work?',
    a: 'When you share your unique pass URL (e.g. /card/your-id), our dynamic OpenGraph route serves your exact generated graphic as the Twitter/X image card preview.',
  },
  {
    q: 'What is the hashtag for social media feature?',
    a: 'Use #FrameInGoa when sharing your card or frame on X to get featured on the HH Goa radar and leaderboard!',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-[#090c15]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Got Questions?
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left font-black text-slate-900 dark:text-white flex items-center justify-between gap-4 text-base sm:text-lg cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
