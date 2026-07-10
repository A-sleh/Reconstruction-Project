"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";

interface ProductSceneProps {
  variant?: "chart" | "graph" | "building" | "grid";
}

const ChartBars = () => {
  const bars = [
    { position: [-1.2, 0.5, 0], height: 1 },
    { position: [-0.4, 0.8, 0], height: 1.6 },
    { position: [0.4, 1, 0], height: 2 },
    { position: [1.2, 0.6, 0], height: 1.2 },
  ];

  return (
    <group>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position}>
          <boxGeometry args={[0.4, bar.height, 0.4]} />
          <meshStandardMaterial
            color="#D7FF3D"
            transparent
            opacity={0.6 + i * 0.1}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const NetworkGraph = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const nodes = [
    [0, 0, 0],
    [1.2, 0.3, 0.5],
    [-1, 0.5, -0.3],
    [0.5, -0.4, 1],
    [-0.8, -0.2, -1.2],
    [0.3, 0.8, -0.7],
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D7FF3D" emissive="#D7FF3D" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {nodes.map((from, i) =>
        nodes.slice(i + 1).map((to, j) => (
          <line key={`${i}-${j}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  from[0], from[1], from[2],
                  to[0], to[1], to[2],
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#2A2A2E" transparent opacity={Math.random() * 0.5 + 0.2} />
          </line>
        ))
      )}
    </group>
  );
};

const ProductScene = ({ variant = "chart" }: ProductSceneProps) => {
  const scene = variant === "graph" ? <NetworkGraph /> : <ChartBars />;

  return (
    <SceneCanvas
      className="w-full h-[300px]"
      cameraPosition={[0, 0, 4]}
    >
      <Float speed={1} floatIntensity={0.2}>
        {scene}
      </Float>
    </SceneCanvas>
  );
};

export default ProductScene;
