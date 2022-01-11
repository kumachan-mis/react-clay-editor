import { State } from '../../Editor/types';
import { LineNode } from '../../parser/types';
import { handleOnLineMenuClick, lineMenuSwitch } from '../callbacksCommon/line';
import { ItemizationMenuProps } from '../types';

import { MenuHandler } from './types';

export function itemizationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): 'alloff' | 'allon' | 'both' | 'disabled' {
  return lineMenuSwitch(syntax, nodes, state, 'itemization');
}

export function handleOnItemizationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<ItemizationMenuProps>,
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled'
): [string, State] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, meta);
}

export function handleOnItemizationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<ItemizationMenuProps>,
  menuItem: 'indent' | 'outdent',
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled'
): [string, State] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, meta);
}
