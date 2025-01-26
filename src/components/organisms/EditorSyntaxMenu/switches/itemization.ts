import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';

import { lineMenuSwitch } from './common/line';

export type ItemizationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function itemizationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState,
): ItemizationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'itemization');
}
