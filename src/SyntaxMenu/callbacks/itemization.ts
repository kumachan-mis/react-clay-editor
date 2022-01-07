import { State } from '../../Editor/types';
import { LineNode } from '../../parser/types';
import { ItemizationMenuProps } from '../types';

import { handleOnLineMenuClick, lineMenuSwitch } from './common';
import { MenuHandler } from './types';

export function itemizationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): 'off' | 'on' | 'disabled' {
  return lineMenuSwitch(syntax, nodes, state, 'itemization');
}

export function handleOnItemizationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<ItemizationMenuProps>,
  menuSwitch: 'off' | 'on' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, 'button', menuSwitch, 'itemization');
}

export function handleOnItemizationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<ItemizationMenuProps>,
  menuItem: 'indent' | 'outdent',
  menuSwitch: 'off' | 'on' | 'disabled'
): [string, State] {
  return handleOnLineMenuClick(text, nodes, state, props, menuItem, menuSwitch, 'itemization');
}
