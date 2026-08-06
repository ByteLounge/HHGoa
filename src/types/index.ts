export type GraphicType = 'frame' | 'card';

export type ExportResolution = '1080x1080' | '2048x2048';

export interface BuilderInfo {
  name: string;
  role: string;
  company?: string;
  college?: string;
  location?: string;
  builderTitle: string;
  customHashtag?: string;
}

export type ThemeId =
  | 'hhgoa-vibrant'
  | 'neon-green'
  | 'cyber-pink'
  | 'electric-yellow'
  | 'goa-sunset'
  | 'deep-navy'
  | 'cyber-neon'
  | 'vip-gold';

export interface FrameTheme {
  id: ThemeId;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  borderStyle: string;
}

export interface ImageCropConfig {
  zoom: number; // 1 to 3
  offsetX: number; // -100 to 100
  offsetY: number; // -100 to 100
  rotation: number; // 0, 90, 180, 270
}

export interface ExportOptions {
  resolution: ExportResolution;
  transparentBg: boolean;
  themeId: ThemeId;
  graphicType: GraphicType;
}

export interface GeneratedGraphicRecord {
  id: string;
  type: GraphicType;
  imageDataUrl: string;
  builderInfo: BuilderInfo;
  themeId: ThemeId;
  createdAt: string;
  shareUrl: string;
}
