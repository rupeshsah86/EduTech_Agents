import React, { useState } from 'react';
import { WebcamComponent } from '../components/SignAI/Webcam';
import { RecognitionPanel } from '../components/SignAI/RecognitionPanel';
import { AvatarViewer } from '../components/SignAI/AvatarViewer';
import { ChatWindow } from '../components/SignAI/ChatWindow';
import type { ChatMessage } from '../components/SignAI/MessageBubble';
import { useRecognition } from '../hooks/useRecognition';
import { useSpeech } from '../hooks/useSpeech';
import { masterAIService } from '../services/masterAI';
import { Hand, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const SignAIPage: React.FC = () => {
  const {
    isRecognizing,
    result,
    startRecognition,
    stopRecognition,
    clearSentence,
  } = useRecognition();

  const { isMuted, isSpeaking, speak, toggleMute, replay } = useSpeech();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: 'Welcome to Sign Language AI Assistant! Sign your question using your webcam or type below. I will route your prompt to the specialized AI agent and answer in 3D Sign Language + Voice + Text!',
      agentName: 'Master AI Orchestrator',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      signSummary: 'HELLO WELCOME TO SIGN LANGUAGE AI',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeSignText, setActiveSignText] = useState<string>('');

  const handleSendToMasterAI = async (promptText: string) => {
    if (!promptText.trim() || isProcessing) return;

    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Route prompt through Master AI Router
    const agentRes = await masterAIService.routeQuery(promptText);

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: agentRes.text,
      agentName: agentRes.agentName,
      timestamp: agentRes.timestamp,
      signSummary: agentRes.signSummary,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsProcessing(false);

    // Play 3D Avatar Sign Language Animation for response
    setActiveSignText(agentRes.signSummary || agentRes.text);
  };

  const handlePlaySignAnimation = (signText: string) => {
    setActiveSignText(signText);
  };

  const handlePlayVoice = (text: string) => {
    speak(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 w-full min-h-screen font-sans">
      
      {/* ── Top Professional Header Banner ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 shrink-0">
            <Hand className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sign Language AI Tutor
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 font-bold text-[10px] uppercase tracking-wider">
                Deaf & Mute Accessibility
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
              Communicate using Sign Language. User signs → Master AI translates → Answers in 3D Sign + Voice + Text.
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400">
            <Zap className="w-3.5 h-3.5" />
            <span>9 AI Tutors Online</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WebGL 3D Avatar Ready</span>
          </div>
        </div>
      </div>

      {/* ── Main Dual Workspace Grid (Webcam + Telemetry Left, 3D Avatar Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Webcam & Integrated Sign Telemetry (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex-1">
            <WebcamComponent
              isRecognizing={isRecognizing}
              onStart={startRecognition}
              onStop={stopRecognition}
              onClear={clearSentence}
              handDetected={result.handDetected}
              boundingBox={result.boundingBox}
            />
          </div>

          {/* Integrated Telemetry Status Panel */}
          <RecognitionPanel
            result={result}
            onSendToMasterAI={handleSendToMasterAI}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Side: 3D GLB Sign Language Interpreter Avatar (6 cols) */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-[500px]">
          <AvatarViewer
            signText={activeSignText}
            autoPlay={true}
          />
        </div>
      </div>

      {/* ── Multi-Modal AI Conversation Workspace ──────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
            AI Multi-Modal Conversation Feed
          </h2>
        </div>

        <div className="w-full h-[460px]">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendToMasterAI}
            onPlaySignAnimation={handlePlaySignAnimation}
            onPlayVoice={handlePlayVoice}
            isMuted={isMuted}
            isSpeaking={isSpeaking}
            onToggleMute={toggleMute}
            onReplayVoice={replay}
            recognizedSentenceBuffer={result.recognizedSentence}
            isRecognizing={isRecognizing}
          />
        </div>
      </div>

    </div>
  );
};

