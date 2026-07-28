import { useState, useCallback, useEffect } from 'react';
import { speechService, type SpeechOptions } from '../services/speech';

export function useSpeech() {
  const [isMuted, setIsMuted] = useState<boolean>(() => speechService.getMuted());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      setIsSpeaking(speechService.isSpeaking());
    }, 200);
    return () => clearInterval(checkInterval);
  }, []);

  const speak = useCallback((text: string, options?: SpeechOptions, onEnd?: () => void) => {
    speechService.speak(
      text,
      options,
      () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      },
      () => {
        setIsSpeaking(false);
      }
    );
    setIsSpeaking(true);
  }, []);

  const toggleMute = useCallback(() => {
    const nextMute = !isMuted;
    speechService.setMuted(nextMute);
    setIsMuted(nextMute);
  }, [isMuted]);

  const replay = useCallback((options?: SpeechOptions, onEnd?: () => void) => {
    speechService.replay(options, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
    setIsSpeaking(true);
  }, []);

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  return {
    isMuted,
    isSpeaking,
    speak,
    toggleMute,
    replay,
    stop,
  };
}
