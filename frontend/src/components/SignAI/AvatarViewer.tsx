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

    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = null;

    // Upright portrait camera framing centered on avatar head & torso
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 1.38, 1.85);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Three-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e5, 2.2);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-2.5, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // Dark Metallic Pedestal Stand Base
    const pedestalGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.22, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.8,
      roughness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.72;
    pedestalGroup.add(baseMesh);

    const topRingGeo = new THREE.TorusGeometry(0.38, 0.02, 16, 32);
    const topRingMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.9,
      roughness: 0.15,
    });
    const topRingMesh = new THREE.Mesh(topRingGeo, topRingMat);
    topRingMesh.rotation.x = Math.PI / 2;
    topRingMesh.position.y = -0.61;
    pedestalGroup.add(topRingMesh);

    scene.add(pedestalGroup);

    // Load 3D GLB Model (xbot / ybot) and apply smooth natural human character shading
    const engine = new AvatarAnimationEngine();
    engineRef.current = engine;

    const loader = new GLTFLoader();
    // Try xbot.glb first, fallback to avatar.glb
    const modelUrl = '/assets/xbot.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        const avatarObj = gltf.scene;
        avatarObj.position.set(0, -0.6, 0);
        avatarObj.scale.set(1.1, 1.1, 1.1);

        // Smooth human character skin and dark sweater materials
        const skinMat = new THREE.MeshStandardMaterial({
          color: 0xebaf95, // Warm natural skin tone
          roughness: 0.35,
          metalness: 0.02,
        });

        const sweaterMat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1f, // Deep charcoal black long-sleeve sweater
          roughness: 0.8,
          metalness: 0.05,
        });

        avatarObj.traverse((child) => {
          if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
            const mesh = child as THREE.SkinnedMesh;
            mesh.frustumCulled = false;

            const name = mesh.name.toLowerCase();
            if (name.includes('surface') || name.includes('skin') || name.includes('head')) {
              mesh.material = skinMat;
            } else {
              mesh.material = sweaterMat;
            }
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
        console.warn('xbot.glb load fallback:', err);
        // Fallback to avatar.glb
        loader.load('/assets/avatar.glb', (gltf2) => {
          const avatarObj = gltf2.scene;
          avatarObj.position.set(0, -0.6, 0);
          avatarObj.scale.set(1.1, 1.1, 1.1);
          scene.add(avatarObj);
          engine.setAvatar(avatarObj);
          setModelLoaded(true);
        });
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
      <div className="relative w-full flex-1 min-h-[300px] rounded-xl bg-gradient-to-b from-slate-200/60 via-slate-100/40 to-slate-200/80 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border border-slate-300/80 dark:border-neutral-800 overflow-hidden flex items-center justify-center shadow-inner">
        <div ref={mountRef} className="w-full h-full" />

        {!modelLoaded && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-xs font-semibold">Loading 3D Character Bust...</p>
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
