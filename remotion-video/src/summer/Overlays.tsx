import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Soft warm light sweeping across the frame, like sun flare on film.
export const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(Math.sin(frame / 70), [-1, 1], [10, 90]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% 15%, rgba(255,200,120,0.28), rgba(255,140,80,0) 45%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
      pointerEvents: "none",
    }}
  />
);
