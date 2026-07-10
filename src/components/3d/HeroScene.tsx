"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";

const clayMat = (color: string, opts?: { roughness?: number }) => (
  <meshStandardMaterial
    color={color}
    roughness={opts?.roughness ?? 0.85}
    metalness={0}
    flatShading
  />
);

const glassMat = (color: string, opacity = 0.6) => (
  <meshPhysicalMaterial
    color={color}
    metalness={0.1}
    roughness={0.05}
    transparent
    opacity={opacity}
    envMapIntensity={1.2}
    side={THREE.DoubleSide}
  />
);

// ─── Animatable Car ───────────────────────────────────────
const CarAnim = ({ color, path, offset = 0 }: { color: string; path: "a" | "b" | "c"; offset?: number }) => {
  const ref = useRef<THREE.Group>(null);

  const s = 2.1;
  const hw = 0.15;
  const route = useMemo(() => {
    if (path === "a") return { pts: [[-s, hw, -s], [s, hw, -s], [s, hw, s], [-s, hw, s]] as const, speed: 0.3 };
    if (path === "b") return { pts: [[-s, hw, s], [s, hw, s], [s, hw, -s], [-s, hw, -s]] as const, speed: 0.4 };
    return { pts: [[s, hw, -s], [-s, hw, -s], [-s, hw, s], [s, hw, s]] as const, speed: 0.35 };
  }, [path]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * route.speed + offset) % 4) / 4;
    const seg = Math.floor(t * 4);
    const frac = (t * 4) % 1;
    const ease = frac < 0.5 ? 2 * frac * frac : -1 + (4 - 2 * frac) * frac;
    const a = route.pts[seg % 4];
    const b = route.pts[(seg + 1) % 4];
    ref.current.position.lerpVectors(
      new THREE.Vector3(a[0], a[1], a[2]),
      new THREE.Vector3(b[0], b[1], b[2]),
      ease,
    );
    ref.current.position.y = hw + Math.sin(t * Math.PI * 2) * 0.01;
    const dx = b[0] - a[0];
    const dz = b[2] - a[2];
    ref.current.rotation.y = Math.atan2(dx, dz);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.22]} />
        {clayMat(color, { roughness: 0.6 })}
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        {clayMat("#1C1C20", { roughness: 0.3 })}
      </mesh>
    </group>
  );
};

// ─── Animatable Tree ──────────────────────────────────────
const TreeAnim = ({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) => {
  const canopyRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!canopyRef.current) return;
    const sway = Math.sin(clock.elapsedTime * 0.6 + x + z) * 0.04;
    canopyRef.current.rotation.z = sway;
    canopyRef.current.rotation.x = sway * 0.5;
  });

  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.015, 0.025, 0.08]} />
        {clayMat("#2A2A2E")}
      </mesh>
      <mesh ref={canopyRef} position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        {clayMat("#2DD4BF")}
      </mesh>
    </group>
  );
};

// ─── Glass Tower with floating + crown pulse ──────────────
const GlassTower = ({ x, z }: { x: number; z: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Mesh>(null);
  const w = 0.8;
  const d = 0.8;
  const h = 2.0;
  const segments = 6;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.04;
    }
    if (crownRef.current) {
      const mat = crownRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + Math.sin(t * 0.8) * 0.1;
    }
  });

  const mullions = useMemo(() => {
    const result: Array<{ x: number; z: number; w: number; d: number; h: number }> = [];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const pos = -w / 2 + t * w;
      result.push({ x: pos, z: 0, w: 0.015, d: d + 0.02, h });
    }
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const pos = -d / 2 + t * d;
      result.push({ x: 0, z: pos, w: w + 0.02, d: 0.015, h });
    }
    return result;
  }, []);

  const floorLines = useMemo(() => {
    const floors = 8;
    const result: Array<{ y: number }> = [];
    for (let i = 1; i < floors; i++) {
      result.push({ y: (i / floors) * h });
    }
    return result;
  }, []);

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#1C1C20" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, h / 2, d / 2 + 0.005]}>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        {glassMat("#3AA0FF", 0.5)}
      </mesh>
      <mesh position={[0, h / 2, -d / 2 - 0.005]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        {glassMat("#3AA0FF", 0.5)}
      </mesh>
      <mesh position={[w / 2 + 0.005, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d * 0.92, h * 0.92]} />
        {glassMat("#2DD4BF", 0.4)}
      </mesh>
      <mesh position={[-w / 2 - 0.005, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[d * 0.92, h * 0.92]} />
        {glassMat("#2DD4BF", 0.4)}
      </mesh>

      {mullions.map((m, i) => (
        <mesh key={`vm-${i}`} position={[m.x, h / 2, m.z]}>
          <boxGeometry args={[m.w, m.h, m.d]} />
          <meshStandardMaterial color="#A1A1AA" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {floorLines.map((f, i) => (
        <mesh key={`fl-${i}`} position={[0, f.y, 0]}>
          <boxGeometry args={[w + 0.04, 0.015, d + 0.04]} />
          <meshStandardMaterial color="#A1A1AA" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}

      <mesh position={[0, h + 0.03, 0]}>
        <boxGeometry args={[w * 1.06, 0.06, d * 1.06]} />
        <meshStandardMaterial color="#D7FF3D" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh ref={crownRef} position={[0, h + 0.08, 0]}>
        <boxGeometry args={[w * 0.3, 0.08, d * 0.3]} />
        <meshStandardMaterial
          color="#D7FF3D"
          emissive="#D7FF3D"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.2, d / 2 + 0.006]}>
        <planeGeometry args={[w * 0.7, 0.35]} />
        {glassMat("#D7FF3D", 0.6)}
      </mesh>
    </group>
  );
};

// ─── Static helpers ───────────────────────────────────────
const SmallBuilding = ({ x, z, w, d, h, color, roofColor, roofStyle = "flat" }: {
  x: number; z: number; w: number; d: number; h: number;
  color: string; roofColor?: string; roofStyle?: "flat" | "pyramid" | "stepped";
}) => {
  const isGlass = color === "glass";
  const mat = isGlass
    ? <meshPhysicalMaterial color="#3AA0FF" metalness={0.1} roughness={0.05} transparent opacity={0.4} envMapIntensity={0.8} side={THREE.DoubleSide} />
    : clayMat(color);

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        {mat}
      </mesh>
      {roofStyle === "pyramid" ? (
        <mesh position={[0, h + 0.2, 0]}>
          <coneGeometry args={[Math.max(w, d) * 0.5, 0.4, 4]} />
          {clayMat(roofColor ?? "#6B6B70")}
        </mesh>
      ) : roofStyle === "stepped" ? (
        <>
          <mesh position={[0, h + 0.08, 0]}>
            <boxGeometry args={[w * 0.8, 0.15, d * 0.8]} />
            {clayMat(roofColor ?? color)}
          </mesh>
          <mesh position={[0, h + 0.2, 0]}>
            <boxGeometry args={[w * 0.5, 0.12, d * 0.5]} />
            {clayMat(roofColor ?? "#D7FF3D")}
          </mesh>
        </>
      ) : (
        <mesh position={[0, h + 0.04, 0]}>
          <boxGeometry args={[w * 1.04, 0.08, d * 1.04]} />
          {clayMat(roofColor ?? color)}
        </mesh>
      )}
    </group>
  );
};

const Road = ({ x, z, w, d }: { x: number; z: number; w: number; d: number }) => (
  <mesh position={[x, -0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[w, d]} />
    <meshStandardMaterial color="#1C1C20" roughness={0.95} metalness={0} />
  </mesh>
);

const RoadLine = ({ x, z, w, d }: { x: number; z: number; w: number; d: number }) => (
  <mesh position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[w, d]} />
    <meshStandardMaterial color="#D7FF3D" transparent opacity={0.12} roughness={1} metalness={0} />
  </mesh>
);

const Ground = () => (
  <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[10, 10]} />
    {clayMat("#131316")}
  </mesh>
);

// ─── Scene assembly ───────────────────────────────────────
const HeroScene = () => {
  const trees = useMemo(() => [
    { x: -2.2, z: -1.8, scale: 1 },
    { x: 2.6, z: -1.6, scale: 1.2 },
    { x: -2.4, z: 1.6, scale: 0.9 },
    { x: 2.4, z: 2.2, scale: 1.1 },
    { x: 0, z: 2.6, scale: 1 },
    { x: -0.8, z: -2.2, scale: 0.8 },
    { x: -2.6, z: -0.4, scale: 1 },
    { x: 2.6, z: 0.8, scale: 0.9 },
  ], []);

  return (
    <SceneCanvas
      className="w-full h-[500px] lg:h-[600px]"
      cameraPosition={[5, 4, 5]}
      withEnvironment
    >
      <group rotation={[0, Math.PI / 4, 0]}>
        <Ground />

        <Road x={0} z={-0.8} w={4.8} d={0.2} />
        <Road x={0} z={0.8} w={4.8} d={0.2} />
        <Road x={-0.8} z={0} w={0.2} d={4.8} />
        <Road x={0.8} z={0} w={0.2} d={4.8} />

        <RoadLine x={0} z={-0.8} w={0.02} d={0.08} />
        <RoadLine x={0} z={0.8} w={0.02} d={0.08} />
        <RoadLine x={-0.8} z={0} w={0.08} d={0.02} />
        <RoadLine x={0.8} z={0} w={0.08} d={0.02} />

        <GlassTower x={0} z={0} />

        <SmallBuilding x={-1.5} z={-1.4} w={0.6} d={0.6} h={1.2} color="#F5F5F7" roofColor="#D7FF3D" roofStyle="stepped" />
        <SmallBuilding x={1.5} z={-1.4} w={0.5} d={0.5} h={0.9} color="#A1A1AA" roofColor="#FF6B7A" roofStyle="pyramid" />
        <SmallBuilding x={-1.5} z={1.4} w={0.8} d={0.5} h={0.5} color="#6B6B70" roofStyle="flat" />
        <SmallBuilding x={1.5} z={1.4} w={0.5} d={0.5} h={0.8} color="#2DD4BF" roofStyle="flat" />
        <SmallBuilding x={0} z={-1.7} w={0.35} d={0.35} h={1.3} color="#F5F5F7" roofColor="#D7FF3D" roofStyle="pyramid" />
        <SmallBuilding x={-0.5} z={1.7} w={0.45} d={0.4} h={0.7} color="glass" roofStyle="flat" />
        <SmallBuilding x={-1.9} z={0} w={0.3} d={0.5} h={0.7} color="#6B6B70" roofStyle="flat" />
        <SmallBuilding x={1.9} z={0} w={0.3} d={0.5} h={1.0} color="#FF6B7A" roofStyle="flat" />
        <SmallBuilding x={0.5} z={-1.7} w={0.35} d={0.35} h={0.6} color="#A1A1AA" roofStyle="flat" />
        <SmallBuilding x={-0.5} z={-1.7} w={0.35} d={0.35} h={0.9} color="#D7FF3D" roofColor="#2DD4BF" roofStyle="pyramid" />

        {/* Animated cars driving around the grid */}
        <CarAnim color="#D7FF3D" path="a" offset={0} />
        <CarAnim color="#FF6B7A" path="b" offset={1.2} />
        <CarAnim color="#3AA0FF" path="c" offset={2.5} />
        <CarAnim color="#22C55E" path="a" offset={0.8} />
        <CarAnim color="#D7FF3D" path="b" offset={3.0} />

        {/* Animated trees swaying */}
        {trees.map((tree, i) => <TreeAnim key={`tree-${i}`} {...tree} />)}
      </group>
    </SceneCanvas>
  );
};

export default HeroScene;
