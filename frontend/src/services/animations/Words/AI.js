export const AI = (ref) => {
  let animations = [];

  // Index and Pinky extended gesture for AI (A + I sign combo)
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
  animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "="]);
  animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "="]);
  animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
  animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);

  ref.animations.push(animations);

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};
