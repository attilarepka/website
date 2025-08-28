"use client";
import { CameraShake } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

export default function ShakingCamera() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera } = useThree();
  const originalZ = 5;

  useFrame(() => {
    vec.set(vec.x, vec.y, originalZ);
    camera.position.lerp(vec, 0.05);
  });

  return (
    <CameraShake
      maxYaw={0.01}
      maxPitch={0.01}
      maxRoll={0.01}
      yawFrequency={0.5}
      pitchFrequency={0.5}
      rollFrequency={0.4}
    />
  );
}
