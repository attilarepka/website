"use client";
import { a, useSpring } from "@react-spring/three";
import { useState } from "react";
import { Text } from "@react-three/drei";

export default function DepthLabel({ positionY = 0, fontSize }) {
  const [hovered, setHovered] = useState(false);

  const textSpring = useSpring({
    opacity_name: hovered ? 0 : 1,
    opacity_email: hovered ? 1 : 0,
    scale: hovered ? 1.2 : 1,
    config: { tension: 80, friction: 30 }
  });

  const encoded = "YXR0aWxhQHJlcGthLmh1Cg==";
  const email = atob(encoded);

  return (
    <a.group
      position={[0, positionY, 0]}
      scale={textSpring.scale}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        setHovered(false);
      }}
      onClick={() => {
        window.location.href = `mailto:${email}`;
      }}
    >
      <Text fontSize={fontSize} color="white" anchorX="center" anchorY="middle">
        <a.meshStandardMaterial
          attach="material"
          color="white"
          opacity={textSpring.opacity_name}
          transparent
          depthWrite={false}
        />
        attila repka
      </Text>

      <Text
        fontSize={fontSize}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.01]}
      >
        <a.meshStandardMaterial
          attach="material"
          color="white"
          opacity={textSpring.opacity_email}
          transparent
          depthWrite={false}
        />
        contact me
      </Text>
    </a.group>
  );
}
