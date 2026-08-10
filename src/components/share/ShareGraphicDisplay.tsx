'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';

interface Props {
  id: string;
  initialSrc: string;
  altText: string;
}

export function ShareGraphicDisplay({ id, initialSrc, altText }: Props) {
  const [imgSrc, setImgSrc] = useState(initialSrc);

  useEffect(() => {
    setImgSrc(initialSrc);
    try {
      const recent = JSON.parse(localStorage.getItem('hhgoa_recent_graphics') || '[]');
      const match = recent.find((item: { id: string; imageDataUrl?: string }) => item.id === id);
      if (match && match.imageDataUrl) {
        setImgSrc(match.imageDataUrl);
      }
    } catch (err: unknown) {
      console.warn('Could not read recent graphics from localStorage:', err);
    }
  }, [id, initialSrc]);

  return (
    <img
      src={imgSrc}
      alt={altText}
      className="w-full h-full object-contain rounded-2xl"
    />
  );
}
