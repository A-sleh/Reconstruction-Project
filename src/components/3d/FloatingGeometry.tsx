"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface FloatingGeometryProps {
  variant?: "icosahedron" | "torusKnot" | "octahedron" | "dodecahedron";
  color?: string;
  position?: [number, number, number];
  scale?: number;
  wireframe?: boolean;
  opacity?: number;
  speed?: number;
}

const geometries = {
  icosahedron: <icosahedronGeometry args={[1, 0]} />,
  torusKnot: <torusKnotGeometry args={[0.8, 0.3, 64, 8]} />,
  octahedron: <octahedronGeometry args={[1, 0]} />,
  dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
};

const FloatingGeometry = ({
  variant = "icosahedron",
  color = "#D7FF3D",
  position = [0, 0, 0],
  scale = 1,
  wireframe = true,
  opacity = 0.3,
  speed = 1.5,
}: FloatingGeometryProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3 * speed;
      meshRef.current.rotation.y += delta * 0.5 * speed;
    }
  });

  return (
    <Float speed={speed} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometries[variant]}
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          transparent
          opacity={opacity}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
};

export default FloatingGeometry;
