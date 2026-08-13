'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full space-y-3 font-editorial-mono">
      {/* Large Cream Upload Panel */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-3 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all duration-200 bg-[#F7F1DF] text-[#0A4C2B] shadow-[6px_6px_0px_#0A4C2B] ${
          isDragging
            ? 'border-[#FF007A] bg-[#FFFBEB] scale-[1.01] shadow-[8px_8px_0px_#0A4C2B]'
            : 'border-[#FF007A] hover:border-[#0E6B3A] hover:bg-[#FFFDF5]'
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
            <RefreshCw className="w-10 h-10 text-[#FF007A] animate-spin" />
            <p className="font-bold text-[#0A4C2B] text-sm">
              Converting iPhone HEIC photo...
            </p>
            <p className="text-xs text-[#0E6B3A]">Optimizing image clarity automatically</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Yellow Upload Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center shadow-[3px_3px_0px_#0A4C2B]">
              <Upload className="w-8 h-8 text-[#0A4C2B]" />
            </div>

            <div>
              <p className="font-editorial-serif font-bold text-2xl text-[#0A4C2B]">
                {currentImageName ? 'REPLACE BUILDER PHOTO' : 'UPLOAD YOUR PHOTO'}
              </p>
              <p className="text-xs sm:text-sm text-[#0E6B3A] mt-1 font-medium">
                Drag &amp; drop, paste from clipboard, or tap to choose photo
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-bold text-[#0A4C2B] uppercase tracking-wider">
              <span className="px-2.5 py-1 rounded-md bg-[#FFD400] border border-[#0A4C2B]">
                JPG
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFD400] border border-[#0A4C2B]">
                PNG
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFD400] border border-[#0A4C2B]">
                WEBP
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFD400] border border-[#0A4C2B]">
                HEIC
              </span>
              <span className="text-[#0E6B3A]">• Max 15MB</span>
            </div>
          </div>
        )}
      </div>

      {currentImageName && !error && !isConvertingHeic && (
        <div className="flex items-center justify-between text-xs text-[#0A4C2B] bg-[#FFD400] border-2 border-[#0A4C2B] px-4 py-3 rounded-2xl shadow-[3px_3px_0px_#0A4C2B]">
          <div className="flex items-center gap-2 truncate font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF007A]" />
            <span className="truncate">Loaded: {currentImageName}</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-black underline hover:text-[#FF007A] shrink-0 ml-2 cursor-pointer uppercase tracking-wider"
          >
            Change
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-white bg-[#FF007A] border-2 border-[#0A4C2B] p-3.5 rounded-2xl shadow-[3px_3px_0px_#0A4C2B]">
          <AlertCircle className="w-4 h-4 shrink-0 text-white" />
          <span className="font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}
