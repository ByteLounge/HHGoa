'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { BuilderInfo, ImageCropConfig, ThemeId } from '@/types';

interface FramePreviewProps {
  userImageUrl: string | null;
  builderInfo: BuilderInfo;
  themeId?: ThemeId;
  cropConfig: ImageCropConfig;
}

export function FramePreview({ userImageUrl, builderInfo, cropConfig }: FramePreviewProps) {
  return (
    <div className="w-full max-w-sm sm:max-w-md aspect-square mx-auto rounded-3xl p-4 sm:p-6 select-none bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#1E5A3B] shadow-[8px_8px_0px_#0A4C2B] relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-editorial-dots opacity-25 pointer-events-none" />

      {/* Circular Photo Container */}
      <div className="absolute w-[68%] h-[68%] rounded-full overflow-hidden top-[8%] flex items-center justify-center bg-[#0E6B3A] border-4 border-[#0A4C2B] shadow-[4px_4px_0px_#0A4C2B]">
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
          <div className="flex flex-col items-center justify-center p-4 text-center text-[#F7F1DF]">
            <span className="font-editorial-mono text-xl font-bold">PHOTO</span>
            <span className="text-xs text-[#FFD400] mt-1">Upload Above</span>
          </div>
        )}
      </div>

      {/* SVG Geometric Frame Decorative Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring Ring - Yellow & Pink Geometric Trim */}
        <circle
          cx="200"
          cy="168"
          r="134"
          stroke="#FF007A"
          strokeWidth="6"
        />
        <circle
          cx="200"
          cy="168"
          r="140"
          stroke="#FFD400"
          strokeWidth="3"
          strokeDasharray="10 6"
        />

        {/* Top Floating Stamp Badge */}
        <g transform="translate(200, 22)">
          <rect x="-65" y="-14" width="130" height="28" rx="14" fill="#FFD400" stroke="#0A4C2B" strokeWidth="2" />
          <text
            x="0"
            y="4"
            fontFamily="Oswald, sans-serif"
            fontWeight="700"
            fontSize="11"
            fill="#0A4C2B"
            textAnchor="middle"
            letterSpacing="2"
          >
            HH GOA 2026
          </text>
        </g>

        {/* Bottom Banner Badge with Complete Details */}
        <g transform="translate(24, 282)">
          <rect
            width="352"
            height="102"
            rx="16"
            fill="#0E6B3A"
            stroke="#0A4C2B"
            strokeWidth="3"
          />

          {/* Accent dot & Header */}
          <circle cx="20" cy="20" r="5" fill="#FFD400" />
          <text
            x="32"
            y="24"
            fontFamily="Cormorant Garamond, serif"
            fontWeight="700"
            fontSize="16"
            fill="#FFD400"
            letterSpacing="1"
          >
            HH GOA 2026
          </text>
          <text
            x="332"
            y="24"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
            fontSize="10"
            fill="#FF007A"
            textAnchor="end"
          >
            28-31 OCT
          </text>

          {/* Divider */}
          <line x1="20" y1="32" x2="332" y2="32" stroke="#F7F1DF" strokeOpacity="0.3" strokeWidth="1.5" />

          {/* Name, Title, Role, Org & Location */}
          <text
            x="20"
            y="52"
            fontFamily="Cormorant Garamond, serif"
            fontWeight="700"
            fontSize="17"
            fill="#F7F1DF"
          >
            {builderInfo.name || 'Alex Rivera'}
          </text>
          <text
            x="20"
            y="68"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
            fontSize="10"
            fill="#FFD400"
          >
            {(builderInfo.builderTitle || 'The AI Architect') + ' • ' + (builderInfo.role || 'Full Stack Engineer')}
          </text>
          <text
            x="20"
            y="84"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="500"
            fontSize="9"
            fill="#F7F1DF"
          >
            {(builderInfo.company || builderInfo.college || '2:47 PM Studio') + ' • ' + (builderInfo.location || 'Goa, India') + ' (' + (builderInfo.customHashtag || '#FrameInGoa') + ')'}
          </text>
        </g>
      </svg>
    </div>
  );
}
