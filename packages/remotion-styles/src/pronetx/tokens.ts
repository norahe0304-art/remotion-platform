/**
 * [INPUT]: ProNetX branding intent and motion style direction.
 * [OUTPUT]: reusable brand tokens and motion tokens.
 * [POS]: token source of truth for remotion-styles/pronetx.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

export const pronetxBrandTokens = {
  color: {
    background: '#08090c',
    surface: '#0d1117',
    primary: '#20A1A7',
    gold: '#F9BF27',
    orange: '#EA7131',
    red: '#FB1532',
    success: '#22B85F',
    textPrimary: '#ECF2FF',
    textSecondary: 'rgba(255,255,255,0.68)',
    textMuted: 'rgba(255,255,255,0.45)'
  },
  typography: {
    headingFamily: 'Lora, serif',
    bodyFamily: 'Source Sans Pro, sans-serif',
    monoFamily: 'JetBrains Mono, monospace'
  },
  effects: {
    gridOpacity: 0.04,
    glowBlur: 80,
    glowOpacity: 0.18
  }
} as const;

export const pronetxMotionTokens = {
  durationFrames: {
    fast: 12,
    normal: 24,
    slow: 42
  },
  easing: {
    primary: 'easeOutCubic',
    emphasis: 'easeInOutCubic'
  },
  pulse: {
    speed: 20,
    amplitude: 0.1
  },
  draw: {
    speed: 60,
    trail: 5
  },
  transition: {
    softFrames: 18,
    hardFrames: 10
  }
} as const;
