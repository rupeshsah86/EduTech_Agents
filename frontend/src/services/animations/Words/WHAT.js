export const WHAT = (ref) => {
  let animations = [];

  // Open palms facing upward gesture for "WHAT"
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 4, "-"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 3, "+"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 3, "-"]);
  animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]);
  animations.push(["mixamorigLeftHand", "rotation", "z", -Math.PI / 6, "-"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", 0, "-"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", 0, "+"]);
  animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigLeftHand", "rotation", "z", 0, "+"]);

  ref.animations.push(animations);

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};
