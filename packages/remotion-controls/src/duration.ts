/**
 * [INPUT]: desired scene durations and global frame budget.
 * [OUTPUT]: safe scene timeline with auto-filled tail scene.
 * [POS]: duration normalization helper for shared controls package.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

export type DurationInput = {
  scene1: number;
  scene2: number;
  scene3: number;
  scene4: number;
  scene5: number;
};

export const normalizeDurations = (input: DurationInput, totalFrames: number) => {
  const s1 = input.scene1;
  const s2 = input.scene2;
  const s3 = input.scene3;
  const s4 = input.scene4;
  const s5 = input.scene5;

  const used = s1 + s2 + s3 + s4 + s5;
  const s6 = Math.max(90, totalFrames - used);
  const overflow = Math.max(0, used + s6 - totalFrames);
  const safeS5 = Math.max(120, s5 - overflow);
  const safeUsed = s1 + s2 + s3 + s4 + safeS5;
  const safeS6 = totalFrames - safeUsed;

  return {
    scene: { s1, s2, s3, s4, s5: safeS5, s6: safeS6 },
    starts: {
      scene1: 0,
      scene2: s1,
      scene3: s1 + s2,
      scene4: s1 + s2 + s3,
      scene5: s1 + s2 + s3 + s4,
      scene6: s1 + s2 + s3 + s4 + safeS5,
    },
  };
};
