'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { BuilderInfo, ImageCropConfig, ThemeId } from '@/types';
import { FRAME_THEMES } from '@/lib/constants';

interface FramePreviewProps {
  userImageUrl: string | null;
  builderInfo: BuilderInfo;
  themeId: ThemeId;
  cropConfig: ImageCropConfig;
}

export function FramePreview({ userImageUrl, builderInfo, themeId, cropConfig }: FramePreviewProps) {
  const theme = FRAME_THEMES[themeId] || FRAME_THEMES['goa-sunset'];

  return (
    <div className="w-full max-w-sm sm:max-w-md aspect-square mx-auto rounded-3xl overflow-hidden shadow-2xl relative bg-[#0A0F1D] border border-slate-800 flex items-center justify-center select-none group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

      {/* User Photo Container inside central circle */}
      <div className="absolute w-[68%] h-[68%] rounded-full overflow-hidden top-[12%] flex items-center justify-center bg-slate-900 shadow-inner">
        {userImageUrl ? (
          <img
            src={userImageUrl}
            alt="Profile photo"
            className="w-full h-full object-cover transition-transform duration-100"
            style={{
              transform: `scale(${cropConfig.zoom}) translate(${cropConfig.offsetX}px, ${cropConfig.offsetY}px) rotate(${cropConfig.rotation}deg)`,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500">
            <span className="text-3xl font-bold text-slate-700">PHOTO</span>
            <span className="text-xs">Upload your photo to view frame</span>
          </div>
        )}
      </div>

      {/* SVG Overlay Frame Graphics */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="primaryGradPreview" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primaryColor} />
            <stop offset="100%" stopColor={theme.accentColor} />
          </linearGradient>
          <linearGradient id="darkBannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A0F1D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        {/* Circular Ring Glow around photo */}
        <circle
          cx="200"
          cy="184"
          r="138"
          stroke="url(#primaryGradPreview)"
          strokeWidth="5"
          className="drop-shadow-[0_0_12px_rgba(255,85,0,0.5)]"
        />
        <circle
          cx="200"
          cy="184"
          r="144"
          stroke={theme.primaryColor}
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeDasharray="8 4"
        />

        {/* Top Floating Badge */}
        <g transform="translate(200, 30)">
          <rect x="-65" y="-14" width="130" height="28" rx="14" fill="url(#primaryGradPreview)" />
          <text
            x="0"
            y="4"
            fontFamily="Inter, sans-serif"
            fontWeight="800"
            fontSize="10"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            HH GOA 2026
          </text>
        </g>

        {/* Bottom Banner Badge */}
        <g transform="translate(32, 296)">
          <rect
            width="336"
            height="84"
            rx="16"
            fill="url(#darkBannerGrad)"
            stroke="url(#primaryGradPreview)"
            strokeWidth="1.5"
          />

          {/* Accent dot & Header */}
          <circle cx="24" cy="24" r="5" fill={theme.primaryColor} />
          <text
            x="36"
            y="28"
            fontFamily="Inter, sans-serif"
            fontWeight="900"
            fontSize="14"
            fill="#FFFFFF"
            letterSpacing="1"
          >
            HH GOA 2026
          </text>
          <text
            x="312"
            y="28"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
            fontSize="9"
            fill={theme.accentColor}
            textAnchor="end"
          >
            FEB 2026
          </text>

          {/* Divider */}
          <line x1="24" y1="38" x2="312" y2="38" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />

          {/* Name & Title */}
          <text
            x="24"
            y="56"
            fontFamily="Inter, sans-serif"
            fontWeight="800"
            fontSize="13"
            fill="#FFFFFF"
          >
            {builderInfo.name || 'Alex Rivera'}
          </text>
          <text
            x="24"
            y="70"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            fontSize="10"
            fill={theme.accentColor}
          >
            {builderInfo.builderTitle || 'The AI Architect'} • #FrameInGoa
          </text>
        </g>
      </svg>
    </div>
  );
}
