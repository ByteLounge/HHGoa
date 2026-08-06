'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Do I need an account or sign up to generate my pass?',
    a: 'No. The HH Goa 2026 generator requires zero authentication. Simply upload your photo, customize your details, and download your pass instantly.',
  },
  {
    q: 'What file formats and image sizes are supported?',
    a: 'We support JPG, PNG, WEBP, and iPhone HEIC/HEIF files up to 15MB. HEIC files are automatically converted on the fly without loss of clarity.',
  },
  {
    q: 'Are the downloaded images low resolution or blurry?',
    a: 'Not at all. Downloads are generated server-side using Sharp in native 1080x1080 or 2048x2048 (4K Ultra HD) resolution with lossless PNG output.',
  },
  {
    q: 'How does link sharing on X / Twitter work?',
    a: 'When you share your unique pass URL (e.g. /card/your-id), our dynamic OpenGraph route serves your exact generated graphic as the Twitter/X image card.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
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
