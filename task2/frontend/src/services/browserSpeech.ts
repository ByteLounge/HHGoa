// Browser Speech Recognition Abstraction (Zero-API cost default provider)

export interface BrowserSpeechCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class BrowserSpeechProvider {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(callbacks: BrowserSpeechCallbacks, lang: string = 'en-IN'): boolean {
    if (!this.recognition) {
      if (callbacks.onError) {
        callbacks.onError('Browser Speech Recognition is not supported in this browser.');
      }
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    try {
      this.recognition.lang = lang || 'en-IN';
      this.recognition.onstart = () => {
        this.isListening = true;
        if (callbacks.onStart) callbacks.onStart();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);

        if (callbacks.onResult) {
          callbacks.onResult(currentTranscript, isFinal);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let errMsg = 'Speech recognition error';
        if (event.error === 'not-allowed') {
          errMsg = 'Microphone access denied. Please check browser permissions.';
        } else if (event.error === 'no-speech') {
          errMsg = 'No speech detected. Please speak louder or check your mic.';
        } else if (event.error === 'network') {
          errMsg = 'Network error during browser speech recognition.';
        } else if (event.error) {
          errMsg = `Browser speech error: ${event.error}`;
        }

        if (callbacks.onError) callbacks.onError(errMsg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (callbacks.onEnd) callbacks.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (callbacks.onError) {
        callbacks.onError(`Failed to start speech recognition: ${err.message || err}`);
      }
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
      this.isListening = false;
    }
  }
}
