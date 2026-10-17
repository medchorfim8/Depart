import "./fonts";
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import {
  linearTiming,
  TransitionPresentation,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Intro } from "./Intro";
import { MemoryScene } from "./MemoryScene";
import { Outro } from "./Outro";
import { LightLeak, Vignette } from "./Overlays";
import {
  FamilySummerProps,
  INTRO_FRAMES,
  MEMORY_FRAMES,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
} from "./schema";

const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryTransitions: (() => TransitionPresentation<any>)[] = [
  () => slide({ direction: "from-left" }),
  () => wipe({ direction: "from-top-left" }),
  () => slide({ direction: "from-right" }),
  () => fade(),
];

export const FamilySummer: React.FC<FamilySummerProps> = (props) => {
  const { durationInFrames } = useVideoConfig();
  const { memories } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <Intro title={props.title} subtitle={props.subtitle} location={props.location} />
        </TransitionSeries.Sequence>
        {memories.flatMap((memory, i) => [
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={i === 0 ? fade() : memoryTransitions[i % memoryTransitions.length]()}
            timing={timing}
          />,
          <TransitionSeries.Sequence key={`m${i}`} durationInFrames={MEMORY_FRAMES}>
            <MemoryScene memory={memory} index={i} total={memories.length} />
          </TransitionSeries.Sequence>,
        ])}
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <Outro
            closingLine={props.closingLine}
            familyName={props.familyName}
            subtitle={props.subtitle}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LightLeak />
      <Vignette />

      {props.music ? (
        <Audio
          src={staticFile(props.music)}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, durationInFrames - 45, durationInFrames],
              [0, 0.8, 0.8, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
