import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Play, Square, Trash2, Activity } from 'lucide-react';

interface WebcamProps {
  isRecognizing: boolean;
  onStart: (videoEl: HTMLVideoElement) => void;
  onStop: () => void;
  onClear: () => void;
  handDetected?: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export const WebcamComponent: React.FC<WebcamProps> = ({
  isRecognizing,
  onStart,
  onStop,
  onClear,
  handDetected,
  boundingBox,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');

  useEffect(() => {
    // List available video input devices
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devs) => {
        const videoDevs = devs.filter((d) => d.kind === 'videoinput');
        setDevices(videoDevs);
        if (videoDevs.length > 0) {
          setSelectedDeviceId(videoDevs[0].deviceId);
        }
      })
      .catch(() => {});

    startCamera();

    return () => {
      stopCameraStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async (deviceId?: string) => {
    stopCameraStream();
    setCameraError('');
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        if (isRecognizing) {
          onStart(videoRef.current);
        }
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions.');
      setCameraActive(false);
    }
  };

  const handleSwitchCamera = () => {
    if (devices.length <= 1) return;
    const currentIndex = devices.findIndex((d) => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDeviceId = devices[nextIndex].deviceId;
    setSelectedDeviceId(nextDeviceId);
    startCamera(nextDeviceId);
  };

  const handleToggleRecognition = () => {
    if (isRecognizing) {
      onStop();
    } else if (videoRef.current) {
      onStart(videoRef.current);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 h-full">
      {/* Live Camera Viewport Box */}
      <div className="relative w-full flex-1 min-h-[260px] aspect-video rounded-2xl bg-neutral-900 border-2 border-purple-500/30 dark:border-purple-500/40 shadow-xl overflow-hidden group">
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />

        {/* Camera Off Overlay */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <CameraOff className="w-12 h-12 mb-2 text-purple-400 animate-pulse" />
            <p className="text-sm font-semibold text-white">Camera Disconnected</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{cameraError || 'Click Start Recognition to activate webcam stream.'}</p>
            <button
              onClick={() => startCamera(selectedDeviceId)}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
          </div>
        )}

        {/* Top Status Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-md">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecognizing ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span>{isRecognizing ? 'Live Gesture Stream' : 'Camera Ready'}</span>
          </div>

          {isRecognizing && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold shadow-md animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              <span>Sign Recognition Active</span>
            </div>
          )}
        </div>

        {/* Simulated Hand Bounding Box Overlay */}
        {isRecognizing && handDetected && boundingBox && (
          <div
            className="absolute border-2 border-emerald-400 rounded-xl bg-emerald-500/10 pointer-events-none transition-all duration-300 flex items-start justify-end p-1.5"
            style={{
              left: `${(boundingBox.x / (videoRef.current?.videoWidth || 640)) * 100}%`,
              top: `${(boundingBox.y / (videoRef.current?.videoHeight || 480)) * 100}%`,
              width: `${(boundingBox.width / (videoRef.current?.videoWidth || 640)) * 100}%`,
              height: `${(boundingBox.height / (videoRef.current?.videoHeight || 480)) * 100}%`,
            }}
          >
            <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black uppercase shadow">
              Hand Tracked
            </span>
          </div>
        )}

        {/* Bottom Audio/Gesture Wave animation bar */}
        {isRecognizing && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 animate-pulse" />
        )}
      </div>

      {/* Camera & Recognition Controls Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => {
            if (cameraActive) {
              if (isRecognizing) onStop();
              stopCameraStream();
            } else {
              startCamera(selectedDeviceId);
            }
          }}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            cameraActive
              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}
          title={cameraActive ? "Turn Camera Feed OFF" : "Turn Camera Feed ON"}
        >
          {cameraActive ? (
            <>
              <CameraOff className="w-4 h-4 text-rose-500" />
              <span>Camera OFF</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-emerald-500" />
              <span>Camera ON</span>
            </>
          )}
        </button>

        <button
          onClick={handleToggleRecognition}
          disabled={!cameraActive}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40 ${
            isRecognizing
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
          }`}
        >
          {isRecognizing ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Pause Tracking</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Recognition</span>
            </>
          )}
        </button>

        <button
          onClick={onStop}
          disabled={!isRecognizing}
          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 border border-slate-200 dark:border-neutral-800"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Stop</span>
        </button>

        <button
          onClick={onClear}
          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-neutral-800"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
          <span>Clear</span>
        </button>

        <button
          onClick={handleSwitchCamera}
          disabled={devices.length <= 1 || !cameraActive}
          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 border border-slate-200 dark:border-neutral-800"
          title="Switch Camera Device"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
          <span>Switch</span>
        </button>
      </div>
    </div>
  );
};
