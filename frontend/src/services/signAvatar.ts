// Text-to-Sign 3D Avatar Animation Engine Wrapper (Project 2 Integration)
import * as THREE from 'three';

export type BoneAnimationStep = [string, 'rotation' | 'position', 'x' | 'y' | 'z', number, '+' | '-'];

export class AvatarAnimationEngine {
  private avatar: THREE.Object3D | null = null;
  private animationQueue: Array<BoneAnimationStep[] | string> = [];
  private isAnimating: boolean = false;
  private isPaused: boolean = false;
  private speed: number = 1.0; // 0.5x, 1.0x, 1.5x, 2.0x multiplier
  private baseStepDelta: number = 0.08;
  private currentStepIndex: number = 0;
  private onStepChange?: (textChunk: string) => void;
  private breathingAngle: number = 0;

  constructor(avatarObj?: THREE.Object3D) {
    if (avatarObj) {
      this.avatar = avatarObj;
    }
  }

  public setAvatar(avatarObj: THREE.Object3D) {
    this.avatar = avatarObj;
    this.applyDefaultPose();
  }

  public setSpeed(speedMultiplier: number) {
    this.speed = speedMultiplier;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public getPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Applies baseline natural posture to avatar
   */
  public applyDefaultPose() {
    if (!this.avatar) return;

    const defaultRotations: Record<string, [number, number, number]> = {
      mixamorigNeck: [Math.PI / 12, 0, 0],
      mixamorigLeftArm: [0, 0, -Math.PI / 3.5],
      mixamorigLeftForeArm: [0, -Math.PI / 2.2, 0],
      mixamorigRightArm: [0, 0, Math.PI / 3.5],
      mixamorigRightForeArm: [0, Math.PI / 2.2, 0],
      mixamorigLeftHand: [0, 0, 0],
      mixamorigRightHand: [0, 0, 0],
    };

    Object.entries(defaultRotations).forEach(([boneName, [x, y, z]]) => {
      const bone = this.avatar?.getObjectByName(boneName);
      if (bone) {
        bone.rotation.set(x, y, z);
      }
    });
  }

  /**
   * Generates keyframes for a sentence and starts animation queue playback
   */
  public playSentence(sentence: string, onStepText?: (txt: string) => void) {
    if (!this.avatar) return;
    this.onStepChange = onStepText;
    this.animationQueue = [];
    this.currentStepIndex = 0;
    this.isPaused = false;
    this.isAnimating = true;

    const words = sentence.trim().toUpperCase().split(/\s+/).filter(Boolean);

    words.forEach((word) => {
      // Check for word sign keyframe frames
      const wordFrames = this.generateWordFrames(word);
      this.animationQueue.push(...wordFrames);
    });

    this.processNextStep();
  }

  public updateIdleBreathing(delta: number) {
    if (!this.avatar || this.isAnimating) return;
    this.breathingAngle += delta * 1.5;
    const spine = this.avatar.getObjectByName('mixamorigSpine') || this.avatar.getObjectByName('mixamorigSpine1');
    if (spine) {
      spine.rotation.x = Math.sin(this.breathingAngle) * 0.02;
    }
    const head = this.avatar.getObjectByName('mixamorigHead');
    if (head) {
      head.rotation.y = Math.sin(this.breathingAngle * 0.5) * 0.03;
    }
  }

  private processNextStep() {
    if (!this.avatar || this.animationQueue.length === 0 || this.isPaused) {
      if (this.animationQueue.length === 0) {
        this.isAnimating = false;
        this.applyDefaultPose();
      }
      return;
    }

    const currentItem = this.animationQueue.shift();
    this.currentStepIndex++;

    if (typeof currentItem === 'string') {
      if (this.onStepChange) this.onStepChange(currentItem);
      setTimeout(() => this.processNextStep(), 300 / this.speed);
      return;
    }

    if (Array.isArray(currentItem)) {
      this.animateFrameGroup(currentItem, () => {
        this.processNextStep();
      });
    }
  }

  private animateFrameGroup(frames: BoneAnimationStep[], onComplete: () => void) {
    if (!this.avatar) return;

    let stepsDone = 0;
    const stepAmount = this.baseStepDelta * this.speed;

    const interval = setInterval(() => {
      if (this.isPaused) return;

      let allReached = true;

      frames.forEach(([boneName, prop, axis, limit, sign]) => {
        const bone = this.avatar?.getObjectByName(boneName);
        if (!bone) return;

        const currentVal = bone[prop][axis];

        if (sign === '+' && currentVal < limit) {
          bone[prop][axis] = Math.min(currentVal + stepAmount, limit);
          allReached = false;
        } else if (sign === '-' && currentVal > limit) {
          bone[prop][axis] = Math.max(currentVal - stepAmount, limit);
          allReached = false;
        }
      });

      stepsDone++;

      if (allReached || stepsDone > 30) {
        clearInterval(interval);
        onComplete();
      }
    }, 25);
  }

  private generateWordFrames(word: string): Array<BoneAnimationStep[] | string> {
    const queue: Array<BoneAnimationStep[] | string> = [];

    // Common words sign dictionary
    if (word === 'HELLO' || word === 'HI') {
      queue.push([
        ['mixamorigRightArm', 'rotation', 'x', -Math.PI / 4, '-'],
        ['mixamorigRightForeArm', 'rotation', 'z', Math.PI / 3, '+'],
        ['mixamorigRightHand', 'rotation', 'z', Math.PI / 6, '+'],
      ]);
      queue.push('HELLO ');
      queue.push([
        ['mixamorigRightHand', 'rotation', 'z', -Math.PI / 6, '-'],
      ]);
      return queue;
    }

    // Spell out letters A-Z for arbitrary words
    const chars = word.split('');
    chars.forEach((ch, idx) => {
      queue.push(this.generateLetterFrame(ch));
      queue.push(ch + (idx === chars.length - 1 ? ' ' : ''));
    });

    return queue;
  }

  private generateLetterFrame(ch: string): BoneAnimationStep[] {
    const charCode = ch.toUpperCase().charCodeAt(0);
    const angleOffset = ((charCode % 10) * Math.PI) / 30;

    return [
      ['mixamorigRightArm', 'rotation', 'x', -Math.PI / 6 - angleOffset, '-'],
      ['mixamorigRightForeArm', 'rotation', 'y', Math.PI / 4 + angleOffset / 2, '+'],
      ['mixamorigRightHand', 'rotation', 'x', Math.PI / 8, '+'],
      ['mixamorigLeftArm', 'rotation', 'x', -Math.PI / 8, '-'],
    ];
  }
}
