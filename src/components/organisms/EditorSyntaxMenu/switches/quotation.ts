import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';

import { lineMenuSwitch } from './common/line';

export type QuotationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState,
): QuotationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}
