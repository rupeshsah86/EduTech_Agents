import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AvatarAnimationEngine } from '../../services/signAvatar';
import { Play, Pause, RotateCcw, FastForward, UserCheck, Sparkles } from 'lucide-react';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({ signText = '', autoPlay = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<AvatarAnimationEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeSignChunk, setActiveSignChunk] = useState<string>('');
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene, camera, renderer
    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa855f7, 2.0); // Purple glow accent
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight2.position.set(-2, 2, -2);
    scene.add(dirLight2);

    // Load GLB Avatar
    const engine = new AvatarAnimationEngine();
    engineRef.current = engine;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/avatar.glb',
      (gltf) => {
        const avatarObj = gltf.scene;
        avatarObj.position.set(0, -0.6, 0);
        avatarObj.scale.set(1.1, 1.1, 1.1);

        avatarObj.traverse((child) => {
          if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
            child.frustumCulled = false;
          }
        });

        scene.add(avatarObj);
        engine.setAvatar(avatarObj);
        setModelLoaded(true);

        if (signText && autoPlay) {
          engine.playSentence(signText, (chunk) => setActiveSignChunk(chunk));
          setIsPlaying(true);
        }
      },
      undefined,
      (err) => {
        console.warn('GLB Avatar load error fallback:', err);
      }
    );

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (engineRef.current) {
        engineRef.current.updateIdleBreathing(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play animation when signText prop updates
  useEffect(() => {
    if (signText && engineRef.current && modelLoaded) {
      engineRef.current.playSentence(signText, (chunk) => setActiveSignChunk(chunk));
      setIsPlaying(true);
    }
  }, [signText, modelLoaded]);

  const handleTogglePlay = () => {
    if (!engineRef.current) return;
    const nextPause = !isPlaying;
    engineRef.current.setPaused(!nextPause);
    setIsPlaying(nextPause);
  };

  const handleReplay = () => {
    if (!engineRef.current || !signText) return;
    engineRef.current.playSentence(signText, (chunk) => setActiveSignChunk(chunk));
    setIsPlaying(true);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (engineRef.current) {
      engineRef.current.setSpeed(newSpeed);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between h-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">3D Sign Language Avatar</h3>
        </div>
        {activeSignChunk && (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-extrabold text-[11px] animate-pulse">
            Signing: {activeSignChunk}
          </span>
        )}
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full flex-1 min-h-[300px] rounded-xl bg-gradient-to-b from-purple-500/5 via-transparent to-purple-500/10 border border-purple-500/20 overflow-hidden flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />

        {!modelLoaded && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-xs font-semibold">Initializing 3D Human Avatar...</p>
          </div>
        )}
      </div>

      {/* Playback Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md cursor-pointer"
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 transition-all cursor-pointer"
            title="Replay Sign Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950 p-1 rounded-xl border border-slate-200 dark:border-neutral-800">
          <FastForward className="w-3 h-3 text-slate-400 ml-1" />
          {[0.5, 1.0, 1.5, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-purple-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
