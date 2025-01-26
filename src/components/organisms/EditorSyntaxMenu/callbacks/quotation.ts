import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';
import { QuotationLabels } from '../../../../types/label/quotation';
import { QuotationMenuSwitch } from '../switches/quotation';

import { handleOnLineMenuClick } from './common/line';

export type QuotationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<QuotationLabels>;

export function handleOnQuotationButtonClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: QuotationMenuHandlerProps,
  menuSwitch: QuotationMenuSwitch,
): [string, EditorState] {
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, { meta: '> ' });
}

export function handleOnQuotationItemClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: QuotationMenuHandlerProps,
  menuItem: 'indent' | 'outdent',
  menuSwitch: QuotationMenuSwitch,
): [string, EditorState] {
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, { meta: '> ' });
}
