import React, { useRef } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

// Cube Flip Transition
export const CubeFlipTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const rotationY = interpolate(progress, [0, 1], [0, Math.PI / 2]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh rotation={[0, rotationY, 0]}>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="#7C3AED" metalness={0.8} roughness={0.2} />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Page Flip Transition
export const PageFlipTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const rotationY = interpolate(progress, [0, 1], [-Math.PI, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 4] }}
      >
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 5, 5]} angle={0.3} />
        <mesh rotation={[0, rotationY, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[5, 3]} />
          <meshStandardMaterial
            color="#ffffff"
            side={THREE.DoubleSide}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Sphere Morph Transition
export const SphereMorphTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const scale = interpolate(progress, [0, 0.5, 1], [1, 3, 1]);
  const rotationX = interpolate(progress, [0, 1], [0, Math.PI * 2]);
  const rotationY = interpolate(progress, [0, 1], [0, Math.PI * 3]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <mesh rotation={[rotationX, rotationY, 0]} scale={scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#7C3AED"
            metalness={0.9}
            roughness={0.1}
            emissive="#7C3AED"
            emissiveIntensity={0.3}
          />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Ripple Wave Transition
export const RippleTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const rippleScale = interpolate(progress, [0, 1], [0, 10]);
  const opacity = interpolate(progress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 10] }}
      >
        <ambientLight intensity={1} />
        {[...Array(5)].map((_, i) => {
          const delay = i * 0.2;
          const scale = interpolate(
            progress,
            [delay, delay + 0.5],
            [0, rippleScale / (i + 1)],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          const ringOpacity = interpolate(
            progress,
            [delay, delay + 0.5, delay + 1],
            [1, 0.5, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <mesh key={i} scale={scale} rotation={[0, 0, 0]}>
              <torusGeometry args={[1, 0.1, 16, 100]} />
              <meshBasicMaterial
                color="#7C3AED"
                transparent
                opacity={ringOpacity}
              />
            </mesh>
          );
        })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Particle Explosion Transition
export const ParticleExplosionTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = interpolate(progress, [0, 1], [0, 8]);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const scale = interpolate(progress, [0, 0.5, 1], [1, 0.5, 0.1]);

    return { x, y, scale, angle };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 10] }}
      >
        <ambientLight intensity={1} />
        {particles.map((particle, i) => (
          <mesh
            key={i}
            position={[particle.x, particle.y, 0]}
            scale={particle.scale}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#7C3AED" />
          </mesh>
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Spiral Tunnel Transition
export const SpiralTunnelTransition: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const rotationZ = interpolate(progress, [0, 1], [0, Math.PI * 4]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 2, 0.1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 75, position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 10]} intensity={2} />
        {[...Array(10)].map((_, i) => {
          const zPos = interpolate(progress, [0, 1], [i * 2, i * 2 + 10]);
          return (
            <mesh
              key={i}
              position={[0, 0, -zPos]}
              rotation={[0, 0, rotationZ + i * 0.5]}
              scale={scale}
            >
              <torusGeometry args={[1 + i * 0.2, 0.1, 16, 100]} />
              <meshStandardMaterial
                color="#7C3AED"
                emissive="#7C3AED"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Get transition by index (cycles through different effects)
export const getTransition = (index: number) => {
  const transitions = [
    CubeFlipTransition,
    PageFlipTransition,
    SphereMorphTransition,
    RippleTransition,
    ParticleExplosionTransition,
    SpiralTunnelTransition,
  ];
  return transitions[index % transitions.length];
};
