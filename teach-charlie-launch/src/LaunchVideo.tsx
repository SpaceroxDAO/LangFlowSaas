import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { VideoBlock, RotateDirection } from "./VideoBlock";
import {
  SectionLabel,
  ProgressBar,
  IntroOverlay,
  OutroOverlay,
} from "./Overlays";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";

// ============================================================
// HERO VIDEO — big 3D slab, no labels
// ============================================================
const HERO_FILE = "overview.mp4";

// ============================================================
// SECTION CONFIG — 3D block sections with labels
// ============================================================
type Section = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  file: string;
  durationInFrames: number;
  enterFrom: RotateDirection;
  exitTo: RotateDirection;
};

const SECTIONS: Section[] = [
  {
    id: "build",
    number: "01",
    title: "Build & deploy your agent",
    subtitle:
      "Start with a guided template, add your docs, test in real scenarios, and publish a shareable link in one flow.",
    file: "build.mp4",
    durationInFrames: 300,
    enterFrom: "right",
    exitTo: "left",
  },
  {
    id: "work",
    number: "02",
    title: "Agent handles real work",
    subtitle:
      "Takes requests, figures out the steps, and gets work done — inside the boundaries you set.",
    file: "work.mp4",
    durationInFrames: 300,
    enterFrom: "right",
    exitTo: "left",
  },
  {
    id: "refine",
    number: "03",
    title: "Refine & optimize",
    subtitle:
      "Improve instructions using feedback, logs, and suggested fixes.",
    file: "refine.mp4",
    durationInFrames: 300,
    enterFrom: "right",
    exitTo: "left",
  },
  {
    id: "route",
    number: "04",
    title: "Route to humans",
    subtitle:
      "Escalate when confidence is low or requests require approval.",
    file: "route.mp4",
    durationInFrames: 300,
    enterFrom: "right",
    exitTo: "left",
  },
  {
    id: "analytics",
    number: "05",
    title: "Analytics & insights",
    subtitle:
      "See what people ask, what works, and where the agent gets stuck — then improve what matters.",
    file: "analytics.mp4",
    durationInFrames: 300,
    enterFrom: "right",
    exitTo: "left",
  },
];

const INTRO_DURATION = 90; // 3s
const OUTRO_DURATION = 120; // 4s

// ============================================================
// HERO SCENE — big wide 3D slab, no labels or progress bar
// ============================================================
const HeroBlockScene: React.FC<{
  mediaMetadata: MediabunnyMetadata;
  heroDurationInFrames: number;
}> = ({ mediaMetadata, heroDurationInFrames }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }} />

      <ThreeCanvas linear width={width} height={height}>
        <ambientLight intensity={1.8} color="#ffffff" />
        <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[-2, 1, 3]}
          intensity={0.2}
          color="#f0f0ff"
        />

        <VideoBlock
          videoSrc={staticFile(HERO_FILE)}
          mediaMetadata={mediaMetadata}
          enterFrom="right"
          exitTo="left"
          isFirst
          isLast={false}
          cameraDistance={1.55}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// ============================================================
// BLOCK SCENE — white bg + 3D video block + labels
// ============================================================
const BlockScene: React.FC<{
  section: Section;
  sectionIndex: number;
  mediaMetadata: MediabunnyMetadata;
}> = ({ section, sectionIndex, mediaMetadata }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }} />

      <ThreeCanvas linear width={width} height={height}>
        <ambientLight intensity={1.8} color="#ffffff" />
        <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[-2, 1, 3]}
          intensity={0.2}
          color="#f0f0ff"
        />

        <VideoBlock
          videoSrc={staticFile(section.file)}
          mediaMetadata={mediaMetadata}
          enterFrom={section.enterFrom}
          exitTo={section.exitTo}
          isFirst={sectionIndex === 0}
          isLast={sectionIndex === SECTIONS.length - 1}
        />
      </ThreeCanvas>

      {/* Section label */}
      <SectionLabel
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
        localFrame={frame}
        durationInFrames={section.durationInFrames}
      />

      {/* Progress bar */}
      <ProgressBar
        currentSection={sectionIndex}
        totalSections={SECTIONS.length}
        sectionProgress={frame / section.durationInFrames}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const LaunchVideo: React.FC<{
  heroMetadata: MediabunnyMetadata | null;
  sectionMetadata: MediabunnyMetadata | null;
  heroDurationInFrames: number;
}> = ({ heroMetadata, sectionMetadata, heroDurationInFrames }) => {
  if (!heroMetadata || !sectionMetadata) {
    throw new Error("Media metadata is not available");
  }

  let currentFrame = 0;
  const sequences: React.ReactNode[] = [];

  // Intro — white, clean typography
  sequences.push(
    <Sequence key="intro" from={currentFrame} durationInFrames={INTRO_DURATION}>
      <IntroOverlay durationInFrames={INTRO_DURATION} />
    </Sequence>,
  );
  currentFrame += INTRO_DURATION;

  // Hero video — big 3D slab, no labels
  sequences.push(
    <Sequence
      key="hero"
      from={currentFrame}
      durationInFrames={heroDurationInFrames}
    >
      <HeroBlockScene
        mediaMetadata={heroMetadata}
        heroDurationInFrames={heroDurationInFrames}
      />
    </Sequence>,
  );
  currentFrame += heroDurationInFrames;

  // Each video section — 3D block with labels (uses section video dimensions)
  SECTIONS.forEach((section, index) => {
    sequences.push(
      <Sequence
        key={section.id}
        from={currentFrame}
        durationInFrames={section.durationInFrames}
      >
        <BlockScene
          section={section}
          sectionIndex={index}
          mediaMetadata={sectionMetadata}
        />
      </Sequence>,
    );
    currentFrame += section.durationInFrames;
  });

  // Outro — CTA
  sequences.push(
    <Sequence key="outro" from={currentFrame} durationInFrames={OUTRO_DURATION}>
      <OutroOverlay durationInFrames={OUTRO_DURATION} />
    </Sequence>,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      {sequences}
    </AbsoluteFill>
  );
};

// ============================================================
// DURATION CALCULATOR
// ============================================================
export const getTotalDuration = (heroDurationInFrames: number) => {
  let total = INTRO_DURATION + heroDurationInFrames + OUTRO_DURATION;
  for (const section of SECTIONS) {
    total += section.durationInFrames;
  }
  return total;
};
