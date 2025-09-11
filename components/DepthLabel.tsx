"use client";
import { a, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";
import { Text } from "@react-three/drei";

const scrambleChars = "█▓▒░#@$%&*!?";

function scrambleTransition(from: string, to: string, progress: number) {
  const maxLen = Math.max(from.length, to.length);
  return Array.from({ length: maxLen })
    .map((_, i) => {
      const fromCh = from[i] || " ";
      const toCh = to[i] || " ";
      if (progress === 1) return toCh;
      if (progress === 0) return fromCh;

      if (Math.random() < progress) return toCh;
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    })
    .join("");
}

export default function DepthLabel({
  positionY = 0,
  fontSize
}: {
  positionY?: number;
  fontSize: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [scrambledName, setScrambledName] = useState("attila repka");
  const [scrambledEmail, setScrambledEmail] = useState("contact me");

  const textSpring = useSpring({
    opacity_name: hovered ? 0 : 1,
    opacity_email: hovered ? 1 : 0,
    scale: hovered ? 1.2 : 1,
    config: { tension: 80, friction: 30 }
  });

  const encoded = "YXR0aWxhQHJlcGthLmh1Cg==";
  const email = atob(encoded);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;

    function animateScramble(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / 800); // 0.8s

      if (hovered) {
        setScrambledName(scrambleTransition("attila repka", "", progress));
        setScrambledEmail(scrambleTransition("", "contact me", progress));
      } else {
        setScrambledName(scrambleTransition("", "attila repka", progress));
        setScrambledEmail(scrambleTransition("contact me", "", progress));
      }

      if (progress < 1) frame = requestAnimationFrame(animateScramble);
    }

    frame = requestAnimationFrame(animateScramble);
    return () => cancelAnimationFrame(frame);
  }, [hovered]);

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
        {scrambledName}
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
        {scrambledEmail}
      </Text>
    </a.group>
  );
}
