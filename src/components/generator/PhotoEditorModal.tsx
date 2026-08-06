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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Move className="w-5 h-5 text-orange-500" /> Fine-Tune Photo Framing
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Crop Box Preview */}
        <div className="w-full aspect-square rounded-2xl bg-slate-950 overflow-hidden relative flex items-center justify-center border border-slate-800">
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
          <div className="absolute inset-0 border-2 border-orange-500/50 rounded-full pointer-events-none" />
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-orange-500" /> Zoom Level
              </span>
              <span>{cropConfig.zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={cropConfig.zoom}
              onChange={handleZoomChange}
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Horizontal Pan (X)</span>
              <span>{cropConfig.offsetX}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={cropConfig.offsetX}
              onChange={handleOffsetXChange}
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Vertical Pan (Y)</span>
              <span>{cropConfig.offsetY}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={cropConfig.offsetY}
              onChange={handleOffsetYChange}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              onClick={handleRotate}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Reset
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
          >
            <Check className="w-4 h-4" /> Apply Framing
          </button>
        </div>
      </div>
    </div>
  );
}
