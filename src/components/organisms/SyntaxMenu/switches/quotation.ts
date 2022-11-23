import { LineNode } from '../../../../parser/line/types';
import { EditorState } from '../../Editor/types';

import { lineMenuSwitch } from './common/line';

export type QuotationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState
): QuotationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}
