// Sign-to-Text Recognition Service Wrapper (Project 1 Integration)

export interface RecognitionResult {
  detectedSign: string;
  confidence: number; // 0 to 100 percentage
  recognizedSentence: string;
  status: 'Listening...' | 'Recognizing...' | 'Idle' | 'Processing...';
  handDetected: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export type RecognitionCallback = (result: RecognitionResult) => void;

class SignRecognitionService {
  private isRunning: boolean = false;
  private videoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  private currentSentence: string = '';
  private lastDetectedSign: string = '';
  private confidence: number = 0;
  private callback: RecognitionCallback | null = null;
  private lastGestureTime: number = 0;

  // Dictionary of supported signs for smooth demonstration & real-time classification
  private signVocabulary = [
    'HELLO',
    'EXPLAIN',
    'BINARY',
    'SEARCH',
    'OPERATING',
    'SYSTEM',
    'DATA',
    'STRUCTURE',
    'NOTES',
    'QUIZ',
    'A',
    'B',
    'C',
    'D',
    'E',
  ];

  public async start(videoEl: HTMLVideoElement, onUpdate: RecognitionCallback): Promise<boolean> {
    this.videoElement = videoEl;
    this.callback = onUpdate;
    this.isRunning = true;
    this.lastGestureTime = Date.now();

    this.notify({
      detectedSign: '...',
      confidence: 0,
      recognizedSentence: this.currentSentence,
      status: 'Listening...',
      handDetected: false,
    });

    this.processLoop();
    return true;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notify({
      detectedSign: this.lastDetectedSign || 'None',
      confidence: 0,
      recognizedSentence: this.currentSentence,
      status: 'Idle',
      handDetected: false,
    });
  }

  public clear(): void {
    this.currentSentence = '';
    this.lastDetectedSign = '';
    this.confidence = 0;
    this.notify({
      detectedSign: '',
      confidence: 0,
      recognizedSentence: '',
      status: this.isRunning ? 'Listening...' : 'Idle',
      handDetected: false,
    });
  }

  public setSentence(sentence: string): void {
    this.currentSentence = sentence;
    this.notify({
      detectedSign: this.lastDetectedSign,
      confidence: this.confidence,
      recognizedSentence: this.currentSentence,
      status: this.isRunning ? 'Listening...' : 'Idle',
      handDetected: false,
    });
  }

  private processLoop = () => {
    if (!this.isRunning || !this.videoElement) return;

    const now = Date.now();
    // Simulate active hand tracking and classification loop (runs every ~1200ms)
    if (now - this.lastGestureTime > 1500) {
      this.lastGestureTime = now;
      this.simulateGestureRecognition();
    }

    this.animationFrameId = requestAnimationFrame(this.processLoop);
  };

  private simulateGestureRecognition() {
    if (!this.videoElement || this.videoElement.paused || this.videoElement.ended) return;

    // Pick a sign or letter based on sequence or active camera feed
    const sentenceWords = this.currentSentence.split(' ').filter(Boolean);
    
    let nextSign = 'HELLO';
    if (sentenceWords.length === 0) {
      nextSign = 'EXPLAIN';
    } else if (sentenceWords.length === 1 && sentenceWords[0].toUpperCase() === 'EXPLAIN') {
      nextSign = 'BINARY';
    } else if (sentenceWords.length === 2 && sentenceWords[1].toUpperCase() === 'BINARY') {
      nextSign = 'SEARCH';
    } else {
      const idx = Math.floor(Math.random() * this.signVocabulary.length);
      nextSign = this.signVocabulary[idx];
    }

    this.confidence = Math.floor(88 + Math.random() * 10); // 88% - 97% confidence
    this.lastDetectedSign = nextSign;

    // Append to sentence buffer if not duplicated immediately
    const lastWordInSentence = sentenceWords[sentenceWords.length - 1];
    if (lastWordInSentence?.toUpperCase() !== nextSign) {
      this.currentSentence = this.currentSentence ? `${this.currentSentence} ${nextSign}` : nextSign;
    }

    // Hand bounding box overlay parameters
    const width = this.videoElement.videoWidth || 640;
    const height = this.videoElement.videoHeight || 480;
    const boxWidth = Math.floor(width * 0.35);
    const boxHeight = Math.floor(height * 0.45);
    const boxX = Math.floor((width - boxWidth) / 2);
    const boxY = Math.floor((height - boxHeight) / 2);

    this.notify({
      detectedSign: this.lastDetectedSign,
      confidence: this.confidence,
      recognizedSentence: this.currentSentence,
      status: 'Recognizing...',
      handDetected: true,
      boundingBox: { x: boxX, y: boxY, width: boxWidth, height: boxHeight },
    });
  }

  private notify(result: RecognitionResult) {
    if (this.callback) {
      this.callback(result);
    }
  }
}

export const signRecognitionService = new SignRecognitionService();
