'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { ImageCropConfig } from '@/types';
import { ZoomIn, RotateCw, Move, Check, X } from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropConfig: ImageCropConfig;
  onChange: (config: ImageCropConfig) => void;
  imageUrl: string;
}

export function PhotoEditorModal({
  isOpen,
  onClose,
  cropConfig,
  onChange,
  imageUrl,
}: PhotoEditorModalProps) {
  if (!isOpen) return null;

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...cropConfig, zoom: parseFloat(e.target.value) });
  };

  const handleOffsetXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...cropConfig, offsetX: parseInt(e.target.value, 10) });
  };

  const handleOffsetYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...cropConfig, offsetY: parseInt(e.target.value, 10) });
  };

  const handleRotate = () => {
    const nextRotation = (cropConfig.rotation + 90) % 360;
    onChange({ ...cropConfig, rotation: nextRotation });
  };

  const handleReset = () => {
    onChange({ zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A4C2B]/85 backdrop-blur-md animate-in fade-in duration-200 font-editorial-mono">
      <div className="bg-[#F7F1DF] text-[#0A4C2B] border-3 border-[#0A4C2B] rounded-3xl p-6 max-w-md w-full shadow-[8px_8px_0px_#0A4C2B] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#0A4C2B] pb-4">
          <h3 className="font-editorial-serif font-bold text-2xl text-[#0A4C2B] flex items-center gap-2">
            <Move className="w-5 h-5 text-[#FF007A]" /> Adjust Photo Framing
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#0A4C2B] hover:text-[#FF007A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Crop Box Preview */}
        <div className="w-full aspect-square rounded-2xl bg-[#0E6B3A] overflow-hidden relative flex items-center justify-center border-2 border-[#0A4C2B] shadow-[4px_4px_0px_#0A4C2B]">
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Photo preview"
              className="max-w-none transition-transform duration-75"
              style={{
                transform: `scale(${cropConfig.zoom}) translate(${cropConfig.offsetX}px, ${cropConfig.offsetY}px) rotate(${cropConfig.rotation}deg)`,
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          {/* Circular Frame Overlay Marker */}
          <div className="absolute inset-0 border-3 border-[#FF007A] rounded-full pointer-events-none shadow-[0_0_15px_rgba(255,0,122,0.4)]" />
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs font-bold text-[#0A4C2B]">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#FF007A]" /> Zoom Level
              </span>
              <span className="text-[#FF007A] font-extrabold">{cropConfig.zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={cropConfig.zoom}
              onChange={handleZoomChange}
              className="w-full accent-[#FF007A] cursor-pointer h-2 bg-[#FFD400] rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span>Horizontal Offset (X)</span>
              <span>{cropConfig.offsetX}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={cropConfig.offsetX}
              onChange={handleOffsetXChange}
              className="w-full accent-[#FF007A] cursor-pointer h-2 bg-[#FFD400] rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span>Vertical Offset (Y)</span>
              <span>{cropConfig.offsetY}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={cropConfig.offsetY}
              onChange={handleOffsetYChange}
              className="w-full accent-[#FF007A] cursor-pointer h-2 bg-[#FFD400] rounded-lg"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              onClick={handleRotate}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-editorial-display rounded-full bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] hover:bg-white cursor-pointer min-h-[44px]"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 text-xs font-bold text-[#0E6B3A] hover:text-[#FF007A] cursor-pointer min-h-[44px]"
            >
              Reset
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs btn-editorial-pink rounded-full min-h-[44px] cursor-pointer"
          >
            <Check className="w-4 h-4" /> Apply
          </button>
        </div>
      </div>
    </div>
  );
}
