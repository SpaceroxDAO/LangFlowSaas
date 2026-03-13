import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Section title that appears as a floating label
export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  localFrame: number;
  durationInFrames: number;
  accentColor: string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}> = ({
  title,
  subtitle,
  localFrame,
  durationInFrames,
  accentColor,
  position = "bottom-left",
}) => {
  const { fps } = useVideoConfig();

  // Appear with a slide + fade
  const enterProgress = spring({
    frame: localFrame - 15,
    fps,
    config: { damping: 60, mass: 1 },
  });

  // Fade out near end
  const exitStart = durationInFrames - 25;
  const exitOpacity =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const slideX = interpolate(enterProgress, [0, 1], [-40, 0]);
  const opacity = enterProgress * exitOpacity;

  // Position mapping
  const positionStyles: Record<string, React.CSSProperties> = {
    "bottom-left": { bottom: 60, left: 60 },
    "bottom-right": { bottom: 60, right: 60 },
    "top-left": { top: 60, left: 60 },
    "top-right": { top: 60, right: 60 },
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        opacity,
        transform: `translateX(${slideX}px)`,
        zIndex: 10,
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: 50,
          height: 3,
          backgroundColor: accentColor,
          marginBottom: 12,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: "white",
          fontFamily:
            "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: "-0.02em",
          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            marginTop: 8,
            textShadow: "0 1px 10px rgba(0,0,0,0.3)",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

// Full-screen intro title animation
export const IntroTitle: React.FC<{
  localFrame: number;
  durationInFrames: number;
}> = ({ localFrame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  // Staggered entrance
  const line1 = spring({
    frame: localFrame - 10,
    fps,
    config: { damping: 40, mass: 1.5 },
  });
  const line2 = spring({
    frame: localFrame - 25,
    fps,
    config: { damping: 40, mass: 1.5 },
  });
  const tagline = spring({
    frame: localFrame - 45,
    fps,
    config: { damping: 60 },
  });

  // Exit
  const exitOpacity = interpolate(
    localFrame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
        opacity: exitOpacity,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#A78BFA",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [30, 0])}px)`,
            marginBottom: 16,
          }}
        >
          Introducing
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "white",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.03em",
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
            textShadow: "0 4px 30px rgba(124, 58, 237, 0.4)",
          }}
        >
          Teach Charlie AI
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            opacity: tagline,
            transform: `translateY(${interpolate(tagline, [0, 1], [20, 0])}px)`,
            marginTop: 20,
          }}
        >
          Build AI agents without writing a single line of code
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Outro CTA
export const OutroTitle: React.FC<{
  localFrame: number;
  durationInFrames: number;
}> = ({ localFrame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  const headline = spring({
    frame: localFrame - 10,
    fps,
    config: { damping: 40, mass: 1.5 },
  });
  const cta = spring({
    frame: localFrame - 35,
    fps,
    config: { damping: 50 },
  });
  const url = spring({
    frame: localFrame - 55,
    fps,
    config: { damping: 60 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.03em",
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
            textShadow: "0 4px 30px rgba(124, 58, 237, 0.4)",
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          Start building your
          <br />
          AI agents today
        </div>
        <div
          style={{
            marginTop: 40,
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [30, 0])}px) scale(${interpolate(cta, [0, 1], [0.9, 1])})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "18px 50px",
              background:
                "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              borderRadius: 50,
              fontSize: 28,
              fontWeight: 600,
              color: "white",
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              boxShadow: "0 8px 30px rgba(124, 58, 237, 0.5)",
            }}
          >
            Get Started Free
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            opacity: url,
            transform: `translateY(${interpolate(url, [0, 1], [20, 0])}px)`,
          }}
        >
          app.teachcharlie.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};
