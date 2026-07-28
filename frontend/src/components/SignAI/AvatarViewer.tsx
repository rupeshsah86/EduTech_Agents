import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AvatarAnimationEngine } from '../../services/signAvatar';
import { Play, Pause, RotateCcw, FastForward, UserCheck, Sparkles } from 'lucide-react';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

/**
 * Constructs the 3D Stylized Male Character Bust with dark hair, black long-sleeve sweater,
 * pedestal base, and rigged arm joints matching the uploaded user image design.
 */
function createStylizedHumanAvatar(): THREE.Group {
  const avatarGroup = new THREE.Group();
  avatarGroup.name = 'stylizedHumanAvatar';

  // 1. Pedestal Stand Base
  const pedestalGroup = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x18181c,
    metalness: 0.7,
    roughness: 0.25,
  });
  const baseGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.22, 32);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.75;
  pedestalGroup.add(baseMesh);

  const neckBaseGeo = new THREE.CylinderGeometry(0.16, 0.32, 0.35, 32);
  const neckBaseMesh = new THREE.Mesh(neckBaseGeo, baseMat);
  neckBaseMesh.position.y = -0.48;
  pedestalGroup.add(neckBaseMesh);

  avatarGroup.add(pedestalGroup);

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe5ad90, roughness: 0.4, metalness: 0.02 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x202024, roughness: 0.85, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x241c19, roughness: 0.65, metalness: 0.1 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.2 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

  // 2. Torso (Black Long-Sleeve Sweater)
  const chestGeo = new THREE.CylinderGeometry(0.36, 0.28, 0.65, 32);
  const chestMesh = new THREE.Mesh(chestGeo, shirtMat);
  chestMesh.position.y = -0.15;
  avatarGroup.add(chestMesh);

  // Sweater Crewneck Collar
  const collarGeo = new THREE.TorusGeometry(0.13, 0.025, 16, 32);
  const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 0.18;
  avatarGroup.add(collarMesh);

  // 3. Head & Neck
  const headGroup = new THREE.Group();
  headGroup.name = 'mixamorigHead';
  headGroup.position.y = 0.42;

  const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.18, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = -0.16;
  headGroup.add(neckMesh);

  const headGeo = new THREE.SphereGeometry(0.2, 32, 32);
  headGeo.scale(0.9, 1.15, 0.95);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headGroup.add(headMesh);

  // Stylized Jawline/Chin
  const chinGeo = new THREE.SphereGeometry(0.12, 16, 16);
  chinGeo.scale(0.85, 0.9, 0.9);
  const chinMesh = new THREE.Mesh(chinGeo, skinMat);
  chinMesh.position.set(0, -0.12, 0.08);
  headGroup.add(chinMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.045, 12, 12);
  earGeo.scale(0.4, 0.9, 0.6);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.19, 0.02, 0);
  const rightEar = leftEar.clone();
  rightEar.position.set(0.19, 0.02, 0);
  headGroup.add(leftEar, rightEar);

  // Eyes
  const eyeGroupLeft = new THREE.Group();
  eyeGroupLeft.position.set(-0.07, 0.03, 0.16);
  const scleraLeft = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), eyeWhiteMat);
  const irisLeft = new THREE.Mesh(new THREE.CircleGeometry(0.018, 16), eyeIrisMat);
  irisLeft.position.z = 0.031;
  const pupilLeft = new THREE.Mesh(new THREE.CircleGeometry(0.009, 16), pupilMat);
  pupilLeft.position.z = 0.032;
  eyeGroupLeft.add(scleraLeft, irisLeft, pupilLeft);

  const eyeGroupRight = eyeGroupLeft.clone();
  eyeGroupRight.position.x = 0.07;
  headGroup.add(eyeGroupLeft, eyeGroupRight);

  // Eyebrows
  const browGeo = new THREE.BoxGeometry(0.06, 0.012, 0.01);
  const leftBrow = new THREE.Mesh(browGeo, hairMat);
  leftBrow.position.set(-0.07, 0.08, 0.17);
  leftBrow.rotation.z = 0.08;
  const rightBrow = new THREE.Mesh(browGeo, hairMat);
  rightBrow.position.set(0.07, 0.08, 0.17);
  rightBrow.rotation.z = -0.08;
  headGroup.add(leftBrow, rightBrow);

  // Nose
  const noseGeo = new THREE.ConeGeometry(0.025, 0.06, 12);
  const noseMesh = new THREE.Mesh(noseGeo, skinMat);
  noseMesh.position.set(0, -0.02, 0.19);
  noseMesh.rotation.x = -0.2;
  headGroup.add(noseMesh);

  // Stylized Dark Wavy Hair matching uploaded character portrait
  const hairGroup = new THREE.Group();
  const mainHairGeo = new THREE.SphereGeometry(0.215, 32, 32);
  mainHairGeo.scale(0.95, 1.05, 0.98);
  const mainHair = new THREE.Mesh(mainHairGeo, hairMat);
  mainHair.position.set(0, 0.06, -0.02);
  hairGroup.add(mainHair);

  const tuftGeo = new THREE.SphereGeometry(0.09, 16, 16);
  tuftGeo.scale(1.2, 0.7, 0.9);

  const frontTuft1 = new THREE.Mesh(tuftGeo, hairMat);
  frontTuft1.position.set(-0.06, 0.18, 0.12);
  frontTuft1.rotation.set(-0.3, 0.2, -0.3);

  const frontTuft2 = new THREE.Mesh(tuftGeo, hairMat);
  frontTuft2.position.set(0.05, 0.19, 0.11);
  frontTuft2.rotation.set(-0.2, -0.3, 0.2);

  const topVolume = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), hairMat);
  topVolume.position.set(0, 0.2, 0.04);
  topVolume.scale.set(1.3, 0.8, 1.1);

  hairGroup.add(frontTuft1, frontTuft2, topVolume);
  headGroup.add(hairGroup);

  avatarGroup.add(headGroup);

  // 4. Rigged Left & Right Arms (matching Mixamo bone structure for sign animations)
  // Right Arm Group
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'mixamorigRightArm';
  rightArmGroup.position.set(-0.32, 0.16, 0);

  const rightUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 16), shirtMat);
  rightUpperArmMesh.position.y = -0.14;
  rightArmGroup.add(rightUpperArmMesh);

  const rightForeArmGroup = new THREE.Group();
  rightForeArmGroup.name = 'mixamorigRightForeArm';
  rightForeArmGroup.position.set(0, -0.28, 0);

  const rightForeArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.26, 16), shirtMat);
  rightForeArmMesh.position.y = -0.13;
  rightForeArmGroup.add(rightForeArmMesh);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.name = 'mixamorigRightHand';
  rightHandGroup.position.set(0, -0.26, 0);

  const rightPalmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.03), skinMat);
  rightPalmMesh.position.y = -0.045;
  rightHandGroup.add(rightPalmMesh);

  for (let f = 0; f < 5; f++) {
    const fingerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.008, 0.07, 8), skinMat);
    fingerMesh.position.set(-0.03 + f * 0.015, -0.11, 0);
    rightHandGroup.add(fingerMesh);
  }

  rightForeArmGroup.add(rightHandGroup);
  rightArmGroup.add(rightForeArmGroup);
  avatarGroup.add(rightArmGroup);

  // Left Arm Group
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'mixamorigLeftArm';
  leftArmGroup.position.set(0.32, 0.16, 0);

  const leftUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 16), shirtMat);
  leftUpperArmMesh.position.y = -0.14;
  leftArmGroup.add(leftUpperArmMesh);

  const leftForeArmGroup = new THREE.Group();
  leftForeArmGroup.name = 'mixamorigLeftForeArm';
  leftForeArmGroup.position.set(0, -0.28, 0);

  const leftForeArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.26, 16), shirtMat);
  leftForeArmMesh.position.y = -0.13;
  leftForeArmGroup.add(leftForeArmMesh);

  const leftHandGroup = new THREE.Group();
  leftHandGroup.name = 'mixamorigLeftHand';
  leftHandGroup.position.set(0, -0.26, 0);

  const leftPalmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.03), skinMat);
  leftPalmMesh.position.y = -0.045;
  leftHandGroup.add(leftPalmMesh);

  for (let f = 0; f < 5; f++) {
    const fingerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.008, 0.07, 8), skinMat);
    fingerMesh.position.set(-0.03 + f * 0.015, -0.11, 0);
    leftHandGroup.add(fingerMesh);
  }

  leftForeArmGroup.add(leftHandGroup);
  leftArmGroup.add(leftForeArmGroup);
  avatarGroup.add(leftArmGroup);

  return avatarGroup;
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

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 2.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Studio Three-Point Lighting Setup matching uploaded portrait image
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e5, 2.2);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    fillLight.position.set(-2.5, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // Construct 3D Stylized Male Character Bust Avatar
    const avatarObj = createStylizedHumanAvatar();
    scene.add(avatarObj);

    const engine = new AvatarAnimationEngine();
    engineRef.current = engine;
    engine.setAvatar(avatarObj);
    setModelLoaded(true);

    if (signText && autoPlay) {
      engine.playSentence(signText, (chunk) => setActiveSignChunk(chunk));
      setIsPlaying(true);
    }

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
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">3D Stylized Sign Avatar</h3>
        </div>
        {activeSignChunk && (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-extrabold text-[11px] animate-pulse">
            Signing: {activeSignChunk}
          </span>
        )}
      </div>

      {/* 3D WebGL Canvas Container with Neutral Studio Backdrop matching portrait */}
      <div className="relative w-full flex-1 min-h-[300px] rounded-xl bg-gradient-to-b from-slate-200/60 via-slate-100/40 to-slate-200/80 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border border-slate-300/80 dark:border-neutral-800 overflow-hidden flex items-center justify-center shadow-inner">
        <div ref={mountRef} className="w-full h-full" />

        {!modelLoaded && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-xs font-semibold">Loading 3D Stylized Character Bust...</p>
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
