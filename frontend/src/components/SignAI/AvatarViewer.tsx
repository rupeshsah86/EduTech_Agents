import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

// ─── Internal Hear_Aid-compatible animation engine ───────────────────────────
// @ts-ignore
import * as alphabets from '../../services/animations/alphabets';
// @ts-ignore
import * as words from '../../services/animations/words';
// @ts-ignore
import { defaultPose } from '../../services/animations/defaultPose';

// ─── AvatarViewer Component ───────────────────────────────────────────────────
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
    scene: null,
    camera: null,
    renderer: null,
    speed: 0.1,
    pause: 800,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeSign, setActiveSign] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);
  const rafRef = useRef<number | null>(null);
  const runSignRef = useRef<(txt: string) => void>(() => {});

  useEffect(() => {
    const ref = refObj.current;
    const el = mountRef.current;
    if (!el) return;

    // ── Scene Setup ────────────────────────────────────────────────────────
    ref.scene = new THREE.Scene();
    ref.scene.background = null;

    const w = el.clientWidth || 400;
    const h = el.clientHeight || 520;

    // ── Camera (mirrors Hear_Aid Convert.js exactly) ────────────────────────
    // camera.position.z = 1.6, y = 1.4, FOV 30 → full upper body visible
    ref.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000);
    ref.camera.position.set(0, 1.4, 1.6);

    // ── Renderer ───────────────────────────────────────────────────────────
    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ref.renderer.setSize(w, h);
    ref.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ref.renderer.shadowMap.enabled = true;
    ref.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.innerHTML = '';
    el.appendChild(ref.renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    ref.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff0e0, 2.5);
    keyLight.position.set(2, 5, 4);
    keyLight.castShadow = true;
    ref.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8ff, 1.2);
    fillLight.position.set(-3, 3, 2);
    ref.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 5, -3);
    ref.scene.add(rimLight);

    // ── Load ybot.glb (fully rigged Mixamo humanoid with finger bones) ──────
    const loader = new GLTFLoader();

    const loadModel = (url: string, onSuccess: (gltf: any) => void, onFail: () => void) => {
      loader.load(
        url,
        onSuccess,
        undefined,
        onFail,
      );
    };

    const onModelLoaded = (gltf: any) => {
      const scene = gltf.scene;

      // Disable frustum culling on all skinned meshes (same as Hear_Aid)
      scene.traverse((child: any) => {
        if (child.type === 'SkinnedMesh') {
          child.frustumCulled = false;
          // Apply human skin-tone PBR material
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat: any) => {
              if (mat.name && mat.name.toLowerCase().includes('skin')) {
                mat.color.setHex(0xe8b99a);
                mat.roughness = 0.45;
                mat.metalness = 0.0;
              } else if (mat.name && (mat.name.toLowerCase().includes('wolf3d') || mat.name.toLowerCase().includes('body'))) {
                mat.color.setHex(0x23252b);
                mat.roughness = 0.7;
              }
            });
          }
        }
      });

      ref.avatar = scene;
      ref.scene.add(ref.avatar);

      // Apply default two-arm pose (exactly as Hear_Aid does it)
      defaultPose(ref);

      setModelReady(true);
    };

    // Try ybot.glb first → fallback to xbot.glb
    loadModel(
      '/assets/ybot.glb',
      onModelLoaded,
      () => {
        loadModel(
          '/assets/xbot.glb',
          onModelLoaded,
          () => {
            setModelError(true);
          }
        );
      }
    );

    // ── Render Loop ────────────────────────────────────────────────────────
    const renderLoop = () => {
      rafRef.current = requestAnimationFrame(renderLoop);
      if (ref.renderer && ref.scene && ref.camera) {
        ref.renderer.render(ref.scene, ref.camera);
      }
    };
    renderLoop();

    // ── Resize Handler ─────────────────────────────────────────────────────
    const onResize = () => {
      if (!el || !ref.camera || !ref.renderer) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      ref.camera.aspect = nw / nh;
      ref.camera.updateProjectionMatrix();
      ref.renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      ref.renderer?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animation Engine (mirrors Hear_Aid ref.animate exactly) ─────────────
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
              const obj = ref.avatar?.getObjectByName(bn);
              if (!obj) { ref.animations[0].splice(i, 1); continue; }
              if (sg === '+' && obj[ac][ax] < lim) {
                obj[ac][ax] = Math.min(obj[ac][ax] + ref.speed, lim);
                i++;
              } else if (sg === '-' && obj[ac][ax] > lim) {
                obj[ac][ax] = Math.max(obj[ac][ax] - ref.speed, lim);
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

    // ── runSign function (mirrors Hear_Aid runSignRef) ─────────────────────
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

  // ── React to signText prop ─────────────────────────────────────────────────
  useEffect(() => {
    if (signText && modelReady && autoPlay) {
      runSignRef.current(signText);
      setIsPlaying(true);
    }
  }, [signText, modelReady, autoPlay]);

  const handlePlay = () => {
    if (!isPlaying && signText) {
      runSignRef.current(signText);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    const ref = refObj.current;
    ref.animations = [];
    ref.pending = false;
    ref.flag = false;
    setIsPlaying(false);
    setActiveSign('');
    // Restore default pose
    if (ref.avatar) defaultPose(ref);
  };

  const handleReplay = () => {
    if (signText) {
      runSignRef.current(signText);
      setIsPlaying(true);
    }
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
            <span className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Now signing</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-mono font-extrabold text-xs animate-pulse shadow-md shadow-purple-400/30">
              {activeSign}
            </span>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1 min-h-[420px] bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading Overlay */}
        {!modelReady && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600 dark:text-neutral-300">Loading Avatar...</p>
          </div>
        )}

        {/* Error Overlay */}
        {modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-semibold text-red-500">Avatar model failed to load</p>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Ensure <code className="bg-slate-100 dark:bg-neutral-800 px-1 rounded">ybot.glb</code> is in <code className="bg-slate-100 dark:bg-neutral-800 px-1 rounded">frontend/public/assets/</code>
            </p>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        {/* Play / Pause / Replay */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-400/20"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              Pause
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-400/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play
            </button>
          )}
          <button
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300 transition-all cursor-pointer"
            title="Replay"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
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
