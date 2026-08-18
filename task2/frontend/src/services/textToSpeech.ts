// Browser Speech Synthesis (Text-To-Speech / TTS Engine)

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class TextToSpeechService {
  private static instance: TextToSpeechService;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public isPlaying(): boolean {
    return this.isSpeakingState && (this.synth?.speaking ?? false);
  }

  /**
   * Clean markdown formatting, bracket citations like [1], asterisks, and technical symbols
   * so speech sounds clear, natural, and conversational.
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      // Remove bracket citations e.g. [1], [2], [1, 2]
      .replace(/\[\s*\d+\s*(?:,\s*\d+\s*)*\]/g, '')
      // Remove markdown bold/italics asterisks and underscores
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove markdown headers
      .replace(/^#+\s+/gm, '')
      // Remove inline code ticks
      .replace(/`([^`]+)`/g, '$1')
      // Clean duplicate whitespace and newlines
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(text: string, options: TTSOptions = {}): boolean {
    if (!this.synth) {
      if (options.onError) options.onError('SpeechSynthesis not supported in this browser.');
      return false;
    }

    // Stop any existing speech playback
    this.stop();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options.rate ?? 1.05; // Slightly faster, natural pacing
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang ?? 'en-IN';

      // Pick the best natural voice available (preferably English Indian / US / UK)
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(
          (v) =>
            (v.lang === 'en-IN' || v.lang === 'en-US' || v.lang === 'en-GB') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Samantha'))
        ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (event) => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        if (options.onError) options.onError(event);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.warn('[TTS Error]', err);
      this.isSpeakingState = false;
      if (options.onError) options.onError(err);
      return false;
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignored
      }
    }
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }
}

export const ttsService = TextToSpeechService.getInstance();
