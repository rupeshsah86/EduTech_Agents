export const EDUVERSE = (ref) => {
  let animations = [];

  // Crown / Brain sweeping gesture for EDUVERSE
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.2, "-"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2.2, "-"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "+"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 4, "-"]);

  ref.animations.push(animations);

  animations = [];
  animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", 0, "-"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", 0, "+"]);

  ref.animations.push(animations);

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};
