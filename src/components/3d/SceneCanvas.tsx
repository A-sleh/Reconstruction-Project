"use client";

import { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";

const Environment = lazy(() =>
  import("@react-three/drei").then((mod) => ({ default: mod.Environment }))
);

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  gl?: Record<string, unknown>;
  dpr?: [number, number] | number;
  withEnvironment?: boolean;
}

const SceneCanvas = ({
  children,
  className = "w-full h-full",
  cameraPosition = [0, 0, 5],
  gl = { antialias: true, alpha: true },
  dpr = [1, 2],
  withEnvironment = false,
}: SceneCanvasProps) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov: 45, near: 0.1, far: 100 }}
        gl={gl}
        dpr={dpr}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#D7FF3D" />
          {children}
          {withEnvironment && (
            <Suspense fallback={null}>
              <Environment preset="city" />
            </Suspense>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
