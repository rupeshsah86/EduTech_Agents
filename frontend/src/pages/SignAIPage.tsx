import React, { useState } from 'react';
import { WebcamComponent } from '../components/SignAI/Webcam';
import { RecognitionPanel } from '../components/SignAI/RecognitionPanel';
import { AvatarViewer } from '../components/SignAI/AvatarViewer';
import { ChatWindow } from '../components/SignAI/ChatWindow';
import type { ChatMessage } from '../components/SignAI/MessageBubble';
import { useRecognition } from '../hooks/useRecognition';
import { useSpeech } from '../hooks/useSpeech';
import { masterAIService } from '../services/masterAI';
import { Hand, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 w-full min-h-screen">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-purple-600/10 to-indigo-600/10 border border-purple-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
            <Hand className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Sign Language AI Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] uppercase tracking-wider">
                Deaf & Mute Accessibility
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
              Communicate using Sign Language. User signs → AI understands → Answers in 3D Sign + Voice + Text.
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs text-purple-600 dark:text-purple-400">
            <Zap className="w-3.5 h-3.5" />
            <span>9 AI Agents Connected</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real-Time WebGL Avatar</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Webcam & Live Telemetry Panel & 3D Avatar (Equal Height Baseline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:min-h-[520px]">
        {/* Left: Large Webcam Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <WebcamComponent
            isRecognizing={isRecognizing}
            onStart={startRecognition}
            onStop={stopRecognition}
            onClear={clearSentence}
            handDetected={result.handDetected}
            boundingBox={result.boundingBox}
          />
        </div>

        {/* Center: Live Sign Telemetry & Classification (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <RecognitionPanel
            result={result}
            onSendToMasterAI={handleSendToMasterAI}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right: 3D GLB Sign Language Avatar (3 cols) */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <AvatarViewer
            signText={activeSignText}
            autoPlay={true}
          />
        </div>
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
        <span className="px-3.5 py-1 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-extrabold text-slate-600 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
          <Hand className="w-3.5 h-3.5 text-purple-500" /> AI Workspace & Conversation History
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
      </div>

      {/* Bottom Area: ChatGPT Style Interactive Chat Window */}
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
  );
};
