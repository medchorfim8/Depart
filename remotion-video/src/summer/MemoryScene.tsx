import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIF } from "./fonts";
import type { Memory } from "./schema";
import { Seascape } from "./Seascape";

const CARD_W = 1180;
const CARD_H = 700;
const BORDER = 26;

export const MemoryScene: React.FC<{
  memory: Memory;
  index: number;
  total: number;
}> = ({ memory, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame: frame - 6, fps, config: { damping: 16, mass: 0.9 } });
  const captionIn = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const progress = frame / durationInFrames;

  // Alternate tilt and Ken Burns direction per memory for variety.
  const dir = index % 2 === 0 ? 1 : -1;
  const tilt = dir * interpolate(enter, [0, 1], [8, 2.2]);
  const kenBurns = interpolate(progress, [0, 1], [1.06, 1.18]);
  const panX = dir * interpolate(progress, [0, 1], [-25, 25]);

  const inner = memory.photo ? (
    <Img
      src={staticFile(`photos/${memory.photo}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${kenBurns}) translateX(${panX}px)`,
      }}
    />
  ) : (
    <AbsoluteFill
      style={{ transform: `scale(${kenBurns}) translateX(${panX}px)` }}
    >
      <Seascape scene={memory.scene} sunHeight={0.55} />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ direction: "rtl", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(28px) saturate(1.2)", transform: "scale(1.15)" }}>
        <Seascape scene={memory.scene} sunHeight={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(10,20,40,0.25)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: CARD_W + BORDER * 2,
            padding: BORDER,
            paddingBottom: 130,
            background: "#fffdf8",
            borderRadius: 10,
            boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.2)",
            transform: `translateY(${(1 - enter) * 500}px) rotate(${tilt}deg) scale(${0.85 + enter * 0.15})`,
            opacity: Math.min(1, enter * 1.5),
            position: "relative",
            marginTop: -40,
          }}
        >
          <div
            style={{
              width: CARD_W,
              height: CARD_H,
              overflow: "hidden",
              position: "relative",
              borderRadius: 4,
              background: "#ddd",
            }}
          >
            {inner}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 22,
              textAlign: "center",
              fontFamily: SERIF,
              fontSize: 68,
              fontWeight: 700,
              color: "#3a2d2a",
              opacity: captionIn,
              transform: `translateY(${(1 - captionIn) * 16}px)`,
            }}
          >
            {memory.caption}
          </div>
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          fontFamily: SANS,
          fontSize: 32,
          fontWeight: 700,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: 3,
          direction: "ltr",
          opacity: captionIn,
          textShadow: "0 2px 10px rgba(0,0,0,0.35)",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};
