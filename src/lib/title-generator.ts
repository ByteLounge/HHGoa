import { SUGGESTED_TITLES } from './constants';

const KEYWORD_TITLES: Record<string, string[]> = {
  ai: ['The AI Architect', 'Prompt Engineer', 'LLM Whisperer', 'Neural Mastermind', 'Agentic Systems Pioneer'],
  ml: ['Data Explorer', 'Model Fine-Tuner', 'GPU Whisperer', 'Neural Explorer'],
  frontend: ['Frontend Wizard', 'Pixel Crafter', 'CSS Artisan', 'UI/UX Magician'],
  react: ['React Ninja', 'Component Craftsman', 'Virtual DOM Virtuoso'],
  next: ['App Router Maestro', 'Server Action Overlord', 'Vercel Voyager'],
  backend: ['Backend Alchemist', 'Distributed Systems Guru', 'API Architect', 'Database Overlord'],
  cloud: ['Cloud Explorer', 'Kubernetes Voyager', 'Infrastructure Wizard'],
  fullstack: ['Shipping Machine', 'Full Stack Overlord', 'End-to-End Architect'],
  mobile: ['Swift Scholar', 'Flutter Artisan', 'Mobile Maverick'],
  devops: ['CI/CD Whisperer', 'Pipeline Architect', 'Zero-Downtime Hero'],
  security: ['Bug Hunter', 'Crypto Scholar', 'Zero-Trust Sentinel'],
  rust: ['Memory Safety Zealot', 'Rust Magician', 'Fearless Concurrency Master'],
  python: ['Pythonic Sage', 'Scripting Wizard', 'Data Alchemist'],
};

export function generateBuilderTitle(role: string = '', userSeed?: number): string {
  const cleanRole = role.toLowerCase().trim();

  // Look for matching keywords
  for (const [key, titles] of Object.entries(KEYWORD_TITLES)) {
    if (cleanRole.includes(key)) {
      const idx = userSeed !== undefined 
        ? userSeed % titles.length 
        : Math.floor(Math.random() * titles.length);
      return titles[idx];
    }
  }

  // Fallback to random or seeded selection from SUGGESTED_TITLES
  const randomIndex = userSeed !== undefined 
    ? userSeed % SUGGESTED_TITLES.length 
    : Math.floor(Math.random() * SUGGESTED_TITLES.length);

  return SUGGESTED_TITLES[randomIndex];
}

export function getAllTitleSuggestions(role: string = ''): string[] {
  const cleanRole = role.toLowerCase().trim();
  const matched: string[] = [];

  for (const [key, titles] of Object.entries(KEYWORD_TITLES)) {
    if (cleanRole.includes(key)) {
      matched.push(...titles);
    }
  }

  // Combine matched with suggested titles, maintaining uniqueness
  const combined = Array.from(new Set([...matched, ...SUGGESTED_TITLES]));
  return combined;
}
