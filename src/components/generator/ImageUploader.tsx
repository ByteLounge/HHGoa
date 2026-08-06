'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, RefreshCw, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { validateImageFile } from '@/lib/validation';

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string, file: File) => void;
  currentImageName?: string;
}

export function ImageUploader({ onImageSelected, currentImageName }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process file upload (standard or HEIC)
  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const { valid, error: validationError } = validateImageFile(file);

      if (!valid) {
        setError(validationError || 'Invalid image file.');
        return;
      }

      const ext = file.name.split('.').pop()?.toLowerCase();
      const isHeic =
        ext === 'heic' ||
        ext === 'heif' ||
        file.type.includes('heic') ||
        file.type.includes('heif');

      if (isHeic) {
        setIsConvertingHeic(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/heic', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (data.success && data.convertedDataUrl) {
            onImageSelected(data.convertedDataUrl, file);
          } else {
            setError(data.error || 'Failed to convert HEIC image.');
          }
        } catch {
          setError('Error converting HEIC image. Please upload JPG or PNG.');
        } finally {
          setIsConvertingHeic(false);
        }
        return;
      }

      // Standard image processing (JPG, PNG, WEBP)
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string, file);
        }
      };
      reader.onerror = () => setError('Failed to read image file.');
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Paste support
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          processFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10 scale-[1.01] shadow-xl shadow-orange-500/10'
            : 'border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-white/[0.02] hover:border-orange-500/60 dark:hover:border-orange-500/60 hover:bg-orange-500/[0.02]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
        />

        {isConvertingHeic ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="font-extrabold text-slate-900 dark:text-white text-sm">
              Converting iPhone HEIC to high-res PNG...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preserving original photo clarity automatically</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 dark:from-orange-500/25 dark:to-amber-500/25 text-orange-500 flex items-center justify-center shadow-inner border border-orange-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                {currentImageName ? 'Choose Different Photo' : 'Upload Your Builder Photo'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Drag &amp; drop, paste from clipboard, or browse gallery
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                JPG
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                PNG
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                WEBP
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                HEIC
              </span>
              <span className="ml-1 text-slate-400">• Up to 15MB</span>
            </div>
          </div>
        )}
      </div>

      {currentImageName && !error && !isConvertingHeic && (
        <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="truncate font-bold">Photo Loaded: {currentImageName}</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-black underline hover:text-emerald-500 shrink-0 ml-2 cursor-pointer"
          >
            Change
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3.5 rounded-2xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
}
