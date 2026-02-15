/**
 * [INPUT]: timeline starts and optional VO nudge map.
 * [OUTPUT]: deterministic VO segment list with resolved start/duration/file.
 * [POS]: VO sequencing helper for Remotion projects.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

export type TimelineForVo = {
  starts: {
    scene2: number;
    scene3: number;
    scene4: number;
    scene5: number;
    scene6: number;
  };
};

export type VoSegment = {
  start: number;
  duration: number;
  file: string;
};

export type VoDefaults = Record<string, { start: number; duration: number; file: string }>;
export type VoNudges = Record<string, number>;

export const resolveVoSegments = (defaults: VoDefaults, nudges: VoNudges = {}): VoSegment[] => {
  return Object.entries(defaults).map(([key, seg]) => {
    const nudge = nudges[key] ?? 0;
    return {
      ...seg,
      start: Math.max(0, seg.start + nudge),
    };
  });
};

export const createPinpointVoDefaults = (timeline: TimelineForVo): VoDefaults => {
  const vo01ContextStart = 7;
  const vo01MigrateStart = 378;
  const vo02IntroStart = Math.max(timeline.starts.scene2 + 26, vo01MigrateStart + 65 + 20);
  return {
    scene1Context: { start: vo01ContextStart, duration: 320, file: 'vo-eleven-natural/vo-01-context.mp3' },
    scene1Migrate: { start: vo01MigrateStart, duration: 65, file: 'vo-eleven-natural/vo-01-migrate.mp3' },
    scene2Intro: { start: vo02IntroStart, duration: 59, file: 'vo-eleven-natural/vo-02-intro.mp3' },
    scene2Manual: { start: timeline.starts.scene2 + 145, duration: 184, file: 'vo-eleven-natural/vo-02-manual.mp3' },
    scene3Phase1: { start: timeline.starts.scene3 + 16, duration: 86, file: 'vo-eleven-natural/vo-03-phase1.mp3' },
    scene3Title: { start: timeline.starts.scene3 + 126, duration: 70, file: 'vo-eleven-natural/vo-03-title.mp3' },
    scene3Phase2: { start: timeline.starts.scene3 + 232, duration: 246, file: 'vo-eleven-natural/vo-03-phase2.mp3' },
    scene5Main: { start: timeline.starts.scene5 + 118, duration: 87, file: 'vo-eleven-natural/vo-05.mp3' },
  };
};
