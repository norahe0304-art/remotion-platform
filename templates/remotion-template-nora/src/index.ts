/**
 * [INPUT]: remotion registerRoot and template root component.
 * [OUTPUT]: template Remotion app entrypoint registration.
 * [POS]: bootstrap file for remotion-template-nora runtime.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import {registerRoot} from 'remotion';
import {Root} from './Root';

registerRoot(Root);
