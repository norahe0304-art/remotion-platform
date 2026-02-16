/**
 * [INPUT]: Remotion Composition and TemplateDemo scene component.
 * [OUTPUT]: Root component exposing runnable template compositions.
 * [POS]: composition registry for remotion-template-nora.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import React from 'react';
import {Composition} from 'remotion';
import {TemplateDemo} from './TemplateDemo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="TemplateDemo"
        component={TemplateDemo}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
        defaultProps={{
          headline: 'Build production videos faster',
          subline: 'Use shared controls, style tokens, and prompt workflows.',
        }}
      />
    </>
  );
};
