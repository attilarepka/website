"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Glitch
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import * as THREE from "three";
import { useRef } from "react";
import { AdaptiveDpr, Stars } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Group } from "three";
import Icon from "./Icon";
import DepthLabel from "./DepthLabel";
import ShakingCamera from "./ShakingCamera";

function SceneObjects() {
  const { viewport } = useThree();
  const aspect = viewport.width / viewport.height;
  const scaleFactor = aspect < 1 ? 1.5 : 1;
  const cameraZ = 5;
  const vHeight = 2 * cameraZ * Math.tan((50 * Math.PI) / 180 / 2);
  const vWidth = vHeight * aspect;
  const iconDistance =
    aspect < 1 ? Math.min(vWidth * 0.15, 1.5) : Math.min(vWidth * 0.1, 1.5);
  const textHeight = aspect < 1 ? vHeight * 0.15 : vHeight * 0.3;
  const fontSize = (aspect < 1 ? vWidth * 0.1 : vWidth * 0.08) * scaleFactor;
  const depthRef = useRef<{ bokehScale: number }>({ bokehScale: 0 });
  const starsRef = useRef<Group>(null!);
  let theta = 0;

  useFrame(({ mouse }) => {
    const distanceFromCenter = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
    depthRef.current.bokehScale = Math.max(distanceFromCenter * 10, 1.5);
  });

  useFrame((state, delta) => {
    if (starsRef.current) {
      theta += 0.5 * delta;

      const r = 5 * Math.sin(THREE.MathUtils.degToRad(theta));
      starsRef.current.rotation.set(r, r, r);

      const s = 1 + 0.05 * Math.cos(THREE.MathUtils.degToRad(theta * 2));
      starsRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      <DepthLabel positionY={textHeight} fontSize={fontSize} />
      <Icon
        url="/github.png"
        position={[-iconDistance, 0, 0]}
        scaleFactor={scaleFactor}
        onClick={() => window.open("https://github.com/attilarepka", "_blank")}
      />
      <Icon
        url="/linkedin.png"
        position={[iconDistance, 0, 0]}
        scaleFactor={scaleFactor}
        onClick={() =>
          window.open("https://www.linkedin.com/in/attila-repka", "_blank")
        }
      />
      <group ref={starsRef}>
        <Stars
          radius={100 * scaleFactor}
          depth={50 * scaleFactor}
          count={2000}
          factor={10 * scaleFactor}
          saturation={0}
          fade
        />
      </group>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          intensity={1.8}
          luminanceSmoothing={0.9}
        />
        <DepthOfField
          ref={depthRef}
          focusDistance={2}
          focalLength={0.02}
          bokehScale={1.5}
          height={480}
        />
        <Glitch
          delay={[1.5, 3.5]}
          duration={[0.2, 0.6]}
          strength={[0.2, 0.6]}
          ratio={0.85}
          mode={GlitchMode.SPORADIC}
        />
      </EffectComposer>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-screen relative overflow-hidden select-none touch-none">
      {/* linear flat */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <SceneObjects />
        <ShakingCamera />
      </Canvas>
    </div>
  );
}
