/**
 * [INPUT]: remotion frame hooks and @nora/remotion-styles brand primitives.
 * [OUTPUT]: TemplateDemo scene component for immediate render validation.
 * [POS]: default runnable demo scene in remotion-template-nora.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandBackground, BrandGlow, BrandGradientBar, BrandGrid, createPronetxTheme} from '@nora/remotion-styles';

type Props = {
  headline: string;
  subline: string;
};

const theme = createPronetxTheme();

export const TemplateDemo: React.FC<Props> = ({headline, subline}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headlineProgress = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 120},
  });

  const sublineProgress = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: {damping: 20, stiffness: 120},
  });

  const fade = interpolate(frame, [0, 24], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <BrandBackground>
      <BrandGrid cellSize={92} />
      <BrandGlow x="20%" y="32%" color={theme.brand.color.primary} size={520} />
      <BrandGlow x="82%" y="72%" color={theme.brand.color.gold} size={460} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 120,
          opacity: fade,
        }}
      >
        <div style={{maxWidth: 1080, textAlign: 'center'}}>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.brand.typography.headingFamily,
              fontSize: 84,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: theme.brand.color.textPrimary,
              transform: `translateY(${(1 - headlineProgress) * 28}px)`,
              opacity: headlineProgress,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              marginTop: 26,
              marginBottom: 0,
              fontFamily: theme.brand.typography.bodyFamily,
              fontSize: 34,
              lineHeight: 1.34,
              color: theme.brand.color.textSecondary,
              transform: `translateY(${(1 - sublineProgress) * 20}px)`,
              opacity: sublineProgress,
            }}
          >
            {subline}
          </p>
        </div>
      </div>

      <BrandGradientBar />
    </BrandBackground>
  );
};
