/**
 * [INPUT]: React runtime and ProNetX theme.
 * [OUTPUT]: reusable brand primitives (background, grid, glow, gradient bar).
 * [POS]: lightweight visual primitives for consistent brand rendering.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import React from 'react';
import { createPronetxTheme } from './theme';

const theme = createPronetxTheme();

export const BrandBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${theme.brand.color.background} 0%, #0a1018 50%, #0d1520 100%)`,
      }}
    >
      {children}
    </div>
  );
};

export const BrandGrid: React.FC<{ cellSize?: number; opacity?: number }> = ({
  cellSize = 100,
  opacity = theme.brand.effects.gridOpacity,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    />
  );
};

export const BrandGlow: React.FC<{ x: string; y: string; color?: string; size?: number }> = ({
  x,
  y,
  color = theme.brand.color.primary,
  size = 520,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        filter: `blur(${theme.brand.effects.glowBlur}px)`,
        background: `radial-gradient(circle, ${color}33 0%, transparent 60%)`,
      }}
    />
  );
};

export const BrandGradientBar: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        background:
          `linear-gradient(90deg, ${theme.brand.color.primary} 0%, ${theme.brand.color.gold} 50%, ${theme.brand.color.success} 100%)`,
      }}
    />
  );
};
