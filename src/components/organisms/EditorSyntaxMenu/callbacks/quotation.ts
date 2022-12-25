import { QuotationMenuSwitch } from '../switches/quotation';
import { EditorState } from 'src/contexts/EditorStateContext';
import { LineNode } from 'src/parser/line/types';
import { QuotationLabels } from 'src/types/label/quotation';

import { handleOnLineMenuClick } from './common/line';

export type QuotationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<QuotationLabels>;

export function handleOnQuotationButtonClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: QuotationMenuHandlerProps,
  menuSwitch: QuotationMenuSwitch
): [string, EditorState] {
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, { meta: '> ' });
}

export function handleOnQuotationItemClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: QuotationMenuHandlerProps,
  menuItem: 'indent' | 'outdent',
  menuSwitch: QuotationMenuSwitch
): [string, EditorState] {
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, { meta: '> ' });
}
