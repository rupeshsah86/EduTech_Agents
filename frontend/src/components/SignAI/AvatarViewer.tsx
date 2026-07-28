import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

// @ts-ignore
import * as alphabets from '../../services/animations/alphabets';
// @ts-ignore
import * as words from '../../services/animations/words';
// @ts-ignore
import { defaultPose } from '../../services/animations/defaultPose';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

// Hear_Aid uses "mixamorigRightArm" (no colon)
// Soldier.glb uses "mixamorig:RightArm" (with colon)
// We normalize by building an alias map and using a bone lookup that checks both.
function getBone(avatar: THREE.Object3D, name: string): THREE.Object3D | undefined {
  // Try exact name first
  let obj = avatar.getObjectByName(name);
  if (obj) return obj;
  // Hear_Aid name format: "mixamorigRightArm"  → try "mixamorig:RightArm"
  if (name.startsWith('mixamorig') && !name.includes(':')) {
    const colonName = 'mixamorig:' + name.slice('mixamorig'.length);
    obj = avatar.getObjectByName(colonName);
    if (obj) return obj;
  }
  return undefined;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
  signText = '',
  autoPlay = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const refObj = useRef<any>({
    flag: false,
    pending: false,
    animations: [],
    characters: [],
    avatar: null,
    speed: 0.1,
    pause: 700,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeSign, setActiveSign] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);
  const rafRef = useRef<number | null>(null);
  const runSignRef = useRef<(txt: string) => void>(() => {});

  // ── Scene Setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const ref = refObj.current;
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const w = el.clientWidth || 400;
    const h = el.clientHeight || 520;

    // Camera: same settings as Hear_Aid Convert.js (y=1.4, z=1.6, FOV=30)
    // Shows head + full upper body including hands
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000);
    camera.position.set(0, 1.4, 1.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.innerHTML = '';
    el.appendChild(renderer.domElement);

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.DirectionalLight(0xfff0e0, 2.5);
    key.position.set(2, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde8ff, 1.2);
    fill.position.set(-3, 3, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(0, 5, -3);
    scene.add(rim);

    // Load Soldier.glb – real human character with full finger bones
    const loader = new GLTFLoader();
    loader.load(
      '/assets/Soldier.glb',
      (gltf) => {
        const avatarScene = gltf.scene;

        // Disable frustum culling (critical – same as Hear_Aid)
        avatarScene.traverse((child: any) => {
          if (child.isSkinnedMesh) {
            child.frustumCulled = false;
            // Make the visor/helmet transparent so face is visible
            if (child.name === 'vanguard_visor' && child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.transparent = true;
              mat.opacity = 0;
            }
          }
        });

        ref.avatar = avatarScene;
        scene.add(avatarScene);

        // Apply default pose (arms spread for signing)
        applyDefaultPoseToSoldier(ref);

        setModelReady(true);
      },
      undefined,
      () => setModelError(true)
    );

    // Render loop
    const renderLoop = () => {
      rafRef.current = requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
    };
    renderLoop();

    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default pose for Soldier.glb (arms held up for signing)
  const applyDefaultPoseToSoldier = (ref: any) => {
    if (!ref.avatar) return;
    const poseMap: Record<string, [number, number, number]> = {
      'mixamorig:Neck':        [Math.PI / 12, 0, 0],
      'mixamorig:LeftArm':     [0, 0, -Math.PI / 3],
      'mixamorig:LeftForeArm': [0, -Math.PI / 1.5, 0],
      'mixamorig:RightArm':    [0, 0, Math.PI / 3],
      'mixamorig:RightForeArm':[0, Math.PI / 1.5, 0],
    };
    Object.entries(poseMap).forEach(([boneName, [x, y, z]]) => {
      const bone = ref.avatar.getObjectByName(boneName);
      if (bone) bone.rotation.set(x, y, z);
    });
  };

  // ── Animation Engine (mirrors Hear_Aid ref.animate exactly, with bone alias) ──
  useEffect(() => {
    const ref = refObj.current;

    ref.animate = () => {
      if (!ref.animations.length) {
        ref.pending = false;
        return;
      }
      requestAnimationFrame(ref.animate);

      if (ref.animations[0].length) {
        if (!ref.flag) {
          if (ref.animations[0][0] === 'add-text') {
            setActiveSign(ref.animations[0][1]);
            ref.animations.shift();
          } else {
            for (let i = 0; i < ref.animations[0].length;) {
              const [bn, ac, ax, lim, sg] = ref.animations[0][i];
              // Use alias-aware bone lookup
              const bone = ref.avatar ? getBone(ref.avatar, bn) : null;
              if (!bone) { ref.animations[0].splice(i, 1); continue; }
              const target = (bone as any)[ac];
              if (!target) { ref.animations[0].splice(i, 1); continue; }
              if (sg === '+' && target[ax] < lim) {
                target[ax] = Math.min(target[ax] + ref.speed, lim);
                i++;
              } else if (sg === '-' && target[ax] > lim) {
                target[ax] = Math.max(target[ax] - ref.speed, lim);
                i++;
              } else {
                ref.animations[0].splice(i, 1);
              }
            }
          }
        }
      } else {
        ref.flag = true;
        setTimeout(() => { ref.flag = false; }, ref.pause);
        ref.animations.shift();
      }
    };

    // Sign playback function
    runSignRef.current = (str: string) => {
      if (!str || !str.trim() || !ref.avatar) return;
      setActiveSign('');
      ref.animations = [];
      ref.characters = [];

      const wordsArr = str.trim().toUpperCase().split(/\s+/).filter(Boolean);
      wordsArr.forEach((word: string, wi: number) => {
        const isLast = wi === wordsArr.length - 1;
        if ((words as any)[word]) {
          (words as any)[word](ref);
          ref.animations.push(['add-text', isLast ? word : word + ' ']);
        } else {
          word.split('').forEach((ch: string, ci: number) => {
            const isLastCh = ci === word.length - 1;
            const numMap: Record<string, string> = {
              '0': 'ZERO', '1': 'ONE', '2': 'TWO', '3': 'THREE_NUM',
              '4': 'FOUR', '5': 'FIVE', '6': 'SIX', '7': 'SEVEN',
              '8': 'EIGHT', '9': 'NINE',
            };
            const key = numMap[ch] || ch;
            if ((alphabets as any)[key]) (alphabets as any)[key](ref);
            ref.animations.push(['add-text', isLastCh && !isLast ? ch + ' ' : ch]);
          });
        }
      });

      if (!ref.pending) {
        ref.pending = true;
        ref.animate();
      }
    };
  }, []);

  // React to signText prop
  useEffect(() => {
    if (signText && modelReady && autoPlay) {
      runSignRef.current(signText);
      setIsPlaying(true);
    }
  }, [signText, modelReady, autoPlay]);

  const handlePlay = () => {
    if (signText) { runSignRef.current(signText); setIsPlaying(true); }
  };

  const resetDefaultPose = (ref: any) => {
    if (!ref.avatar) return;
    const poseMap: Record<string, [number, number, number]> = {
      'mixamorig:Neck':        [Math.PI / 12, 0, 0],
      'mixamorig:LeftArm':     [0, 0, -Math.PI / 3],
      'mixamorig:LeftForeArm': [0, -Math.PI / 1.5, 0],
      'mixamorig:RightArm':    [0, 0, Math.PI / 3],
      'mixamorig:RightForeArm':[0, Math.PI / 1.5, 0],
    };
    Object.entries(poseMap).forEach(([boneName, [x, y, z]]) => {
      const bone = ref.avatar.getObjectByName(boneName);
      if (bone) bone.rotation.set(x, y, z);
    });
  };

  const handlePause = () => {
    const ref = refObj.current;
    ref.animations = [];
    ref.pending = false;
    ref.flag = false;
    setIsPlaying(false);
    setActiveSign('');
    resetDefaultPose(ref);
  };

  const handleReplay = () => {
    if (signText) { runSignRef.current(signText); setIsPlaying(true); }
  };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    refObj.current.speed = 0.1 * s;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤟</span>
          <span className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Sign Language Avatar</span>
        </div>
        {activeSign && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signing</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-mono font-extrabold text-xs animate-pulse shadow-md shadow-purple-400/30">
              {activeSign}
            </span>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1 min-h-[420px] bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div ref={mountRef} className="w-full h-full" />

        {!modelReady && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600 dark:text-neutral-300">Loading Human Avatar...</p>
          </div>
        )}

        {modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-semibold text-red-500">Avatar model failed to load</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button onClick={handlePause} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-400/20">
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
            </button>
          ) : (
            <button onClick={handlePlay} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-400/20">
              <Play className="w-3.5 h-3.5 fill-current" /> Play
            </button>
          )}
          <button onClick={handleReplay} className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300 transition-all cursor-pointer" title="Replay">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950 p-1 rounded-xl border border-slate-200 dark:border-neutral-800">
          <FastForward className="w-3 h-3 text-slate-400 ml-1" />
          {[0.5, 1.0, 1.5, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-purple-600'
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
