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

export const Outro: React.FC<{
  closingLine: string;
  familyName: string;
  subtitle: string;
}> = ({ closingLine, familyName, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sunHeight = interpolate(frame, [0, durationInFrames], [0.45, 0.05]);
  const lineIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const nameIn = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ direction: "rtl" }}>
      <Seascape scene="sunset" sunHeight={sunHeight} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,40,0.35) 0%, rgba(20,10,40,0.2) 60%, rgba(20,10,40,0.5) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          paddingBottom: 160,
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 150,
            fontWeight: 700,
            opacity: lineIn,
            transform: `translateY(${(1 - lineIn) * 40}px)`,
            textShadow: "0 6px 40px rgba(60,20,40,0.6)",
          }}
        >
          {closingLine}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 54,
            fontWeight: 700,
            color: "#ffe3b0",
            marginTop: 20,
            opacity: nameIn,
            transform: `translateY(${(1 - nameIn) * 24}px)`,
            textShadow: "0 3px 20px rgba(0,0,0,0.45)",
          }}
        >
          {familyName}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 400,
            marginTop: 18,
            opacity: nameIn * 0.85,
            letterSpacing: 4,
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
