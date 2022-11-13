import { LineNode } from '../../../../parser/line/types';
import { State } from '../../../organisms/Editor/types';
import { QuotationMenuSwitch } from '../switches/quotation';

import { handleOnLineMenuClick } from './common/line';

export type QuotationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
  indentLabel: string;
  outdentLabel: string;
};

export function handleOnQuotationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: QuotationMenuHandlerProps,
  menuSwitch: QuotationMenuSwitch
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, { meta: '> ' });
}

export function handleOnQuotationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: QuotationMenuHandlerProps,
  menuItem: 'indent' | 'outdent',
  menuSwitch: QuotationMenuSwitch
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, { meta: '> ' });
}
