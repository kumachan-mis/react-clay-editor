import { BlockPosition } from '../hooks/blockPosition';
import { ContentPosition } from '../hooks/contentPosition';
import { ContentFormulaMenuSwitch, BlockFormulaMenuSwitch } from '../switches/formula';
import { EditorState } from 'src/contexts/EditorStateContext';
import { BlockNode } from 'src/parser/block/types';
import { LineNode } from 'src/parser/line/types';
import { isPureLineNode } from 'src/parser/line/utils';
import { FormulaLabels } from 'src/types/label/formula';

import { handleOnBlockMenuClick } from './common/block';
import {
  createContentByCursorSelection,
  insertContentAtCursor,
  splitContentByCursorSelection,
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
  state: EditorState,
  props: FormulaMenuHandlerProps,
  contentMenuSwitch: ContentFormulaMenuSwitch,
  blockMenuSwitch: BlockFormulaMenuSwitch
): [string, EditorState] {
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
  state: EditorState,
  menuItem: 'inline' | 'display',
  menuSwitch: ContentFormulaMenuSwitch
): [string, EditorState] {
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

  if (!state.cursorSelection) {
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
      return createContentByCursorSelection(text, nodes, state, config);
    } else {
      const config = menuItem === menuSwitch ? normalConfig : menuItem === 'display' ? displayConfig : inlineConfig;
      return splitContentByCursorSelection(text, nodes, contentPosition, state, config);
    }
  }
}

export function handleOnBlockFormulaItemClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  props: FormulaMenuHandlerProps,
  menuSwitch: BlockFormulaMenuSwitch
): [string, EditorState] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, menuSwitch, { label: props.blockLabel, meta: '$$' });
}
