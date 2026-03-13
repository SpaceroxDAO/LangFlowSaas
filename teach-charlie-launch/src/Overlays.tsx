import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ============================================================
// FONT FAMILY — matches teachcharlie.ai
// ============================================================
const FONT =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ============================================================
// DOG LOGO — Charlie mascot
// ============================================================
const DogLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#111111",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.25 16.25h1.5L12 17z" />
    <path d="M16 14v.5" />
    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
    <path d="M8 14v.5" />
    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
  </svg>
);

// ============================================================
// SECTION TITLE — clean, top-left, numbered like the website
// ============================================================
export const SectionLabel: React.FC<{
  number: string; // "01"
  title: string; // "Build & deploy your agent"
  subtitle: string; // "Start with a guided template…"
  localFrame: number;
  durationInFrames: number;
}> = ({ number, title, subtitle, localFrame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: localFrame - 8,
    fps,
    config: { damping: 60, mass: 1 },
  });

  const exitStart = durationInFrames - 18;
  const exitOpacity =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const slideY = interpolate(enter, [0, 1], [24, 0]);
  const opacity = enter * exitOpacity;

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 64,
        opacity,
        transform: `translateY(${slideY}px)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <DogLogo size={28} color="#111111" />
        {number ? (
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#d1d5db",
              fontFamily: FONT,
              letterSpacing: "0.02em",
            }}
          >
            {number}.
          </span>
        ) : null}
        <span
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#111111",
            fontFamily: FONT,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: "#9ca3af",
          fontFamily: FONT,
          marginLeft: 32,
          maxWidth: 460,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ============================================================
// PROGRESS BAR — thin line at bottom, like a video player
// ============================================================
export const ProgressBar: React.FC<{
  currentSection: number;
  totalSections: number;
  sectionProgress: number; // 0-1 within current section
}> = ({ currentSection, totalSections, sectionProgress }) => {
  const overall =
    (currentSection + sectionProgress) / totalSections;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: "#f0f0f0",
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${overall * 100}%`,
          backgroundColor: "#111111",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
};

// ============================================================
// INTRO — "Teach Charlie AI" on white
// ============================================================
export const IntroOverlay: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({
    frame: localFrame - 8,
    fps,
    config: { damping: 50, mass: 1.2 },
  });
  const headline = spring({
    frame: localFrame - 20,
    fps,
    config: { damping: 40, mass: 1.5 },
  });
  const sub = spring({
    frame: localFrame - 38,
    fps,
    config: { damping: 50 },
  });

  const exitOpacity = interpolate(
    localFrame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Dog logo */}
        <div
          style={{
            opacity: badge,
            transform: `translateY(${interpolate(badge, [0, 1], [20, 0])}px) scale(${interpolate(badge, [0, 1], [0.8, 1])})`,
            marginBottom: 24,
          }}
        >
          <DogLogo size={64} color="#111111" />
        </div>
        {/* Introducing badge */}
        <div
          style={{
            display: "inline-block",
            padding: "8px 20px",
            backgroundColor: "#f5f5f5",
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 500,
            color: "#6b7280",
            fontFamily: FONT,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: badge,
            transform: `translateY(${interpolate(badge, [0, 1], [16, 0])}px)`,
            marginBottom: 28,
          }}
        >
          Introducing
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#111111",
            fontFamily: FONT,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [30, 0])}px)`,
          }}
        >
          Teach Charlie AI
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#9ca3af",
            fontFamily: FONT,
            marginTop: 20,
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [16, 0])}px)`,
          }}
        >
          No-code AI agent builder for non-technical teams.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// OUTRO — CTA on white
// ============================================================
export const OutroOverlay: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headline = spring({
    frame: localFrame - 10,
    fps,
    config: { damping: 40, mass: 1.4 },
  });
  const sub = spring({
    frame: localFrame - 30,
    fps,
    config: { damping: 50 },
  });
  const cta = spring({
    frame: localFrame - 48,
    fps,
    config: { damping: 50, mass: 1 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 800 }}>
        <div
          style={{
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [20, 0])}px)`,
            marginBottom: 24,
          }}
        >
          <DogLogo size={48} color="#111111" />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#111111",
            fontFamily: FONT,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [30, 0])}px)`,
          }}
        >
          Make AI adoption your competitive edge
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#9ca3af",
            fontFamily: FONT,
            marginTop: 20,
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [16, 0])}px)`,
          }}
        >
          Don't just buy AI. Teach your team to build it — then deploy agents
          that do real work.
        </div>
        <div
          style={{
            marginTop: 40,
            opacity: cta,
            transform: `scale(${interpolate(cta, [0, 1], [0.92, 1])})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "16px 40px",
              backgroundColor: "#111111",
              borderRadius: 100,
              fontSize: 20,
              fontWeight: 500,
              color: "#ffffff",
              fontFamily: FONT,
            }}
          >
            Build your agent
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#d1d5db",
              fontFamily: FONT,
              marginTop: 14,
            }}
          >
            teachcharlie.ai
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
