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
  const theme = FRAME_THEMES[themeId] || FRAME_THEMES['goa-sunset'];

  return (
    <div className="w-full max-w-sm sm:max-w-md aspect-square mx-auto rounded-3xl overflow-hidden shadow-2xl relative bg-[#050811] border border-slate-800 p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Background Dot Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Main Builder Pass Inner Card */}
      <div
        className="w-full h-full rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between shadow-xl"
        style={{
          background: 'linear-gradient(145deg, #111827 0%, #0F172A 50%, #030712 100%)',
          borderColor: theme.primaryColor + '40',
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="font-black text-sm tracking-wider text-white">HH GOA 2026</span>
            <p className="text-[10px] text-slate-400 font-medium">Official Attendee Pass</p>
          </div>

          <div
            className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm flex items-center gap-1"
            style={{ background: theme.badgeBg }}
          >
            <Sparkles className="w-3 h-3" /> BUILDER PASS
          </div>
        </div>

        {/* Center Section: Photo & Information */}
        <div className="grid grid-cols-12 gap-4 items-center z-10 my-2">
          {/* Photo Left */}
          <div className="col-span-5 aspect-square rounded-2xl overflow-hidden bg-slate-900 border-2 relative shadow-lg" style={{ borderColor: theme.primaryColor }}>
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
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-500">
                <span className="text-xs font-bold">YOUR PHOTO</span>
              </div>
            )}
          </div>

          {/* Details Right */}
          <div className="col-span-7 space-y-1.5 text-left">
            {/* Builder Title Pill */}
            <div
              className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border"
              style={{
                background: theme.primaryColor + '20',
                color: theme.accentColor,
                borderColor: theme.primaryColor + '50',
              }}
            >
              {builderInfo.builderTitle || 'The AI Architect'}
            </div>

            {/* Name */}
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight truncate">
              {builderInfo.name || 'Alex Rivera'}
            </h3>

            {/* Stack/Role */}
            <p className="text-xs font-bold truncate" style={{ color: theme.accentColor }}>
              {builderInfo.role || 'Full Stack Engineer'}
            </p>

            {/* Company / College */}
            <p className="text-[11px] font-medium text-slate-300 truncate flex items-center gap-1">
              <Building className="w-3 h-3 shrink-0 text-slate-400" />
              {builderInfo.company || builderInfo.college || 'HH Goa Community'}
            </p>

            {/* Location */}
            <p className="text-[10px] font-medium text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
              {builderInfo.location || 'Goa, India'}
            </p>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="w-full border-t border-dashed border-slate-700/60 z-10 my-1" />

        {/* Bottom Section: Date, Hashtag & QR Code */}
        <div className="flex items-center justify-between z-10 pt-1">
          <div>
            <p className="text-[11px] font-extrabold text-white tracking-wide">
              FEBRUARY 2026 • GOA, INDIA
            </p>
            <p className="text-[10px] font-bold" style={{ color: theme.primaryColor }}>
              {builderInfo.customHashtag || '#FrameInGoa'}
            </p>
          </div>

          <div className="w-11 h-11 rounded-lg bg-white/10 p-1 border border-white/20 flex items-center justify-center text-white">
            <QrCode className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
