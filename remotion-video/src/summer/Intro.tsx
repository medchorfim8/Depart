import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIF } from "./fonts";
import { Seascape } from "./Seascape";

export const Intro: React.FC<{
  title: string;
  subtitle: string;
  location: string;
}> = ({ title, subtitle, location }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sunHeight = interpolate(frame, [0, durationInFrames], [0.15, 0.6], {
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, durationInFrames], [1.12, 1]);

  const titleIn = spring({ frame: frame - 25, fps, config: { damping: 200 } });
  const lineIn = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  const subIn = spring({ frame: frame - 60, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ direction: "rtl" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Seascape scene="sunset" sunHeight={sunHeight} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,40,0.15) 0%, rgba(20,10,40,0.45) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
          paddingBottom: 120,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 6,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
            textShadow: "0 2px 18px rgba(0,0,0,0.4)",
          }}
        >
          {location}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 190,
            fontWeight: 700,
            lineHeight: 1.25,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 60}px) scale(${0.92 + titleIn * 0.08})`,
            textShadow: "0 6px 40px rgba(60,20,40,0.55)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 420 * lineIn,
            height: 4,
            borderRadius: 2,
            margin: "10px 0 26px",
            background:
              "linear-gradient(90deg, rgba(255,214,140,0), #ffd68c, rgba(255,214,140,0))",
          }}
        />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 64,
            fontWeight: 800,
            color: "#ffe3b0",
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 30}px)`,
            textShadow: "0 3px 24px rgba(0,0,0,0.45)",
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
