// Text-to-Sign 3D Avatar Animation Engine Wrapper (Project 2 Integration)
import * as THREE from 'three';
// @ts-ignore
import * as alphabets from './animations/alphabets';
// @ts-ignore
import * as words from './animations/words';
// @ts-ignore
import { defaultPose } from './animations/defaultPose';

export type BoneAnimationStep = [string, 'rotation' | 'position', 'x' | 'y' | 'z', number, '+' | '-'];

export class AvatarAnimationEngine {
  private avatar: THREE.Object3D | null = null;
  private isAnimating: boolean = false;
  private isPaused: boolean = false;
  private speed: number = 1.0; // 0.5x, 1.0x, 1.5x, 2.0x multiplier
  private onStepChange?: (textChunk: string) => void;
  private breathingAngle: number = 0;
  
  // Internal ref object required by Hear_Aid animation modules
  public ref: any;

  constructor(avatarObj?: THREE.Object3D) {
    this.ref = {
      animations: [],
      characters: [],
      pending: false,
      flag: false,
      pause: 600,
      speed: 0.1,
      avatar: null,
      animate: () => this.runAnimationLoop(),
    };

    if (avatarObj) {
      this.setAvatar(avatarObj);
    }
  }

  public setAvatar(avatarObj: THREE.Object3D) {
    this.avatar = avatarObj;
    this.ref.avatar = avatarObj;
    this.applyDefaultPose();
  }

  public setSpeed(speedMultiplier: number) {
    this.speed = speedMultiplier;
    this.ref.speed = 0.1 * speedMultiplier;
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
   * Applies baseline natural posture to avatar using Hear_Aid defaultPose
   */
  public applyDefaultPose() {
    if (!this.avatar) return;

    try {
      this.ref.animations = [];
      this.ref.pending = true;
      defaultPose(this.ref);
    } catch {
      // Fallback pose
      const defaultRotations: Record<string, [number, number, number]> = {
        mixamorigNeck: [Math.PI / 12, 0, 0],
        mixamorigLeftArm: [0, 0, -Math.PI / 3.5],
        mixamorigLeftForeArm: [0, -Math.PI / 2.2, 0],
        mixamorigRightArm: [0, 0, Math.PI / 3.5],
        mixamorigRightForeArm: [0, Math.PI / 2.2, 0],
      };

      Object.entries(defaultRotations).forEach(([boneName, [x, y, z]]) => {
        const bone = this.avatar?.getObjectByName(boneName);
        if (bone) {
          bone.rotation.set(x, y, z);
        }
      });
    }
  }

  /**
   * Translates text into Hear_Aid sign language keyframe animations
   */
  public playSentence(sentence: string, onStepText?: (txt: string) => void) {
    if (!this.avatar || !sentence.trim()) return;
    this.onStepChange = onStepText;
    this.isPaused = false;
    this.isAnimating = true;

    this.ref.animations = [];
    this.ref.flag = false;
    this.ref.pending = true;

    const wordsArr = sentence.trim().toUpperCase().split(/\s+/).filter(Boolean);

    wordsArr.forEach((word, wi) => {
      const isLastWord = wi === wordsArr.length - 1;

      if (words[word]) {
        words[word](this.ref);
        this.ref.animations.push(['add-text', isLastWord ? word : word + ' ']);
      } else {
        word.split('').forEach((ch, idx) => {
          const digitMap: Record<string, string> = {
            '0': 'ZERO',
            '1': 'ONE',
            '2': 'TWO',
            '3': 'THREE_NUM',
            '4': 'FOUR',
            '5': 'FIVE',
            '6': 'SIX',
            '7': 'SEVEN',
            '8': 'EIGHT',
            '9': 'NINE',
          };
          const key = digitMap[ch] || ch;
          const isLastChar = idx === word.length - 1;

          if (alphabets[key]) {
            alphabets[key](this.ref);
          } else if (alphabets['A']) {
            alphabets['A'](this.ref);
          }
          this.ref.animations.push(['add-text', isLastChar && !isLastWord ? ch + ' ' : ch]);
        });
      }
    });

    this.runAnimationLoop();
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

  private runAnimationLoop() {
    if (!this.avatar || !this.ref.animations || !this.ref.animations.length || this.isPaused) {
      if (!this.ref.animations || !this.ref.animations.length) {
        this.isAnimating = false;
        this.ref.pending = false;
      }
      return;
    }

    const currentFrameGroup = this.ref.animations[0];

    if (!currentFrameGroup || !currentFrameGroup.length) {
      this.ref.flag = true;
      setTimeout(() => {
        this.ref.flag = false;
        this.ref.animations.shift();
        this.runAnimationLoop();
      }, (this.ref.pause || 600) / this.speed);
      return;
    }

    // Check if text marker frame
    if (currentFrameGroup[0] === 'add-text') {
      const textChunk = currentFrameGroup[1];
      if (this.onStepChange) this.onStepChange(textChunk);
      this.ref.animations.shift();
      this.runAnimationLoop();
      return;
    }

    // Step bone rotations toward target angles
    if (!this.ref.flag && Array.isArray(currentFrameGroup)) {
      let anyMoved = false;
      const stepDelta = (this.ref.speed || 0.1) * this.speed;

      for (let i = 0; i < currentFrameGroup.length; ) {
        const item = currentFrameGroup[i];
        if (!Array.isArray(item) || item.length < 5) {
          currentFrameGroup.splice(i, 1);
          continue;
        }

        const [boneName, prop, axis, limit, sign] = item;
        const bone = this.avatar.getObjectByName(boneName);

        if (!bone) {
          currentFrameGroup.splice(i, 1);
          continue;
        }

        const targetObj = (bone as any)[prop];
        if (!targetObj) {
          currentFrameGroup.splice(i, 1);
          continue;
        }

        const currVal = targetObj[axis];

        if (sign === '+' && currVal < limit) {
          targetObj[axis] = Math.min(currVal + stepDelta, limit);
          anyMoved = true;
          i++;
        } else if (sign === '-' && currVal > limit) {
          targetObj[axis] = Math.max(currVal - stepDelta, limit);
          anyMoved = true;
          i++;
        } else {
          currentFrameGroup.splice(i, 1);
        }
      }

      if (!anyMoved || currentFrameGroup.length === 0) {
        this.ref.flag = true;
        setTimeout(() => {
          this.ref.flag = false;
          this.ref.animations.shift();
          this.runAnimationLoop();
        }, (this.ref.pause || 400) / this.speed);
        return;
      }
    }

    setTimeout(() => {
      this.runAnimationLoop();
    }, 25);
  }
}
