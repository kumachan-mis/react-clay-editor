import { State } from '../../../../Editor/types';
import { FormulaLabels } from '../../../../common/types';
import { BlockNode, LineNode } from '../../../../parser/types';
import { isPureLineNode } from '../../../../parser/utils';
import { BlockPosition, ContentPosition } from '../hooks/types';
import { BlockFormulaMenuSwitch, ContentFormulaMenuSwitch } from '../switches/formula';

import { handleOnBlockMenuClick } from './common/block';
import {
  createContentByTextSelection,
  insertContentAtCursor,
  splitContentByTextSelection,
  replaceContentAtCursor,
  ContentMenuConfig,
  ContentMenuMetaConfig,
} from './common/content';

export type FormulaMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<FormulaLabels>;

export function handleOnFormulaButtonClick(
  text: string,
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  state: State,
  props: FormulaMenuHandlerProps,
  contentMenuSwitch: ContentFormulaMenuSwitch,
  blockMenuSwitch: BlockFormulaMenuSwitch
): [string, State] {
  switch (contentMenuSwitch) {
    case 'inline':
    case 'off':
      return handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'inline', contentMenuSwitch);
    case 'display':
      return handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'display', contentMenuSwitch);
    case 'disabled':
      return handleOnBlockFormulaItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch);
  }
}

export function handleOnContentFormulaItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  menuItem: 'inline' | 'display',
  menuSwitch: ContentFormulaMenuSwitch
): [string, State] {
  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  const inlineConfig: ContentMenuConfig = { facingMeta: '$', content: 'inline formula', trailingMeta: '$' };
  const displayConfig: ContentMenuConfig = { facingMeta: '$$', content: 'display formula', trailingMeta: '$$' };
  const normalConfig: ContentMenuMetaConfig = { facingMeta: '', trailingMeta: '' };

  if (contentPosition.type === 'empty') {
    const config = menuItem === 'display' ? displayConfig : inlineConfig;
    return insertContentAtCursor(text, nodes, state, config);
  }
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      const config = menuItem === 'display' ? displayConfig : inlineConfig;
      return insertContentAtCursor(text, nodes, state, config);
    } else {
      const config = menuItem === menuSwitch ? normalConfig : menuItem === 'display' ? displayConfig : inlineConfig;
      return replaceContentAtCursor(text, nodes, contentPosition, state, config);
    }
  } else {
    if (menuSwitch === 'off') {
      const config = menuItem === 'display' ? displayConfig : inlineConfig;
      return createContentByTextSelection(text, nodes, state, config);
    } else {
      const config = menuItem === menuSwitch ? normalConfig : menuItem === 'display' ? displayConfig : inlineConfig;
      return splitContentByTextSelection(text, nodes, contentPosition, state, config);
    }
  }
}

export function handleOnBlockFormulaItemClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  props: FormulaMenuHandlerProps,
  menuSwitch: BlockFormulaMenuSwitch
): [string, State] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, menuSwitch, { label: props.blockLabel, meta: '$$' });
}
