export const STRUCTURES = (ref) => {
  let animations = [];

  // Building / Stacking gesture for STRUCTURES
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 4, "-"]);
  animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 4, "+"]);
  animations.push(["mixamorigLeftHand", "rotation", "z", -Math.PI / 4, "-"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 3, "-"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
  animations.push(["mixamorigLeftHand", "rotation", "z", 0, "+"]);

  ref.animations.push(animations);

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};
