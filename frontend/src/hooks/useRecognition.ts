import { useState, useCallback, useRef } from 'react';
import { signRecognitionService, type RecognitionResult } from '../services/signRecognition';

export function useRecognition() {
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [result, setResult] = useState<RecognitionResult>({
    detectedLetter: '-',
    expectedLetter: '-',
    confidence: 0,
    currentAnimation: 'Idle.anim',
    currentWord: '',
    recognizedSentence: '',
    status: 'Idle',
    handDetected: false,
    consecutiveFrames: 0,
    fps: 0,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecognition = useCallback(async (videoEl: HTMLVideoElement) => {
    videoRef.current = videoEl;
    setIsRecognizing(true);
    await signRecognitionService.start(videoEl, (res) => {
      setResult(res);
    });
  }, []);

  const stopRecognition = useCallback(() => {
    signRecognitionService.stop();
    setIsRecognizing(false);
  }, []);

  const clearSentence = useCallback(() => {
    signRecognitionService.clear();
    setResult((prev) => ({
      ...prev,
      detectedLetter: '-',
      expectedLetter: '-',
      confidence: 0,
      currentAnimation: 'Idle.anim',
      currentWord: '',
      recognizedSentence: '',
      consecutiveFrames: 0,
    }));
  }, []);

  const updateSentence = useCallback((newSentence: string) => {
    signRecognitionService.setSentence(newSentence);
    setResult((prev) => ({
      ...prev,
      recognizedSentence: newSentence,
    }));
  }, []);

  return {
    isRecognizing,
    result,
    startRecognition,
    stopRecognition,
    clearSentence,
    updateSentence,
  };
}
