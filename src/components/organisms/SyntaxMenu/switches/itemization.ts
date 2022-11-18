import { LineNode } from '../../../../parser/line/types';
import { State } from '../../Editor/types';

import { lineMenuSwitch } from './common/line';

export type ItemizationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function itemizationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): ItemizationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'itemization');
}
