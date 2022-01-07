import { State } from '../../Editor/types';
import { LineNode } from '../../parser/types';
import { QuotationMenuProps } from '../types';

import { handleOnLineMenuClick, lineMenuSwitch } from './common';
import { MenuHandler } from './types';

export function quotationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): 'off' | 'on' | 'disabled' {
  return lineMenuSwitch(syntax, nodes, state, 'quotation');
}

export function handleOnQuotationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<QuotationMenuProps>,
  menuSwitch: 'off' | 'on' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, 'button', menuSwitch, 'quotation');
}

export function handleOnQuotationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<QuotationMenuProps>,
  menuItem: 'indent' | 'outdent',
  menuSwitch: 'off' | 'on' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, menuItem, menuSwitch, 'quotation');
}
