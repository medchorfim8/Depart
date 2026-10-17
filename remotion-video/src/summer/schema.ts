import { z } from "zod";

export const sceneNames = ["beach", "sand", "sunset", "pool", "night"] as const;
export type SceneName = (typeof sceneNames)[number];

export const memorySchema = z.object({
  caption: z.string(),
  // File name inside public/photos/. Leave empty to show an illustrated scene.
  photo: z.string(),
  scene: z.enum(sceneNames),
});

export const familySummerSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  location: z.string(),
  memories: z.array(memorySchema).min(1),
  closingLine: z.string(),
  familyName: z.string(),
  // File name inside public/ (e.g. "music.mp3"). Leave empty for no music.
  music: z.string(),
});

export type FamilySummerProps = z.infer<typeof familySummerSchema>;
export type Memory = z.infer<typeof memorySchema>;

export const defaultFamilySummerProps: FamilySummerProps = {
  title: "مصيف العائلة",
  subtitle: "صيف 2026",
  location: "على شاطئ البحر",
  memories: [
    { caption: "أول لقاء مع البحر", photo: "", scene: "beach" },
    { caption: "قلاع الرمال والضحكات", photo: "", scene: "sand" },
    { caption: "أيام المسبح", photo: "", scene: "pool" },
    { caption: "غروب لا يُنسى", photo: "", scene: "sunset" },
    { caption: "سهرات تحت النجوم", photo: "", scene: "night" },
  ],
  closingLine: "ذكريات لا تُنسى",
  familyName: "مع كل الحب ♥ عائلتنا",
  music: "",
};

export const FPS = 30;
export const INTRO_FRAMES = 150;
export const MEMORY_FRAMES = 120;
export const OUTRO_FRAMES = 165;
export const TRANSITION_FRAMES = 20;

export const totalFrames = (memoryCount: number) =>
  INTRO_FRAMES +
  memoryCount * MEMORY_FRAMES +
  OUTRO_FRAMES -
  (memoryCount + 1) * TRANSITION_FRAMES;
