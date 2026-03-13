import React, { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as THREE from "three";

// Floating particle field that drifts gently through the scene
export const ParticleField: React.FC<{
  count?: number;
  spread?: number;
  color?: string;
  opacity?: number;
}> = ({ count = 120, spread = 8, color = "#7C3AED", opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
    }
    return arr;
  }, [count, spread]);

  // Gentle global drift
  const drift = (frame / durationInFrames) * Math.PI * 2;
  const groupX = Math.sin(drift * 0.3) * 0.15;
  const groupY = Math.cos(drift * 0.2) * 0.1;

  return (
    <group position={[groupX, groupY, -2]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={color}
          transparent
          opacity={opacity}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

// Soft ambient glow orbs that pulse and drift
export const GlowOrbs: React.FC<{
  count?: number;
}> = ({ count = 5 }) => {
  const frame = useCurrentFrame();

  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: -1 - Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.15 + Math.random() * 0.2,
      color: ["#7C3AED", "#A78BFA", "#6D28D9", "#8B5CF6", "#C4B5FD"][
        i % 5
      ],
    }));
  }, [count]);

  return (
    <group>
      {orbs.map((orb, i) => {
        const phase = frame * 0.015 * orb.speed + orb.phase;
        const x = orb.x + Math.sin(phase) * 0.3;
        const y = orb.y + Math.cos(phase * 0.7) * 0.2;
        const pulseScale = 1 + Math.sin(phase * 2) * 0.15;

        return (
          <mesh key={i} position={[x, y, orb.z]} scale={pulseScale}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshBasicMaterial
              color={orb.color}
              transparent
              opacity={0.08 + Math.sin(phase) * 0.04}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Thin grid lines on the "floor" for depth reference
export const GridFloor: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.002;

  return (
    <group position={[0, -1.5, -1]} rotation={[-Math.PI / 3, 0, drift]}>
      <gridHelper
        args={[20, 40, "#7C3AED", "#7C3AED"]}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
};

// Cinematic lighting rig
export const CinematicLighting: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame * 0.008;

  // Key light shifts subtly
  const keyX = 4 + Math.sin(phase) * 0.5;
  const keyY = 3 + Math.cos(phase * 0.7) * 0.3;

  return (
    <>
      {/* Key light - warm */}
      <spotLight
        position={[keyX, keyY, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />
      {/* Fill light - cool purple tint */}
      <pointLight position={[-5, 2, 3]} intensity={0.4} color="#A78BFA" />
      {/* Rim light from behind */}
      <pointLight position={[0, -1, -4]} intensity={0.3} color="#7C3AED" />
      {/* Ambient base */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
    </>
  );
};
