import { useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Texture, Color } from "three";
import { roundedRect } from "./helpers/rounded-rectangle";
import { RoundedBox } from "./RoundedBox";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";

// A large 3D display block — nearly fills the viewport.
// Enters by rotating in, idles with gentle tilt, exits by rotating out.
// This creates the illusion of a single cube turning face-by-face.

const BLOCK_THICKNESS = 0.08;
const BLOCK_RADIUS = 0.04;
const BLOCK_BEVEL = 0.015;
const CURVE_SEGMENTS = 16;
const SCREEN_RADIUS = 0.03;
const CAMERA_DISTANCE = 2.2;

// Direction the cube "turns from" for this section
export type RotateDirection = "left" | "right" | "up" | "down";

export const VideoBlock: React.FC<{
  readonly videoSrc: string;
  readonly mediaMetadata: MediabunnyMetadata;
  readonly enterFrom: RotateDirection;
  readonly exitTo: RotateDirection;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly cameraDistance?: number;
}> = ({ videoSrc, mediaMetadata, enterFrom, exitTo, isFirst, isLast, cameraDistance = CAMERA_DISTANCE }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slab dimensions — preserve actual video aspect ratio, no stretching
  const aspectRatio =
    mediaMetadata.dimensions.width / mediaMetadata.dimensions.height;
  const blockHeight = 1.55;
  const blockWidth = blockHeight * aspectRatio;
  const screenWidth = blockWidth - BLOCK_BEVEL * 2;
  const screenHeight = blockHeight - BLOCK_BEVEL * 2;

  // === CAMERA ===
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(0, 0, cameraDistance);
    camera.near = 0.1;
    camera.far = 50;
    camera.lookAt(0, 0, 0);
  }, [camera, cameraDistance]);

  // === ENTRANCE ===
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 80, mass: 1.8, stiffness: 90 },
  });

  const enterAngle = Math.PI / 2;
  const enterRotY =
    enterFrom === "left" || enterFrom === "right"
      ? interpolate(
          enterSpring,
          [0, 1],
          [enterFrom === "left" ? -enterAngle : enterAngle, 0],
        )
      : 0;
  const enterRotX =
    enterFrom === "up" || enterFrom === "down"
      ? interpolate(
          enterSpring,
          [0, 1],
          [enterFrom === "up" ? enterAngle : -enterAngle, 0],
        )
      : 0;

  // === EXIT ===
  const exitStart = durationInFrames - (isLast ? 30 : 18);
  const exitProgress =
    frame > exitStart
      ? interpolate(frame, [exitStart, durationInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : 0;

  const exitAngle = Math.PI / 2;
  const exitRotY =
    exitTo === "left" || exitTo === "right"
      ? interpolate(
          exitProgress,
          [0, 1],
          [0, exitTo === "right" ? exitAngle : -exitAngle],
        )
      : 0;
  const exitRotX =
    exitTo === "up" || exitTo === "down"
      ? interpolate(
          exitProgress,
          [0, 1],
          [0, exitTo === "down" ? -exitAngle : exitAngle],
        )
      : 0;

  // === IDLE TILT — subtle, never loses sight of the video ===
  const idlePhase = frame * 0.012;
  const idleTiltX = Math.sin(idlePhase) * 0.025;
  const idleTiltY = Math.cos(idlePhase * 0.7) * 0.03;
  const hoverY = Math.sin(idlePhase * 1.1) * 0.008;

  // === COMPOSE ===
  const rotX = enterRotX + exitRotX + idleTiltX;
  const rotY = enterRotY + exitRotY + idleTiltY;
  const posY = hoverY;

  // === VIDEO TEXTURE ===
  const screenGeometry = useMemo(() => {
    return roundedRect({
      width: screenWidth,
      height: screenHeight,
      radius: SCREEN_RADIUS,
    });
  }, [screenWidth, screenHeight]);

  const [canvasEl] = useState(() => {
    return new OffscreenCanvas(
      mediaMetadata.dimensions.width,
      mediaMetadata.dimensions.height,
    );
  });

  const [ctx] = useState(() => {
    const c = canvasEl.getContext("2d");
    if (!c) throw new Error("Failed to get 2d context");
    return c;
  });

  const [texture] = useState<Texture>(() => {
    const tex = new CanvasTexture(canvasEl);
    tex.repeat.y = 1 / screenHeight;
    tex.repeat.x = 1 / screenWidth;
    return tex;
  });

  const { invalidate } = useThree();

  const onVideoFrame = useCallback(
    (videoFrame: CanvasImageSource) => {
      ctx.drawImage(videoFrame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [ctx, texture, invalidate],
  );

  return (
    <group rotation={[rotX, rotY, 0]} position={[0, posY, 0]}>
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />

      {/* Block body — dark bezel like a real monitor */}
      <RoundedBox
        radius={BLOCK_RADIUS}
        depth={BLOCK_THICKNESS}
        curveSegments={CURVE_SEGMENTS}
        position={[-blockWidth / 2, -blockHeight / 2, 0]}
        width={blockWidth}
        height={blockHeight}
      >
        <meshPhongMaterial color="#1a1a1a" shininess={40} />
      </RoundedBox>

      {/* Video screen */}
      <mesh
        position={[
          -screenWidth / 2,
          -screenHeight / 2,
          BLOCK_THICKNESS + 0.001,
        ]}
      >
        <shapeGeometry args={[screenGeometry]} />
        <meshBasicMaterial color={0xffffff} toneMapped={false} map={texture} />
      </mesh>

      {/* Soft shadow beneath the block */}
      <mesh
        position={[0, -blockHeight / 2 - 0.15, -0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[blockWidth * 0.9, 0.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.06} />
      </mesh>
    </group>
  );
};
