/**
 * [INPUT]: zod runtime and project-specific limits.
 * [OUTPUT]: reusable schema builders for visual/audio/timing controls.
 * [POS]: schema layer of remotion-controls package.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { z } from 'zod';

export const createVisualSchema = () => {
  return z.object({
    headingScalePct: z.number().int().min(80).max(120),
    bodyScalePct: z.number().int().min(80).max(120),
  });
};

export const createAudioSchema = () => {
  return z.object({
    enableVoiceover: z.boolean(),
    enableMusic: z.boolean(),
    musicVolumePct: z.number().int().min(0).max(100),
    voiceVolumePct: z.number().int().min(0).max(200),
  });
};

export const createTimingSchema = () => {
  return z.object({
    durations: z.object({
      scene1: z.number().int().min(300).max(560),
      scene2: z.number().int().min(300).max(520),
      scene3: z.number().int().min(360).max(620),
      scene4: z.number().int().min(180).max(420),
      scene5: z.number().int().min(150).max(360),
    }),
  });
};
