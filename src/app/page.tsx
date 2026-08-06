'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Gallery } from '@/components/landing/Gallery';
import { FAQ } from '@/components/landing/FAQ';
import { ImageUploader } from '@/components/generator/ImageUploader';
import { PhotoEditorModal } from '@/components/generator/PhotoEditorModal';
import { FormControls } from '@/components/generator/FormControls';
import { ThemeSelector } from '@/components/generator/ThemeSelector';
import { FramePreview } from '@/components/generator/FramePreview';
import { CardPreview } from '@/components/generator/CardPreview';
import { ExportControls } from '@/components/generator/ExportControls';
import { RecentCards } from '@/components/generator/RecentCards';

import {
  BuilderInfo,
  ExportOptions,
  GraphicType,
  ImageCropConfig,
  ThemeId,
  GeneratedGraphicRecord,
} from '@/types';
import { DEFAULT_BUILDER_INFO } from '@/lib/constants';
import { generateBuilderTitle } from '@/lib/title-generator';
import { SlidersHorizontal, Image as ImageIcon, CreditCard, Sparkles, QrCode, X } from 'lucide-react';

export default function HomePage() {
  // State
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [builderInfo, setBuilderInfo] = useState<BuilderInfo>(DEFAULT_BUILDER_INFO);
  const [graphicType, setGraphicType] = useState<GraphicType>('card');
  const [themeId, setThemeId] = useState<ThemeId>('goa-sunset');
  const [cropConfig, setCropConfig] = useState<ImageCropConfig>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    resolution: '1080x1080',
    transparentBg: false,
    themeId: 'goa-sunset',
    graphicType: 'card',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Sync graphic type & themeId to exportOptions
  const handleGraphicTypeChange = (type: GraphicType) => {
    setGraphicType(type);
    setExportOptions((prev) => ({ ...prev, graphicType: type }));
  };

  const handleThemeChange = (tid: ThemeId) => {
    setThemeId(tid);
    setExportOptions((prev) => ({ ...prev, themeId: tid }));
  };

  // Image Upload handler
  const handleImageSelected = (dataUrl: string, file: File) => {
    setUserImageUrl(dataUrl);
    setUserFile(file);
  };

  // AI Title Shuffle
  const handleShuffleTitle = () => {
    const newTitle = generateBuilderTitle(builderInfo.role);
    setBuilderInfo((prev) => ({ ...prev, builderTitle: newTitle }));
  };

  // Generate & Download Handler via Sharp backend endpoint
  const handleGenerateAndDownload = async () => {
    setIsGenerating(true);
    try {
      // If user hasn't uploaded a file, create a canvas placeholder buffer
      let fileToUpload = userFile;
      if (!fileToUpload && userImageUrl) {
        const res = await fetch(userImageUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], 'user-photo.png', { type: 'image/png' });
      }

      if (!fileToUpload) {
        // Create 400x400 blank placeholder file if none provided
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, 400, 400);
          ctx.fillStyle = '#FF5500';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('HH GOA', 200, 200);
        }
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        fileToUpload = new File([blob], 'default-photo.png', { type: 'image/png' });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('builderInfo', JSON.stringify(builderInfo));
      formData.append('exportOptions', JSON.stringify(exportOptions));
      formData.append('cropConfig', JSON.stringify(cropConfig));

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate graphic');
      }

      const data = await response.json();

      if (data.success && data.imageDataUrl) {
        setGeneratedShareUrl(data.shareUrl);

        // Download trigger
        const link = document.createElement('a');
        link.href = data.imageDataUrl;
        link.download = `HHGoa2026_${graphicType}_${data.id.slice(0, 8)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Save to Recent Cards in localStorage
        try {
          const newRecord: GeneratedGraphicRecord = {
            id: data.id,
            type: graphicType,
            imageDataUrl: data.imageDataUrl,
            builderInfo,
            themeId,
            createdAt: new Date().toISOString(),
            shareUrl: data.shareUrl,
          };
          const existing: GeneratedGraphicRecord[] = JSON.parse(
            localStorage.getItem('hhgoa_recent_graphics') || '[]'
          );
          const updated = [
            newRecord,
            ...existing.filter((item) => item.id !== data.id),
          ].slice(0, 8);
          localStorage.setItem('hhgoa_recent_graphics', JSON.stringify(updated));
        } catch (err: unknown) {
          console.warn('Could not save to localStorage:', err);
        }
      }
    } catch (err: unknown) {
      console.error('Error generating asset:', err);
      alert('Error generating pass. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050811] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Main Generator Section */}
      <section id="generator" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Live Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Create Your HH Goa Graphic
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Select format, upload photo, fill in details, and download instant high-res PNG.
            </p>
          </div>

          {/* Format Tabs Header (Profile Frame vs Builder Pass) */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-2 max-w-md w-full">
              <button
                onClick={() => handleGraphicTypeChange('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  graphicType === 'card'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Builder Pass
              </button>

              <button
                onClick={() => handleGraphicTypeChange('frame')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  graphicType === 'frame'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Profile Frame
              </button>
            </div>
          </div>

          {/* Two-Column Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls & Upload */}
            <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" /> 1. Upload &amp; Customize
                </h3>
                {userImageUrl && (
                  <button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 transition-all"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust Photo Crop
                  </button>
                )}
              </div>

              {/* Upload Zone */}
              <ImageUploader
                onImageSelected={handleImageSelected}
                currentImageName={userFile?.name}
              />

              {/* Theme Selector */}
              <ThemeSelector selectedThemeId={themeId} onThemeSelect={handleThemeChange} />

              {/* Form Input Fields */}
              <FormControls
                builderInfo={builderInfo}
                onChange={setBuilderInfo}
                onGenerateAiTitle={handleShuffleTitle}
              />
            </div>

            {/* Right Column: Live Interactive Preview & Export Controls */}
            <div className="lg:col-span-6 space-y-6 sticky top-24">
              <div className="bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    2. Instant Live Preview
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ● Real-Time
                  </span>
                </div>

                {/* Render Frame or Card Preview */}
                {graphicType === 'frame' ? (
                  <FramePreview
                    userImageUrl={userImageUrl}
                    builderInfo={builderInfo}
                    themeId={themeId}
                    cropConfig={cropConfig}
                  />
                ) : (
                  <CardPreview
                    userImageUrl={userImageUrl}
                    builderInfo={builderInfo}
                    themeId={themeId}
                    cropConfig={cropConfig}
                  />
                )}

                {/* Export Options & Download */}
                <ExportControls
                  exportOptions={exportOptions}
                  onChangeOptions={setExportOptions}
                  onGenerateAndDownload={handleGenerateAndDownload}
                  isGenerating={isGenerating}
                  generatedShareUrl={generatedShareUrl}
                  onShowQrModal={() => setIsQrModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Recently Generated Cards Section */}
          <RecentCards />
        </div>
      </section>

      {/* Features & Gallery & FAQ */}
      <Features />
      <Gallery />
      <FAQ />

      {/* Fine-Tuning Photo Framing Modal */}
      {userImageUrl && (
        <PhotoEditorModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          cropConfig={cropConfig}
          onChange={setCropConfig}
          imageUrl={userImageUrl}
        />
      )}

      {/* QR Code Modal Popup */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-orange-500" /> Shareable Pass QR
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <QrCode className="w-48 h-48 text-slate-900" />
            </div>

            <p className="text-xs text-slate-500">
              Scan QR code with mobile camera to open official builder pass link directly on your phone.
            </p>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
