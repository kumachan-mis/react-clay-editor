import { State } from '../../Editor/types';
import { BlockNode, LineNode } from '../../parser/types';
import { isPureLineNode } from '../../parser/utils';
import { blockMenuSwitch, handleOnBlockMenuClick } from '../callbacksCommon/block';
import {
  createContentByTextSelection,
  insertContentAtCursor,
  splitContentByTextSelection,
  substituteContentAtCursor,
} from '../callbacksCommon/content';
import { ContentConfig, ContentMetaConfig } from '../callbacksCommon/types';
import { isEndPoint } from '../callbacksCommon/utils';
import { BlockPosition, FormulaMenuProps, ContentPosition } from '../types';

import { MenuHandler } from './types';

export function contentFormulaMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): 'inline' | 'display' | 'off' | 'disabled' {
  if (!contentPosition) return 'disabled';

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  if (isEndPoint(contentPosition)) return 'off';

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'inlineFormula':
      return 'inline';
    case 'displayFormula':
      return 'display';
    case 'normal':
      return 'off';
    default:
      return 'disabled';
  }
}

export function blockFormulaMenuSwitch(
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State
): 'on' | 'off' | 'disabled' {
  return blockMenuSwitch(nodes, blockPosition, state, 'blockFormula');
}

export function handleOnFormulaButtonClick(
  text: string,
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  state: State,
  props: MenuHandler<FormulaMenuProps>,
  contentMenuSwitch: 'inline' | 'display' | 'off' | 'disabled',
  blockMenuSwitch: 'on' | 'off' | 'disabled'
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
  menuSwitch: 'inline' | 'display' | 'off' | 'disabled'
): [string, State] {
  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  const inlineConfig: ContentConfig = { facingMeta: '$', content: 'inline formula', trailingMeta: '$' };
  const displayConfig: ContentConfig = { facingMeta: '$$', content: 'display formula', trailingMeta: '$$' };
  const normalConfig: ContentMetaConfig = { facingMeta: '', trailingMeta: '' };

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
      return substituteContentAtCursor(text, nodes, contentPosition, state, config);
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
  props: MenuHandler<FormulaMenuProps>,
  menuSwitch: 'on' | 'off' | 'disabled'
): [string, State] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, props, menuSwitch, '$$');
}
