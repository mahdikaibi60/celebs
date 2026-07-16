import { useCurrentFrame, interpolate, Easing } from "remotion";
import React from "react";

export const AnimatedWord = ({ word, startFrame, endFrame }: any) => {
  const frame = useCurrentFrame();

  const isPast = frame > endFrame;
  const isActive = frame >= startFrame && frame <= endFrame;
  const isFuture = frame < startFrame;

  // 1. FRAME-BASED SCALE POP
  // Takes exactly 3 frames to hit 1.05, then instantly returns to 1 when the word is past.
  let scale = 1;
  if (isActive) {
    scale = interpolate(
      frame,
      [startFrame, startFrame + 3],
      [1, 1.05],
      { 
        extrapolateLeft: "clamp", 
        extrapolateRight: "clamp", 
        easing: Easing.out(Easing.cubic) 
      }
    );
  }

  // 2. HARD-CODED OPACITY STATES
  // Zero CSS transitions. Instant, deterministic state changes on the exact frame.
  let opacity = 0.7; // Future state (High readability)
  let fontWeight: any = "normal";

  if (isActive) {
    opacity = 1.0;
    fontWeight = "bold"; // Draws the eye alongside the 1.05 scale
  } else if (isPast) {
    opacity = 0.4; // Dims out once read
  }

  return (
    <span
      style={{
        display: "inline-block",
        marginRight: "16px",
        marginBottom: "10px",
        fontFamily: "'Geist Mono', 'JetBrains Mono', 'Roboto Mono', monospace", 
        fontWeight: fontWeight,
        color: "#ffffff",
        opacity: opacity,
        transform: `scale(${scale})`,
        willChange: "transform, opacity",
      }}
    >
      {word}
    </span>
  );
};
