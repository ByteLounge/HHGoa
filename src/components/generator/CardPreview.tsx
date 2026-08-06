'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { BuilderInfo, ImageCropConfig, ThemeId } from '@/types';
import { FRAME_THEMES } from '@/lib/constants';
import { QrCode, MapPin, Building, Sparkles } from 'lucide-react';

interface CardPreviewProps {
  userImageUrl: string | null;
  builderInfo: BuilderInfo;
  themeId: ThemeId;
  cropConfig: ImageCropConfig;
}

export function CardPreview({ userImageUrl, builderInfo, themeId, cropConfig }: CardPreviewProps) {
  const theme = FRAME_THEMES[themeId] || FRAME_THEMES['hhgoa-editorial'];

  return (
    <div className="w-full max-w-sm sm:max-w-md aspect-square mx-auto rounded-3xl p-4 sm:p-6 select-none bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#1E5A3B] shadow-[8px_8px_0px_#0A4C2B] relative flex flex-col justify-between overflow-hidden">
      {/* Editorial Decorative Stamp Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A4C2B] pb-3 z-10 font-editorial-mono">
        <div>
          <span className="font-editorial-serif font-bold text-xl tracking-tight text-[#0A4C2B]">
            HH GOA <span className="text-[#FF007A] font-mono text-sm">2026</span>
          </span>
          <p className="text-[10px] text-[#0E6B3A] font-bold uppercase tracking-wider">Official Event Credential</p>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0A4C2B] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF007A]" /> BUILDER PASS
        </div>
      </div>

      {/* Main Center Area: Photo + Editorial Metadata */}
      <div className="grid grid-cols-12 gap-4 items-center z-10 my-2">
        {/* Photo Left */}
        <div className="col-span-5 aspect-square rounded-2xl overflow-hidden bg-[#0E6B3A] border-2 border-[#0A4C2B] relative shadow-[4px_4px_0px_#0A4C2B]">
          {userImageUrl ? (
            <img
              src={userImageUrl}
              alt="Builder photo"
              className="w-full h-full object-cover transition-transform duration-100"
              style={{
                transform: `scale(${cropConfig.zoom}) translate(${cropConfig.offsetX}px, ${cropConfig.offsetY}px) rotate(${cropConfig.rotation}deg)`,
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[#F7F1DF]">
              <span className="font-editorial-mono text-[11px] font-bold">YOUR PHOTO</span>
              <span className="text-[9px] text-[#FFD400]">Upload Above</span>
            </div>
          )}
        </div>

        {/* Details Right */}
        <div className="col-span-7 space-y-1 text-left font-editorial-mono">
          {/* Builder Title Pill */}
          <div className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border-2 border-[#0A4C2B] bg-[#FF007A] text-white uppercase tracking-wider shadow-[2px_2px_0px_#0A4C2B]">
            {builderInfo.builderTitle || 'The AI Architect'}
          </div>

          {/* Name */}
          <h3 className="font-editorial-serif text-2xl font-bold text-[#0A4C2B] leading-tight truncate uppercase tracking-tight">
            {builderInfo.name || 'Alex Rivera'}
          </h3>

          {/* Role / Tech Stack */}
          <p className="text-xs font-bold text-[#FF007A] truncate">
            {builderInfo.role || 'Full Stack Engineer'}
          </p>

          {/* Organization */}
          <p className="text-[11px] font-medium text-[#0E6B3A] truncate flex items-center gap-1">
            <Building className="w-3 h-3 shrink-0 text-[#0A4C2B]" />
            {builderInfo.company || builderInfo.college || '2:47 PM Studio'}
          </p>

          {/* Location */}
          <p className="text-[10px] font-medium text-[#0E6B3A] truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-[#0A4C2B]" />
            {builderInfo.location || 'Goa, India'}
          </p>
        </div>
      </div>

      {/* Dashed Editorial Separator */}
      <div className="w-full border-t-2 border-dashed border-[#0A4C2B] z-10 my-1" />

      {/* Bottom Footer Info + QR */}
      <div className="flex items-center justify-between z-10 pt-1 font-editorial-mono">
        <div>
          <p className="text-[11px] font-bold text-[#0A4C2B] tracking-wide uppercase">
            28 – 31 OCT 2026 &nbsp;·&nbsp; GOA
          </p>
          <p className="text-[10px] font-bold text-[#FF007A]">
            {builderInfo.customHashtag || '#FrameInGoa'}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-[#FFD400] p-1 border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] flex items-center justify-center text-[#0A4C2B]">
          <QrCode className="w-full h-full text-[#0A4C2B]" />
        </div>
      </div>
    </div>
  );
}
