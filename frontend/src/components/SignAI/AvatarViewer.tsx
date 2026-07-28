import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AvatarAnimationEngine } from '../../services/signAvatar';
import { Play, Pause, RotateCcw, FastForward, UserCheck, Sparkles } from 'lucide-react';

interface AvatarViewerProps {
  signText?: string;
  autoPlay?: boolean;
}

/**
 * Constructs a clean, handsome 3D Human Male Character Avatar Bust with proportional head,
 * natural eyes, eyebrows, nose, smile, styled dark hair, crewneck shirt, and pedestal base.
 */
function buildHandsomeHumanAvatar(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'handsomeHumanAvatarRoot';
  root.position.set(0, -0.1, 0);

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xedd0be, // Smooth, natural warm skin tone
    roughness: 0.35,
    metalness: 0.0,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0x23252b, // Charcoal navy crewneck shirt
    roughness: 0.8,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x261d1a, // Dark brown hair
    roughness: 0.6,
    metalness: 0.05,
  });

  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.2 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const lipMat = new THREE.MeshStandardMaterial({ color: 0xd47a70, roughness: 0.4 });
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x16161a, metalness: 0.75, roughness: 0.2 });

  // 1. Pedestal Stand Base
  const baseGroup = new THREE.Group();
  const baseGeo = new THREE.CylinderGeometry(0.26, 0.34, 0.12, 32);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.55;
  baseGroup.add(baseMesh);

  const stemGeo = new THREE.CylinderGeometry(0.12, 0.2, 0.22, 32);
  const stemMesh = new THREE.Mesh(stemGeo, baseMat);
  stemMesh.position.y = -0.42;
  baseGroup.add(stemMesh);

  root.add(baseGroup);

  // 2. Torso (Fitted Crewneck Shirt)
  const chestGeo = new THREE.CylinderGeometry(0.26, 0.2, 0.42, 32);
  const chestMesh = new THREE.Mesh(chestGeo, shirtMat);
  chestMesh.position.y = -0.22;
  root.add(chestMesh);

  // Shoulders
  const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), shirtMat);
  leftShoulder.position.set(0.24, -0.05, 0);
  const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), shirtMat);
  rightShoulder.position.set(-0.24, -0.05, 0);
  root.add(leftShoulder, rightShoulder);

  // Collar Ring
  const collarGeo = new THREE.TorusGeometry(0.09, 0.018, 16, 32);
  const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 0.02;
  root.add(collarMesh);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.14, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = 0.06;
  root.add(neckMesh);

  // 3. Head & Face Group (mixamorigHead)
  const headGroup = new THREE.Group();
  headGroup.name = 'mixamorigHead';
  headGroup.position.y = 0.25;

  // Head Oval
  const headGeo = new THREE.SphereGeometry(0.14, 32, 32);
  headGeo.scale(0.9, 1.1, 0.92);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headGroup.add(headMesh);

  // Chin / Jawline Contour
  const chinGeo = new THREE.SphereGeometry(0.08, 16, 16);
  chinGeo.scale(0.8, 0.8, 0.8);
  const chinMesh = new THREE.Mesh(chinGeo, skinMat);
  chinMesh.position.set(0, -0.09, 0.06);
  headGroup.add(chinMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.03, 12, 12);
  earGeo.scale(0.3, 0.8, 0.5);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.13, 0.01, 0);
  const rightEar = leftEar.clone();
  rightEar.position.set(0.13, 0.01, 0);
  headGroup.add(leftEar, rightEar);

  // Eyes (Left & Right)
  const createEye = () => {
    const eyeG = new THREE.Group();
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), eyeWhiteMat);
    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), eyeIrisMat);
    iris.position.z = 0.021;
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.006, 16), pupilMat);
    pupil.position.z = 0.022;
    eyeG.add(sclera, iris, pupil);
    return eyeG;
  };

  const leftEye = createEye();
  leftEye.position.set(-0.048, 0.02, 0.118);

  const rightEye = createEye();
  rightEye.position.set(0.048, 0.02, 0.118);

  headGroup.add(leftEye, rightEye);

  // Eyebrows
  const browGeo = new THREE.BoxGeometry(0.042, 0.008, 0.008);
  const leftBrow = new THREE.Mesh(browGeo, hairMat);
  leftBrow.position.set(-0.048, 0.055, 0.125);
  leftBrow.rotation.z = 0.06;

  const rightBrow = new THREE.Mesh(browGeo, hairMat);
  rightBrow.position.set(0.048, 0.055, 0.125);
  rightBrow.rotation.z = -0.06;

  headGroup.add(leftBrow, rightBrow);

  // Nose
  const noseGeo = new THREE.ConeGeometry(0.016, 0.04, 12);
  const noseMesh = new THREE.Mesh(noseGeo, skinMat);
  noseMesh.position.set(0, -0.015, 0.135);
  noseMesh.rotation.x = -0.12;
  headGroup.add(noseMesh);

  // Natural Smile Line
  const mouthGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.04, 8);
  const mouthMesh = new THREE.Mesh(mouthGeo, lipMat);
  mouthMesh.rotation.z = Math.PI / 2;
  mouthMesh.position.set(0, -0.055, 0.125);
  headGroup.add(mouthMesh);

  // Hair Styling (Positioned strictly above the forehead)
  const hairGroup = new THREE.Group();

  // Top Hair Cap
  const hairCapGeo = new THREE.SphereGeometry(0.142, 24, 24);
  hairCapGeo.scale(0.92, 0.65, 0.92);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 0.075, -0.015);
  hairGroup.add(hairCap);

  // Front Hair Waves
  const wave1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), hairMat);
  wave1.scale.set(1.2, 0.5, 0.8);
  wave1.position.set(-0.04, 0.135, 0.08);
  wave1.rotation.set(-0.2, 0.2, -0.2);

  const wave2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), hairMat);
  wave2.scale.set(1.2, 0.5, 0.8);
  wave2.position.set(0.04, 0.14, 0.07);
  wave2.rotation.set(-0.15, -0.2, 0.2);

  hairGroup.add(wave1, wave2);
  headGroup.add(hairGroup);

  root.add(headGroup);

  // 4. Rigged Left & Right Arms for Sign Language
  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'mixamorigRightArm';
  rightArmGroup.position.set(-0.24, -0.04, 0);

  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.22, 16), shirtMat);
  rightUpperArm.position.y = -0.11;
  rightArmGroup.add(rightUpperArm);

  const rightForeArmGroup = new THREE.Group();
  rightForeArmGroup.name = 'mixamorigRightForeArm';
  rightForeArmGroup.position.set(0, -0.22, 0);

  const rightForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.2, 16), skinMat);
  rightForeArm.position.y = -0.1;
  rightForeArmGroup.add(rightForeArm);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.name = 'mixamorigRightHand';
  rightHandGroup.position.set(0, -0.2, 0);

  const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.06, 0.022), skinMat);
  rightPalm.position.y = -0.03;
  rightHandGroup.add(rightPalm);

  for (let f = 0; f < 5; f++) {
    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.005, 0.05, 8), skinMat);
    finger.position.set(-0.02 + f * 0.01, -0.07, 0);
    rightHandGroup.add(finger);
  }

  rightForeArmGroup.add(rightHandGroup);
  rightArmGroup.add(rightForeArmGroup);
  root.add(rightArmGroup);

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'mixamorigLeftArm';
  leftArmGroup.position.set(0.24, -0.04, 0);

  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.22, 16), shirtMat);
  leftUpperArm.position.y = -0.11;
  leftArmGroup.add(leftUpperArm);

  const leftForeArmGroup = new THREE.Group();
  leftForeArmGroup.name = 'mixamorigLeftForeArm';
  leftForeArmGroup.position.set(0, -0.22, 0);

  const leftForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.2, 16), skinMat);
  leftForeArm.position.y = -0.1;
  leftForeArmGroup.add(leftForeArm);

  const leftHandGroup = new THREE.Group();
  leftHandGroup.name = 'mixamorigLeftHand';
  leftHandGroup.position.set(0, -0.2, 0);

  const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.06, 0.022), skinMat);
  leftPalm.position.y = -0.03;
  leftHandGroup.add(leftPalm);

  for (let f = 0; f < 5; f++) {
    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.005, 0.05, 8), skinMat);
    finger.position.set(-0.02 + f * 0.01, -0.07, 0);
    leftHandGroup.add(finger);
  }

  leftForeArmGroup.add(leftHandGroup);
  leftArmGroup.add(leftForeArmGroup);
  root.add(leftArmGroup);

  return root;
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

    // Upright Camera framing
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.18, 1.75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Studio Three-Point Lighting Setup
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

    // Construct 3D Handsome Human Character Avatar
    const avatarObj = buildHandsomeHumanAvatar();
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
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">3D Stylized Human Avatar</h3>
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
            <p className="text-xs font-semibold">Loading 3D Human Avatar...</p>
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
