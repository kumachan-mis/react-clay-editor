import { LineNode } from '../../../../parser/types';
import { State } from '../../../organisms/Editor/types';

import { lineMenuSwitch } from './common/line';

export type QuotationMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): QuotationMenuSwitch {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}
