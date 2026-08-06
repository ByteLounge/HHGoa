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
  const [themeId, setThemeId] = useState<ThemeId>('hhgoa-editorial');
  const [cropConfig, setCropConfig] = useState<ImageCropConfig>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    resolution: '1080x1080',
    transparentBg: false,
    themeId: 'hhgoa-editorial',
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
      let fileToUpload = userFile;
      if (!fileToUpload && userImageUrl) {
        const res = await fetch(userImageUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], 'user-photo.png', { type: 'image/png' });
      }

      if (!fileToUpload) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0E6B3A';
          ctx.fillRect(0, 0, 400, 400);
          ctx.fillStyle = '#FFD400';
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

        const link = document.createElement('a');
        link.href = data.imageDataUrl;
        link.download = `HHGoa2026_${graphicType}_${data.id.slice(0, 8)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
    <div className="min-h-screen bg-[#0E6B3A] text-[#F7F1DF] flex flex-col font-editorial-mono antialiased">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Main Generator Studio Section */}
      <section id="generator" className="py-16 sm:py-28 relative z-10 bg-[#0E6B3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FFD400] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#FFD400]/20 border border-[#FFD400]/40 shadow-[2px_2px_0px_#0A4C2B]">
              ● LIVE GENERATOR STUDIO
            </span>
            <h2 className="font-editorial-serif font-bold text-4xl sm:text-6xl tracking-tight mt-4 text-[#F7F1DF] uppercase">
              Build Your Credentials
            </h2>
            <p className="text-base sm:text-lg text-[#F7F1DF]/90 mt-2 font-normal">
              Select pass format, upload photo, fill in details, and export 4K PNG.
            </p>
          </div>

          {/* Format Tabs Switcher */}
          <div className="flex justify-center mb-12">
            <div className="p-2 rounded-full bg-[#F7F1DF] border-2 border-[#0A4C2B] flex gap-2 max-w-md w-full shadow-[4px_4px_0px_#0A4C2B]">
              <button
                onClick={() => handleGraphicTypeChange('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-editorial-display font-bold text-sm transition-all min-h-[44px] cursor-pointer ${
                  graphicType === 'card'
                    ? 'bg-[#FF007A] text-white shadow-[2px_2px_0px_#0A4C2B] border-2 border-[#0A4C2B]'
                    : 'text-[#0A4C2B] hover:text-[#FF007A]'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Builder Pass
              </button>

              <button
                onClick={() => handleGraphicTypeChange('frame')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-editorial-display font-bold text-sm transition-all min-h-[44px] cursor-pointer ${
                  graphicType === 'frame'
                    ? 'bg-[#FF007A] text-white shadow-[2px_2px_0px_#0A4C2B] border-2 border-[#0A4C2B]'
                    : 'text-[#0A4C2B] hover:text-[#FF007A]'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Profile Frame
              </button>
            </div>
          </div>

          {/* Responsive Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Upload & Form Controls */}
            <div className="lg:col-span-6 space-y-6 bg-[#0E6B3A] p-6 sm:p-8 rounded-3xl border-2 border-[#1E5A3B] shadow-xl">
              <div className="flex items-center justify-between border-b-2 border-[#1E5A3B] pb-4">
                <h3 className="font-editorial-serif font-bold text-2xl text-[#F7F1DF] flex items-center gap-2 uppercase">
                  <Sparkles className="w-5 h-5 text-[#FFD400]" /> 1. Upload &amp; Customize
                </h3>
                {userImageUrl && (
                  <button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0A4C2B] bg-[#FFD400] px-3 py-1.5 rounded-full border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] hover:translate-x-0.5 transition-all cursor-pointer font-editorial-display uppercase"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust Crop
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
              <div className="bg-[#0E6B3A] p-6 sm:p-8 rounded-3xl border-2 border-[#1E5A3B] shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b-2 border-[#1E5A3B] pb-4">
                  <h3 className="font-editorial-serif font-bold text-2xl text-[#F7F1DF] uppercase">
                    2. Instant Live Preview
                  </h3>
                  <span className="text-xs font-bold text-[#0A4C2B] bg-[#FFD400] px-3 py-1 rounded-full border-2 border-[#0A4C2B] uppercase tracking-wider font-editorial-mono shadow-[2px_2px_0px_#0A4C2B]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A4C2B]/85 backdrop-blur-md animate-in fade-in font-editorial-mono">
          <div className="bg-[#F7F1DF] text-[#0A4C2B] border-3 border-[#0A4C2B] rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_#0A4C2B] text-center space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#0A4C2B] pb-3">
              <h3 className="font-editorial-serif font-bold text-xl text-[#0A4C2B] flex items-center gap-2 uppercase">
                <QrCode className="w-5 h-5 text-[#FF007A]" /> Pass QR Code
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 text-[#0A4C2B] hover:text-[#FF007A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#0A4C2B] shadow-inner flex items-center justify-center">
              <QrCode className="w-48 h-48 text-[#0A4C2B]" />
            </div>

            <p className="text-xs text-[#0E6B3A] font-bold">
              Scan QR code with mobile camera to open official builder pass link on your phone.
            </p>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-3 rounded-full btn-editorial-pink text-xs min-h-[44px] cursor-pointer"
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
