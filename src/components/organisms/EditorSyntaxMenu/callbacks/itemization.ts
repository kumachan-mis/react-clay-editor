import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';
import { ItemizationLabels } from '../../../../types/label/itemization';
import { ItemizationMenuSwitch } from '../switches/itemization';

import { handleOnLineMenuClick } from './common/line';

export type ItemizationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<ItemizationLabels>;

export function handleOnItemizationButtonClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: ItemizationMenuHandlerProps,
  menuSwitch: ItemizationMenuSwitch,
): [string, EditorState] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, 'button', menuSwitch, { meta });
}

export function handleOnItemizationItemClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: ItemizationMenuHandlerProps,
  menuItem: 'indent' | 'outdent',
  menuSwitch: ItemizationMenuSwitch,
): [string, EditorState] {
  const meta = !props.syntax || props.syntax === 'bracket' ? ' ' : '- ';
  return handleOnLineMenuClick(text, nodes, state, menuItem, menuSwitch, { meta });
}
