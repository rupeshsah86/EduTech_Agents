import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Play, Pause, RotateCcw, Zap, Volume2, UserCheck, Sparkles, ZoomIn } from 'lucide-react';

// @ts-ignore
import * as alphabets from '../../services/animations/alphabets';
// @ts-ignore
import * as words from '../../services/animations/words';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

// Dedicated 3D Avatar Mesh
const AVATAR_MODELS = [
  { id: 'Michelle', name: 'Michelle (3D Sign Avatar)', path: '/assets/Michelle.glb' },
];

// Helper to look up bone by name across Mixamo & Humanoid naming conventions
function getBone(avatar: THREE.Object3D, name: string): THREE.Object3D | undefined {
  let obj = avatar.getObjectByName(name);
  if (obj) return obj;
  if (name.startsWith('mixamorig') && !name.includes(':')) {
    obj = avatar.getObjectByName('mixamorig:' + name.slice('mixamorig'.length));
    if (obj) return obj;
  }
  return undefined;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
  signText = '',
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

  const selectedModel = 'Michelle';
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeSign, setActiveSign] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalSigns, setTotalSigns] = useState(0);
  const [_completedSigns, setCompletedSigns] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);

  const rafRef = useRef<number | null>(null);
  const runSignRef = useRef<(txt: string) => void>(() => {});
  const breathAngle = useRef(0);
  const headSwayAngle = useRef(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // ── DEFAULT PROFESSIONAL SIGNING POSE ──────────────────────────────────
  const applyDefaultPose = useCallback((ref: any) => {
    if (!ref.avatar) return;
    const pose: Record<string, [number, number, number]> = {
      'mixamorig:Neck':         [0.05, 0, 0],
      'mixamorig:LeftShoulder': [0, 0, -0.05],
      'mixamorig:LeftArm':      [-0.1, 0, -Math.PI / 3.4],
      'mixamorig:LeftForeArm':  [0, -Math.PI / 1.9, 0],
      'mixamorig:LeftHand':     [0.05, 0, 0],
      'mixamorig:RightShoulder':[0, 0, 0.05],
      'mixamorig:RightArm':     [-0.1, 0, Math.PI / 3.4],
      'mixamorig:RightForeArm': [0, Math.PI / 1.9, 0],
      'mixamorig:RightHand':    [0.05, 0, 0],
      'mixamorig:Spine':        [0.03, 0, 0],
      'mixamorig:Spine1':       [0.03, 0, 0],
    };
    Object.entries(pose).forEach(([boneName, [x, y, z]]) => {
      const bone = getBone(ref.avatar, boneName);
      if (bone) bone.rotation.set(x, y, z);
    });
  }, []);

  // ── LOAD MODEL INTO SCENE ────────────────────────────────────────────────
  const loadModel = useCallback((modelPath: string) => {
    const scene = sceneRef.current;
    const ref = refObj.current;
    if (!scene) return;

    setModelReady(false);
    setModelError(false);

    if (ref.avatar) {
      scene.remove(ref.avatar);
      ref.avatar = null;
    }

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const avatarScene = gltf.scene;

        avatarScene.traverse((child: any) => {
          if (child.isMesh || child.isSkinnedMesh) {
            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.side = THREE.DoubleSide;
              if (child.material.roughness !== undefined) {
                child.material.roughness = Math.min(child.material.roughness, 0.7);
              }
            }
          }
        });

        avatarScene.position.set(0, 0, 0);
        avatarScene.rotation.set(0, 0, 0);

        ref.avatar = avatarScene;
        scene.add(avatarScene);
        applyDefaultPose(ref);
        setModelReady(true);
      },
      undefined,
      (err) => {
        console.error('Error loading avatar GLB:', err);
        setModelError(true);
      }
    );
  }, [applyDefaultPose]);

  // ── SCENE SETUP & THREE.JS INITIALIZATION ─────────────────────────
  useEffect(() => {
    const ref = refObj.current;
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const w = el.clientWidth || 400;
    const h = el.clientHeight || 520;

    // Professional Camera framing - Centered upper body & hands (Y = 1.25, dist = 2.2)
    const camera = new THREE.PerspectiveCamera(28, w / h, 0.1, 1000);
    const targetY = zoomLevel === 0.5 ? 0.90 : (zoomLevel === 1.5 ? 1.38 : 1.25);
    const dist = 2.2 / zoomLevel;
    camera.position.set(0, targetY, dist);
    camera.lookAt(0, targetY, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.innerHTML = '';
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainKeyLight.position.set(3, 5, 4);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const softFillLight = new THREE.DirectionalLight(0xa5b4fc, 1.2);
    softFillLight.position.set(-3, 3, 2);
    scene.add(softFillLight);

    const pinkRimLight = new THREE.DirectionalLight(0xf472b6, 1.4);
    pinkRimLight.position.set(0, 5, -3);
    scene.add(pinkRimLight);

    const topDownLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topDownLight.position.set(0, 7, 0);
    scene.add(topDownLight);

    // Initial Model Load
    const activeModelObj = AVATAR_MODELS[0];
    loadModel(activeModelObj.path);

    // Render loop with idle breathing & head sway
    const clock = new THREE.Clock();
    const renderLoop = () => {
      rafRef.current = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();

      if (ref.avatar && !ref.pending) {
        breathAngle.current += delta * 1.5;
        const spine = getBone(ref.avatar, 'mixamorig:Spine');
        if (spine) spine.rotation.x = 0.03 + Math.sin(breathAngle.current) * 0.01;

        headSwayAngle.current += delta * 0.7;
        const head = getBone(ref.avatar, 'mixamorig:Head');
        if (head) {
          head.rotation.y = Math.sin(headSwayAngle.current) * 0.02;
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
  }, [loadModel, selectedModel, zoomLevel]);

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

  useEffect(() => {
    if (signText && modelReady) {
      setTimeout(() => runSignRef.current(signText), 300);
    }
  }, [signText, modelReady]);

  const handlePlay = () => {
    const textToPlay = (signText && signText.trim()) ? signText : 'HELLO';
    runSignRef.current(textToPlay);
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
    const textToPlay = (signText && signText.trim()) ? signText : 'HELLO';
    runSignRef.current(textToPlay);
  };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    refObj.current.speed = 0.1 * s;
    refObj.current.pause = 700 / s;
  };

  const handleZoomChange = (z: number) => {
    setZoomLevel(z);
    if (cameraRef.current) {
      const targetY = z === 0.5 ? 0.90 : (z === 1.5 ? 1.38 : 1.25);
      const dist = 2.2 / z;
      cameraRef.current.position.set(0, targetY, dist);
      cameraRef.current.lookAt(0, targetY, 0);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl font-sans">
      
      {/* ── Header Toolbar ──────────────────────────────────────────────── */}
      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-950/70 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-neutral-100 leading-tight">3D Sign Interpreter</p>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500">Ready Player Me GLB Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isPlaying && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold animate-pulse border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SIGNING
              </span>
            )}
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Single Dedicated 3D Avatar Badge */}
        <div className="flex items-center gap-1.5 text-left">
          <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 text-[10px] font-extrabold flex items-center gap-1.5 shadow-2xs">
            <UserCheck className="w-3 h-3 text-purple-500" />
            <span>3D Mesh: Michelle (Default Avatar)</span>
          </span>
        </div>
      </div>

      {/* ── Active Sign Caption & Progress Bar ────────────────────────────── */}
      <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 min-h-[32px] flex flex-col justify-center space-y-1">
        <div className="flex items-center justify-between">
          {activeSign ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Signing:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-mono font-extrabold text-xs shadow-xs">
                {activeSign}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium italic">
              {modelReady ? 'Ready to translate sign text...' : 'Loading 3D mesh model...'}
            </span>
          )}

          {totalSigns > 0 && (
            <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 font-mono">
              {progress}%
            </span>
          )}
        </div>

        {totalSigns > 0 && (
          <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── 3D Viewport Canvas ─────────────────────────────────────────────── */}
      <div 
        className="relative flex-1 min-h-0 overflow-hidden bg-slate-50/50 dark:bg-neutral-950/50"
      >
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading Indicator */}
        {!modelReady && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full border-3 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-xs font-bold text-slate-700 dark:text-neutral-300">Loading Avatar Model...</p>
          </div>
        )}

        {/* Error Fallback */}
        {modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-xs font-bold text-rose-500">Avatar failed to load</p>
          </div>
        )}

        {/* Idle Badge */}
        {modelReady && !isPlaying && !activeSign && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 text-[10px] font-bold text-slate-500 dark:text-neutral-400 shadow-xs flex items-center gap-1.5">
              <UserCheck className="w-3 h-3 text-purple-500" />
              <span>3D Avatar Standby (Upper Body Centered)</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Playback & Zoom Controls ──────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Play / Pause / Replay Buttons */}
          <div className="flex items-center gap-1.5">
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </button>
            )}
            <button
              onClick={handleReplay}
              className="p-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-neutral-400 hover:text-purple-600 transition-all cursor-pointer"
              title="Replay Sign Animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera Zoom Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <ZoomIn className="w-3 h-3 text-purple-500 ml-1 shrink-0" />
            {[
              { level: 0.5, label: '0.5x Full' },
              { level: 1.0, label: '1x Upper Body' },
              { level: 1.5, label: '1.5x Hands' },
            ].map((z) => (
              <button
                key={z.level}
                type="button"
                onClick={() => handleZoomChange(z.level)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  zoomLevel === z.level
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-purple-600'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <Zap className="w-3 h-3 text-amber-500 ml-1 shrink-0" />
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-purple-600'
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
