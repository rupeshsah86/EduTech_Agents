import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Play, Pause, RotateCcw, Zap, Volume2 } from 'lucide-react';

// @ts-ignore
import * as alphabets from '../../services/animations/alphabets';
// @ts-ignore
import * as words from '../../services/animations/words';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

// Bone alias: Hear_Aid uses "mixamorigRightArm", Michelle uses "mixamorig:RightArm"
function getBone(avatar: THREE.Object3D, name: string): THREE.Object3D | undefined {
  let obj = avatar.getObjectByName(name);
  if (obj) return obj;
  if (name.startsWith('mixamorig') && !name.includes(':')) {
    obj = avatar.getObjectByName('mixamorig:' + name.slice('mixamorig'.length));
    if (obj) return obj;
  }
  return undefined;
}

// Body zone color zones — mapped by normalized Y (0 = feet, 1 = top of head)
function vertexColorFromNormY(normY: number, r: Float32Array, g: Float32Array, b: Float32Array, i: number) {
  let cr: number, cg: number, cb: number;

  if (normY > 0.87) {
    // Hair — deep brown
    cr = 0.17; cg = 0.10; cb = 0.055;
  } else if (normY > 0.70) {
    // Head / face / neck — warm skin
    cr = 0.96; cg = 0.65; cb = 0.48;
  } else if (normY > 0.58) {
    // Shoulders / upper chest — vivid purple
    cr = 0.43; cg = 0.16; cb = 0.85;
  } else if (normY > 0.38) {
    // Mid torso / waist — vivid purple (slightly lighter)
    cr = 0.55; cg = 0.25; cb = 0.95;
  } else if (normY > 0.22) {
    // Thighs / upper legs — rich blue
    cr = 0.11; cg = 0.31; cb = 0.87;
  } else if (normY > 0.08) {
    // Lower legs / shins — slightly darker blue
    cr = 0.09; cg = 0.22; cb = 0.68;
  } else {
    // Feet / shoes — near black
    cr = 0.11; cg = 0.10; cb = 0.10;
  }

  r[i] = cr; g[i] = cg; b[i] = cb;
}

// Paint every vertex in the mesh with a body-zone color based on local Y position
function applyVertexColorToon(mesh: THREE.SkinnedMesh) {
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const count = pos.count;

  // Find local Y bounds
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const height = maxY - minY || 1;

  // Build per-vertex color arrays
  const cr = new Float32Array(count);
  const cg = new Float32Array(count);
  const cb = new Float32Array(count);
  const packed = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const normY = (pos.getY(i) - minY) / height;
    vertexColorFromNormY(normY, cr, cg, cb, i);
    packed[i * 3]     = cr[i];
    packed[i * 3 + 1] = cg[i];
    packed[i * 3 + 2] = cb[i];
  }

  geo.setAttribute('color', new THREE.BufferAttribute(packed, 3));

  const mat = new THREE.MeshToonMaterial({
    vertexColors: true,
    skinning: true,
  } as any);

  mesh.material = mat;
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
  const [progress, setProgress] = useState(0);
  const [totalSigns, setTotalSigns] = useState(0);
  const [_completedSigns, setCompletedSigns] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);

  const rafRef = useRef<number | null>(null);
  const runSignRef = useRef<(txt: string) => void>(() => {});
  const breathAngle = useRef(0);
  const blinkTimer = useRef(0);
  const headSwayAngle = useRef(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // ── DEFAULT SIGNING POSE ─────────────────────────────────────────────────
  const applyDefaultPose = useCallback((ref: any) => {
    if (!ref.avatar) return;
    const pose: Record<string, [number, number, number]> = {
      'mixamorig:Neck':         [0.08, 0, 0],
      'mixamorig:LeftShoulder': [0, 0, -0.1],
      'mixamorig:LeftArm':      [-0.1, 0, -Math.PI / 3.2],
      'mixamorig:LeftForeArm':  [0, -Math.PI / 1.8, 0],
      'mixamorig:LeftHand':     [0.05, 0, 0],
      'mixamorig:RightShoulder':[0, 0, 0.1],
      'mixamorig:RightArm':     [-0.1, 0, Math.PI / 3.2],
      'mixamorig:RightForeArm': [0, Math.PI / 1.8, 0],
      'mixamorig:RightHand':    [0.05, 0, 0],
      'mixamorig:Spine':        [0.04, 0, 0],
      'mixamorig:Spine1':       [0.04, 0, 0],
    };
    Object.entries(pose).forEach(([boneName, [x, y, z]]) => {
      const bone = ref.avatar.getObjectByName(boneName);
      if (bone) bone.rotation.set(x, y, z);
    });
  }, []);

  // ── SCENE SETUP ──────────────────────────────────────────────────────────
  useEffect(() => {
    const ref = refObj.current;
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const w = el.clientWidth || 400;
    const h = el.clientHeight || 520;

    // Camera — zoomed out for full upper-body view with breathing room
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 1000);
    camera.position.set(0, 1.38, 2.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    el.innerHTML = '';
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Vivid Cartoon Lighting — boosted for rich color saturation
    scene.add(new THREE.AmbientLight(0xfff8f0, 3.0));

    const keyLight = new THREE.DirectionalLight(0xfffde7, 4.5);
    keyLight.position.set(2, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc8d8ff, 2.5);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe0f0, 2.0);
    rimLight.position.set(0, 6, -3);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 8, 0);
    scene.add(topLight);

    const purpleAccent = new THREE.PointLight(0x9333ea, 1.2, 5);
    purpleAccent.position.set(-1.5, 2.5, 2);
    scene.add(purpleAccent);

    const warmAccent = new THREE.PointLight(0xff9966, 0.8, 4);
    warmAccent.position.set(1.5, 1.5, 2);
    scene.add(warmAccent);

    // Load Michelle.glb — real human character with full finger bones
    const loader = new GLTFLoader();
    loader.load(
      '/assets/Michelle.glb',
      (gltf) => {
        const avatarScene = gltf.scene;

        // First pass: disable frustum culling
        avatarScene.traverse((child: any) => {
          if (child.isSkinnedMesh) {
            child.frustumCulled = false;
          }
        });

        ref.avatar = avatarScene;
        scene.add(avatarScene);
        applyDefaultPose(ref);

        // Second pass: paint every vertex by its local Y position → vivid body zone colors
        avatarScene.traverse((child: any) => {
          if (child.isSkinnedMesh) {
            console.log('[AvatarViewer] mesh:', child.name, '→ vertex coloring');
            applyVertexColorToon(child as THREE.SkinnedMesh);
          }
        });

        setModelReady(true);
      },
      undefined,
      () => setModelError(true)
    );

    // ── IDLE + RENDER LOOP ─────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const renderLoop = () => {
      rafRef.current = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();

      if (ref.avatar && !ref.pending) {
        // Breathing
        breathAngle.current += delta * 1.2;
        const spine = ref.avatar.getObjectByName('mixamorig:Spine');
        if (spine) spine.rotation.x = 0.04 + Math.sin(breathAngle.current) * 0.012;

        // Head gentle sway
        headSwayAngle.current += delta * 0.6;
        const head = ref.avatar.getObjectByName('mixamorig:Head');
        if (head) {
          head.rotation.y = Math.sin(headSwayAngle.current) * 0.025;
        }

        // Eye blinking
        blinkTimer.current += delta;
        if (blinkTimer.current > 3.5 + Math.random() * 2) {
          blinkTimer.current = 0;
        }
      }

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

  // ── ANIMATION ENGINE ─────────────────────────────────────────────────────
  useEffect(() => {
    const ref = refObj.current;

    ref.animate = () => {
      if (!ref.animations.length) {
        ref.pending = false;
        setIsPlaying(false);
        applyDefaultPose(ref);
        return;
      }
      requestAnimationFrame(ref.animate);

      if (ref.animations[0].length) {
        if (!ref.flag) {
          if (ref.animations[0][0] === 'add-text') {
            const txt = ref.animations[0][1];
            setActiveSign(txt.trim());
            setCompletedSigns((prev) => {
              const next = prev + 1;
              setProgress(Math.round((next / ref._totalSigns) * 100));
              return next;
            });
            ref.animations.shift();
          } else {
            for (let i = 0; i < ref.animations[0].length;) {
              const [bn, ac, ax, lim, sg] = ref.animations[0][i];
              const bone = ref.avatar ? getBone(ref.avatar, bn) : null;
              if (!bone) { ref.animations[0].splice(i, 1); continue; }
              const target = (bone as any)[ac];
              if (!target) { ref.animations[0].splice(i, 1); continue; }
              if (sg === '+' && target[ax] < lim) {
                target[ax] = Math.min(target[ax] + ref.speed, lim); i++;
              } else if (sg === '-' && target[ax] > lim) {
                target[ax] = Math.max(target[ax] - ref.speed, lim); i++;
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

    runSignRef.current = (str: string) => {
      if (!str || !str.trim() || !ref.avatar) return;
      setActiveSign('');
      setProgress(0);
      setCompletedSigns(0);
      ref.animations = [];
      ref.characters = [];

      const wordsArr = str.trim().toUpperCase().split(/\s+/).filter(Boolean);
      let signCount = 0;
      wordsArr.forEach((word: string, wi: number) => {
        const isLast = wi === wordsArr.length - 1;
        if ((words as any)[word]) {
          (words as any)[word](ref);
          ref.animations.push(['add-text', isLast ? word : word + ' ']);
          signCount++;
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
            signCount++;
          });
        }
      });

      ref._totalSigns = signCount;
      setTotalSigns(signCount);

      if (!ref.pending) {
        ref.pending = true;
        ref.animate();
      }
      setIsPlaying(true);
    };
  }, [applyDefaultPose]);

  // React to signText prop
  useEffect(() => {
    if (signText && modelReady && autoPlay) {
      setTimeout(() => runSignRef.current(signText), 600);
    }
  }, [signText, modelReady, autoPlay]);

  const handlePlay = () => {
    if (signText) { runSignRef.current(signText); }
  };

  const handlePause = () => {
    const ref = refObj.current;
    ref.animations = [];
    ref.pending = false;
    ref.flag = false;
    setIsPlaying(false);
    setActiveSign('');
    setProgress(0);
    applyDefaultPose(ref);
  };

  const handleReplay = () => {
    if (signText) { runSignRef.current(signText); }
  };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    refObj.current.speed = 0.1 * s;
    refObj.current.pause = 700 / s;
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 dark:border-neutral-800/60 shadow-2xl"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,240,255,0.98) 100%)' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(139,92,246,0.05) 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-md shadow-purple-400/30">
            <span className="text-base">🤟</span>
          </div>
          <div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-neutral-100 leading-none">AI Interpreter</p>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500 leading-none mt-0.5">Sign Language Avatar</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isPlaying && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              LIVE
            </span>
          )}
          <Volume2 className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* ── Active Sign Caption ────────────────────────────────────────────── */}
      <div className="px-4 pb-2 shrink-0 min-h-[36px] flex items-center">
        {activeSign ? (
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold shrink-0">Now Signing</span>
            <div className="flex-1 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-mono font-extrabold text-sm shadow-lg shadow-purple-400/25">
                {activeSign}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold shrink-0">{progress}%</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-300 dark:text-neutral-600 italic">
            {modelReady ? 'Ready to sign...' : 'Loading avatar...'}
          </span>
        )}
      </div>

      {/* ── Progress Bar ──────────────────────────────────────────────────── */}
      {totalSigns > 0 && (
        <div className="px-4 pb-2 shrink-0">
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── 3D Canvas ─────────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.08) 0%, rgba(248,245,255,0.95) 60%, rgba(240,235,255,0.9) 100%)' }}
      >
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading Skeleton */}
        {!modelReady && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-40" />
              <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">Loading Avatar</p>
              <p className="text-xs text-slate-400 mt-0.5">Preparing sign language engine...</p>
            </div>
          </div>
        )}

        {modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-bold text-red-500">Avatar failed to load</p>
            <p className="text-xs text-slate-500">Check that <code>Michelle.glb</code> is in <code>public/assets/</code></p>
          </div>
        )}

        {/* Idle label when ready but not signing */}
        {modelReady && !isPlaying && !activeSign && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-neutral-700/60 text-[10px] font-semibold text-slate-400 shadow-sm">
              Idle — Ready for input
            </span>
          </div>
        )}
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-t border-slate-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Play / Pause / Replay */}
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-400/25"
              >
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-400/25"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </button>
            )}
            <button
              onClick={handleReplay}
              className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-purple-50 dark:hover:bg-neutral-700 active:scale-95 text-slate-600 dark:text-neutral-300 hover:text-purple-600 transition-all cursor-pointer"
              title="Replay"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
            <Zap className="w-3 h-3 text-slate-400 ml-1 shrink-0" />
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer active:scale-95 ${
                  speed === s
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-purple-600 hover:bg-white dark:hover:bg-neutral-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
