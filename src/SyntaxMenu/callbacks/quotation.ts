import { State } from '../../Editor/types';
import { LineNode } from '../../parser/types';
import { handleOnLineMenuClick, lineMenuSwitch } from '../callbacksCommon/common';
import { QuotationMenuProps } from '../types';

import { MenuHandler } from './types';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): 'alloff' | 'allon' | 'both' | 'disabled' {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}

export function handleOnQuotationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<QuotationMenuProps>,
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, 'button', menuSwitch, 'quotation');
}

export function handleOnQuotationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<QuotationMenuProps>,
  menuItem: 'indent' | 'outdent',
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, menuItem, menuSwitch, 'quotation');
}
