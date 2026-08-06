import { FrameTheme, ThemeId } from '@/types';

export const FRAME_THEMES: Record<ThemeId, FrameTheme> = {
  'goa-sunset': {
    id: 'goa-sunset',
    name: 'Goa Sunset',
    description: 'Vibrant tropical sunset orange and warm golden accents',
    primaryColor: '#FF5500',
    accentColor: '#FFB800',
    badgeBg: 'linear-gradient(135deg, #FF5500 0%, #FF8C00 100%)',
    cardBg: '#0F172A',
    textColor: '#FFFFFF',
    subtextColor: '#94A3B8',
    borderStyle: 'border-orange-500/30',
  },
  'deep-navy': {
    id: 'deep-navy',
    name: 'Deep Navy',
    description: 'Sleek minimalist conference styling with silver typography',
    primaryColor: '#38BDF8',
    accentColor: '#818CF8',
    badgeBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    cardBg: '#0B0F19',
    textColor: '#F8FAFC',
    subtextColor: '#64748B',
    borderStyle: 'border-slate-700/50',
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Violet',
    description: 'High-tech developer neon glow with electric indigo highlights',
    primaryColor: '#8B5CF6',
    accentColor: '#EC4899',
    badgeBg: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    cardBg: '#090514',
    textColor: '#F3E8FF',
    subtextColor: '#A78BFA',
    borderStyle: 'border-purple-500/30',
  },
  'vip-gold': {
    id: 'vip-gold',
    name: 'VIP Gold',
    description: 'Exclusive pass trim with gold foil and polished finish',
    primaryColor: '#F59E0B',
    accentColor: '#FCD34D',
    badgeBg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    cardBg: '#18130B',
    textColor: '#FFFBEB',
    subtextColor: '#FCD34D',
    borderStyle: 'border-amber-500/40',
  },
};

export const DEFAULT_BUILDER_INFO = {
  name: 'Alex Rivera',
  role: 'Full Stack Engineer',
  company: 'NextGen AI Lab',
  college: 'IIT Goa',
  location: 'Goa, India',
  builderTitle: 'The AI Architect',
  customHashtag: '#FrameInGoa',
};

export const SUGGESTED_TITLES = [
  'The AI Architect',
  'Frontend Wizard',
  'Cloud Explorer',
  'Shipping Machine',
  'Prompt Engineer',
  'Bug Hunter',
  'Pixel Crafter',
  'Backend Alchemist',
  'React Ninja',
  'Data Explorer',
  'Rust Magician',
  'Full Stack Overlord',
  'Agentic Systems Pioneer',
  'Goa Hackathon Voyager',
  'GPU Whisperer',
  'Distributed Systems Guru',
  'LLM Engineer',
  'Zero-Bug Zealot',
];

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
