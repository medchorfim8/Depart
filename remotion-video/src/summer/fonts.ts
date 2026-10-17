import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Arabic and Latin subsets are separate files; listing both families lets the
// browser pick glyphs from whichever subset contains them.
const faces = [
  { family: "Cairo", file: "cairo-arabic", weights: ["400", "700", "800"] },
  { family: "CairoLatin", file: "cairo-latin", weights: ["400", "700", "800"] },
  { family: "Amiri", file: "amiri-arabic", weights: ["400", "700"] },
  { family: "AmiriLatin", file: "amiri-latin", weights: ["400", "700"] },
];

for (const face of faces) {
  for (const weight of face.weights) {
    loadFont({
      family: face.family,
      url: staticFile(`fonts/${face.file}-${weight}-normal.woff2`),
      weight,
    });
  }
}

export const SANS = "Cairo, CairoLatin, sans-serif";
export const SERIF = "Amiri, AmiriLatin, serif";
