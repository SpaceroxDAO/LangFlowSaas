import { useThree } from "@react-three/fiber";
import React, { useCallback, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Texture, DoubleSide, Color } from "three";
import { roundedRect } from "./helpers/rounded-rectangle";
import { RoundedBox } from "./RoundedBox";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";

// Slab design constants
const SLAB_THICKNESS = 0.06;
const SLAB_RADIUS = 0.05;
const SLAB_BEVEL = 0.025;
const SLAB_CURVE_SEGMENTS = 12;
const SCREEN_RADIUS = 0.035;

export type SlabMotion = {
  // Where the slab enters from
  enterFrom: [number, number, number];
  // Where it rests while the video plays
  restAt: [number, number, number];
  // Where it exits to
  exitTo: [number, number, number];
  // Subtle idle rotation axis emphasis
  idleTiltAxis: "x" | "y" | "xy";
  // Gentle idle tilt amplitude in radians
  idleTiltAmount: number;
  // Speed multiplier for idle drift
  idleSpeed: number;
};

export const VideoSlab: React.FC<{
  readonly videoSrc: string;
  readonly mediaMetadata: MediabunnyMetadata;
  readonly localFrame: number;
  readonly durationInFrames: number;
  readonly motion: SlabMotion;
  readonly accentColor: string;
}> = ({
  videoSrc,
  mediaMetadata,
  localFrame,
  durationInFrames,
  motion,
  accentColor,
}) => {
  const { fps } = useVideoConfig();

  // Slab dimensions based on video aspect ratio
  const aspectRatio =
    mediaMetadata.dimensions.width / mediaMetadata.dimensions.height;
  const slabHeight = 1.4;
  const slabWidth = slabHeight * aspectRatio;
  const screenWidth = slabWidth - SLAB_BEVEL * 2;
  const screenHeight = slabHeight - SLAB_BEVEL * 2;

  // === ENTRANCE ANIMATION ===
  const enterDuration = 25; // frames
  const enterProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 80, mass: 2, stiffness: 80 },
  });

  // === EXIT ANIMATION ===
  const exitStart = durationInFrames - 20;
  const exitProgress =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, durationInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : 0;

  // === IDLE FLOATING ANIMATION ===
  // Gentle breathing/floating while video plays
  const idlePhase = (localFrame * motion.idleSpeed * 0.02) % (Math.PI * 2);

  const idleTiltX =
    motion.idleTiltAxis === "x" || motion.idleTiltAxis === "xy"
      ? Math.sin(idlePhase) * motion.idleTiltAmount
      : Math.sin(idlePhase * 0.7) * motion.idleTiltAmount * 0.3;

  const idleTiltY =
    motion.idleTiltAxis === "y" || motion.idleTiltAxis === "xy"
      ? Math.cos(idlePhase * 0.8) * motion.idleTiltAmount
      : Math.cos(idlePhase * 0.6) * motion.idleTiltAmount * 0.3;

  const idleTiltZ = Math.sin(idlePhase * 0.5) * motion.idleTiltAmount * 0.15;

  // Gentle hover bob
  const hoverY = Math.sin(idlePhase * 1.3) * 0.015;
  const hoverX = Math.cos(idlePhase * 0.9) * 0.008;

  // === COMPOSE POSITION ===
  const posX = interpolate(
    enterProgress,
    [0, 1],
    [motion.enterFrom[0], motion.restAt[0] + hoverX],
  );
  const posY = interpolate(
    enterProgress,
    [0, 1],
    [motion.enterFrom[1], motion.restAt[1] + hoverY],
  );
  const posZ = interpolate(
    enterProgress,
    [0, 1],
    [motion.enterFrom[2], motion.restAt[2]],
  );

  // Apply exit
  const finalX = interpolate(exitProgress, [0, 1], [posX, motion.exitTo[0]]);
  const finalY = interpolate(exitProgress, [0, 1], [posY, motion.exitTo[1]]);
  const finalZ = interpolate(exitProgress, [0, 1], [posZ, motion.exitTo[2]]);

  // === COMPOSE ROTATION ===
  const entranceRotY = interpolate(enterProgress, [0, 1], [Math.PI * 0.5, 0]);
  const exitRotY = interpolate(exitProgress, [0, 1], [0, -Math.PI * 0.4]);

  const rotX = idleTiltX;
  const rotY = entranceRotY + exitRotY + idleTiltY;
  const rotZ = idleTiltZ;

  // === SCALE ===
  const scaleIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 60, mass: 1.5 },
  });
  const scaleOut = interpolate(exitProgress, [0, 1], [1, 0.7]);
  const scale = scaleIn * scaleOut;

  // === VIDEO TEXTURE ===
  const screenGeometry = useMemo(() => {
    return roundedRect({
      width: screenWidth,
      height: screenHeight,
      radius: SCREEN_RADIUS,
    });
  }, [screenWidth, screenHeight]);

  const [canvasTexture] = useState(() => {
    return new OffscreenCanvas(
      mediaMetadata.dimensions.width,
      mediaMetadata.dimensions.height,
    );
  });

  const [context] = useState(() => {
    const ctx = canvasTexture.getContext("2d");
    if (!ctx) throw new Error("Failed to get context");
    return ctx;
  });

  const [texture] = useState<Texture>(() => {
    const tex = new CanvasTexture(canvasTexture);
    tex.repeat.y = 1 / screenHeight;
    tex.repeat.x = 1 / screenWidth;
    return tex;
  });

  const { invalidate } = useThree();

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      context.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [context, texture, invalidate],
  );

  // Accent color for the slab edge glow
  const glowColor = new Color(accentColor);

  return (
    <group
      scale={scale}
      rotation={[rotX, rotY, rotZ]}
      position={[finalX, finalY, finalZ]}
    >
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />

      {/* Slab body */}
      <RoundedBox
        radius={SLAB_RADIUS}
        depth={SLAB_THICKNESS}
        curveSegments={SLAB_CURVE_SEGMENTS}
        position={[-slabWidth / 2, -slabHeight / 2, 0]}
        width={slabWidth}
        height={slabHeight}
      >
        <meshPhongMaterial
          color="#1a1a2e"
          shininess={60}
          specular={glowColor}
        />
      </RoundedBox>

      {/* Screen surface */}
      <mesh
        position={[
          -screenWidth / 2,
          -screenHeight / 2,
          SLAB_THICKNESS + 0.001,
        ]}
      >
        <shapeGeometry args={[screenGeometry]} />
        <meshBasicMaterial color={0xffffff} toneMapped={false} map={texture} />
      </mesh>

      {/* Subtle edge glow ring */}
      <mesh position={[0, 0, SLAB_THICKNESS / 2]} rotation={[0, 0, 0]}>
        <ringGeometry
          args={[
            Math.max(slabWidth, slabHeight) * 0.52,
            Math.max(slabWidth, slabHeight) * 0.525,
            64,
          ]}
        />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.4 + Math.sin(idlePhase * 2) * 0.15}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};
