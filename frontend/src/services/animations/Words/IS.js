export const IS = (ref) => {
  let animations = [];

  // Index finger extended forward gesture for "IS"
  animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "="]);
  animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "="]);
  animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
  animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"]);
  animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"]);
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);

  ref.animations.push(animations);

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};
