"use client";
import { CameraShake } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const ORIGINAL_CAMERA_Z = 5;

export default function ShakingCamera() {
  const vec = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useFrame(() => {
    vec.current.set(vec.current.x, vec.current.y, ORIGINAL_CAMERA_Z);
    camera.position.lerp(vec.current, 0.05);
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
