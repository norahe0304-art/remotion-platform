/**
 * [INPUT]: pronetx brand and motion token bundles.
 * [OUTPUT]: createPronetxTheme() and PronetxTheme type.
 * [POS]: theme adapter layer for ProNetX reusable style package.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { pronetxBrandTokens, pronetxMotionTokens } from './tokens';

export const createPronetxTheme = () => {
  return {
    brand: pronetxBrandTokens,
    motion: pronetxMotionTokens,
  };
};

export type PronetxTheme = ReturnType<typeof createPronetxTheme>;
