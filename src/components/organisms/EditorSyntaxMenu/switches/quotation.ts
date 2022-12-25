import { EditorState } from 'src/contexts/EditorStateContext';
import { LineNode } from 'src/parser/line/types';

import { lineMenuSwitch } from './common/line';

export type QuotationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState
): QuotationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}
