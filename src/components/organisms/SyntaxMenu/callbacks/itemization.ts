import { ItemizationLabels } from '../../../../common/types';
import { LineNode } from '../../../../parser/line/types';
import { State } from '../../Editor/types';
import { ItemizationMenuSwitch } from '../switches/itemization';

import { handleOnLineMenuClick } from './common/line';

export type ItemizationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<ItemizationLabels>;

export function handleOnItemizationButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: ItemizationMenuHandlerProps,
  menuSwitch: ItemizationMenuSwitch
): [string, State] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, { meta });
}

export function handleOnItemizationItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: ItemizationMenuHandlerProps,
  menuItem: 'indent' | 'outdent',
  menuSwitch: ItemizationMenuSwitch
): [string, State] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, { meta });
}
