import { EditorState } from 'src/contexts/EditorStateContext';
import { LineNode } from 'src/parser/line/types';

import { lineMenuSwitch } from './common/line';

export type ItemizationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function itemizationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState
): ItemizationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'itemization');
}
