import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import type { SceneName } from "./schema";

type Palette = {
  skyTop: string;
  skyBottom: string;
  sun: string;
  sunGlow: string;
  sea: string[];
  sand: string;
  cloud: string;
};

export const palettes: Record<SceneName, Palette> = {
  beach: {
    cloud: "#ffffff",
    skyTop: "#5fb4e8",
    skyBottom: "#cdeefb",
    sun: "#fff6c9",
    sunGlow: "rgba(255,240,180,0.55)",
    sea: ["#2fa3c9", "#1d86b0", "#136a93"],
    sand: "#f3dcae",
  },
  sand: {
    cloud: "#ffffff",
    skyTop: "#7cc6ee",
    skyBottom: "#fdeccb",
    sun: "#fff3b8",
    sunGlow: "rgba(255,226,150,0.55)",
    sea: ["#3cb3c8", "#2493ae", "#177592"],
    sand: "#efc98b",
  },
  sunset: {
    cloud: "#f6b8b0",
    skyTop: "#3b2a6b",
    skyBottom: "#ff9a5a",
    sun: "#ffd27a",
    sunGlow: "rgba(255,150,90,0.6)",
    sea: ["#c4607a", "#7d3f6e", "#4a2a5c"],
    sand: "#e0a77e",
  },
  pool: {
    cloud: "#ffffff",
    skyTop: "#4fc3e8",
    skyBottom: "#e6fbff",
    sun: "#ffffff",
    sunGlow: "rgba(255,255,230,0.6)",
    sea: ["#4fe0e6", "#22c3d6", "#0fa2bf"],
    sand: "#f7f0e2",
  },
  night: {
    cloud: "#ffffff",
    skyTop: "#0a1235",
    skyBottom: "#2b3a78",
    sun: "#f4f1de",
    sunGlow: "rgba(200,210,255,0.35)",
    sea: ["#24346d", "#18254f", "#0e1838"],
    sand: "#6f6a8a",
  },
};

const wavePath = (
  width: number,
  baseY: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  height: number,
) => {
  let d = `M 0 ${height} L 0 ${baseY}`;
  for (let x = 0; x <= width; x += 20) {
    const y = baseY + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  return `${d} L ${width} ${height} Z`;
};

export const Seascape: React.FC<{
  scene: SceneName;
  // 0..1, how high the sun/moon sits (1 = top).
  sunHeight?: number;
  showSand?: boolean;
}> = ({ scene, sunHeight = 0.6, showSand = true }) => {
  const frame = useCurrentFrame();
  const p = palettes[scene];
  const W = 1920;
  const H = 1080;
  const horizon = 640;
  const sunY = interpolate(sunHeight, [0, 1], [horizon + 40, 180]);
  const isNight = scene === "night";

  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.skyTop} />
            <stop offset="1" stopColor={p.skyBottom} />
          </linearGradient>
          <radialGradient id={`glow-${scene}`}>
            <stop offset="0" stopColor={p.sunGlow} />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <linearGradient id={`reflect-${scene}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.sun} stopOpacity="0.6" />
            <stop offset="1" stopColor={p.sun} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#sky-${scene})`} />

        {isNight &&
          new Array(90).fill(0).map((_, i) => {
            const twinkle =
              0.4 + 0.6 * Math.abs(Math.sin(frame / 12 + random(`t${i}`) * 10));
            return (
              <circle
                key={i}
                cx={random(`x${i}`) * W}
                cy={random(`y${i}`) * (horizon - 60)}
                r={0.8 + random(`r${i}`) * 2}
                fill="#fff"
                opacity={twinkle}
              />
            );
          })}

        <circle cx={1350} cy={sunY} r={340} fill={`url(#glow-${scene})`} />
        <circle cx={1350} cy={sunY} r={isNight ? 70 : 105} fill={p.sun} />

        {!isNight &&
          [0, 1, 2].map((i) => {
            const x = ((frame * (0.6 + i * 0.25) + i * 700) % (W + 600)) - 300;
            const y = 170 + i * 90;
            return (
              <g
                key={i}
                opacity={scene === "sunset" ? 0.55 : 0.85}
                transform={`translate(${x} ${y})`}
              >
                <ellipse cx={0} cy={0} rx={120} ry={34} fill={p.cloud} />
                <ellipse cx={-55} cy={-22} rx={60} ry={40} fill={p.cloud} />
                <ellipse cx={40} cy={-30} rx={72} ry={50} fill={p.cloud} />
              </g>
            );
          })}

        {!isNight &&
          [0, 1, 2].map((i) => {
            const x = ((frame * 2.2 + i * 90) % (W + 400)) - 200;
            const y = 260 + i * 28 + Math.sin(frame / 10 + i) * 8;
            const flap = Math.sin(frame / 4 + i) * 10;
            return (
              <path
                key={`b${i}`}
                d={`M ${x - 18} ${y - flap} Q ${x - 8} ${y - 6} ${x} ${y} Q ${x + 8} ${y - 6} ${x + 18} ${y - flap}`}
                stroke="#2b3046"
                strokeWidth={3}
                fill="none"
                opacity={0.55}
              />
            );
          })}

        {p.sea.map((color, i) => (
          <path
            key={color}
            d={wavePath(
              W,
              horizon + i * 70,
              8 + i * 6,
              420 + i * 140,
              frame / (18 - i * 3) + i * 2,
              H,
            )}
            fill={color}
          />
        ))}

        <rect
          x={1350 - 70}
          y={horizon}
          width={140}
          height={260}
          fill={`url(#reflect-${scene})`}
          filter="url(#soft)"
          opacity={0.7 + Math.sin(frame / 8) * 0.15}
        />

        {showSand && (
          <path
            d={wavePath(W, 930, 18, 900, frame / 40, H)}
            fill={p.sand}
          />
        )}
        {showSand && (
          <path
            d={wavePath(W, 924, 10, 300, frame / 9, 940)}
            fill="#ffffff"
            opacity={0.55}
          />
        )}

        {showSand && scene === "sand" && (
          <g transform={`translate(420 940) rotate(${Math.sin(frame / 30) * 1.5})`}>
            <rect x={-5} y={-260} width={10} height={290} fill="#8a5a3c" />
            <path d="M -230 -230 Q 0 -390 230 -230 Z" fill="#e8524a" />
            <path d="M -230 -230 Q -76 -350 -76 -230 Z" fill="#fff4e0" />
            <path d="M 76 -230 Q 76 -350 230 -230 Z" fill="#fff4e0" />
            <ellipse cx={0} cy={36} rx={230} ry={20} fill="rgba(0,0,0,0.12)" />
          </g>
        )}
        {scene === "pool" && (
          <g
            transform={`translate(${700 + Math.sin(frame / 25) * 60} ${770 + Math.sin(frame / 12) * 8})`}
          >
            <ellipse cx={0} cy={0} rx={110} ry={44} fill="#ff6f91" />
            <ellipse cx={0} cy={0} rx={52} ry={18} fill={p.sea[1]} />
            <path d="M -110 0 A 110 44 0 0 1 -60 -37 L -30 -16 A 52 18 0 0 0 -52 0 Z" fill="#fff" />
            <path d="M 110 0 A 110 44 0 0 1 60 37 L 30 16 A 52 18 0 0 0 52 0 Z" fill="#fff" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
