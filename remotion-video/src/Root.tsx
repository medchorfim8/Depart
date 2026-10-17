import { CalculateMetadataFunction, Composition } from "remotion";
import { FamilySummer } from "./summer/FamilySummer";
import {
  defaultFamilySummerProps,
  FamilySummerProps,
  familySummerSchema,
  FPS,
  totalFrames,
} from "./summer/schema";

const calculateMetadata: CalculateMetadataFunction<FamilySummerProps> = ({
  props,
}) => ({
  durationInFrames: totalFrames(props.memories.length),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FamilySummer"
        component={FamilySummer}
        schema={familySummerSchema}
        defaultProps={defaultFamilySummerProps}
        durationInFrames={totalFrames(defaultFamilySummerProps.memories.length)}
        fps={FPS}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
