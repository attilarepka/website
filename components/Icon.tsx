"use client";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useRef } from "react";

export default function Icon({ url, position, onClick, scaleFactor = 1 }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const size = viewport.width * 0.1 * scaleFactor;

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? size * 1.2 : size;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (materialRef.current) {
      const targetIntensity = hovered ? 1 : 0.01;
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        transparent
        emissive={new THREE.Color("white")}
        emissiveIntensity={0.01}
      />
    </mesh>
  );
}
