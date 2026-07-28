// Web SpeechSynthesis service wrapper

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speak(text: string, options: SpeechOptions = {}, onEnd?: () => void, onError?: () => void): void {
    if (!this.synth || this.isMuted || !text.trim()) return;

    this.stop(); // Stop any ongoing speech
    this.lastSpokenText = text;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    const voices = this.getVoices();
    if (options.voiceName) {
      const selected = voices.find((v) => v.name === options.voiceName);
      if (selected) utterance.voice = selected;
    } else {
      // Pick a natural English voice if available
      const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public replay(options: SpeechOptions = {}, onEnd?: () => void): void {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, options, onEnd);
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    return this.currentUtterance !== null || (this.synth ? this.synth.speaking : false);
  }
}

export const speechService = new SpeechService();
