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
import { BlockPosition, CodeMenuProps, ContentPosition } from '../types';

import { MenuHandler } from './types';

export function inlineCodeMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): 'on' | 'off' | 'disabled' {
  if (!contentPosition) return 'disabled';

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  if (isEndPoint(contentPosition)) return 'off';

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'inlineCode':
      return 'on';
    case 'normal':
      return 'off';
    default:
      return 'disabled';
  }
}

export function blockCodeMenuSwitch(
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State
): 'on' | 'off' | 'disabled' {
  return blockMenuSwitch(nodes, blockPosition, state, 'blockCode');
}

export function handleOnCodeButtonClick(
  text: string,
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  state: State,
  props: MenuHandler<CodeMenuProps>,
  inlineMenuSwitch: 'on' | 'off' | 'disabled',
  blockMenuSwitch: 'on' | 'off' | 'disabled'
): [string, State] {
  switch (inlineMenuSwitch) {
    case 'on':
    case 'off':
      return handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch);
    case 'disabled':
      return handleOnBlockCodeItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch);
  }
}

export function handleOnInlineCodeItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  menuSwitch: 'on' | 'off' | 'disabled'
): [string, State] {
  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  const offConfig: ContentConfig = { facingMeta: '`', content: 'inline code', trailingMeta: '`' };
  const onConfig: ContentMetaConfig = { facingMeta: '', trailingMeta: '' };

  if (contentPosition.type === 'empty') return insertContentAtCursor(text, nodes, state, offConfig);

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return insertContentAtCursor(text, nodes, state, offConfig);
    } else {
      return substituteContentAtCursor(text, nodes, contentPosition, state, onConfig);
    }
  } else {
    if (menuSwitch === 'off') {
      return createContentByTextSelection(text, nodes, state, offConfig);
    } else {
      return splitContentByTextSelection(text, nodes, contentPosition, state, onConfig);
    }
  }
}

export function handleOnBlockCodeItemClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  props: MenuHandler<CodeMenuProps>,
  menuSwitch: 'on' | 'off' | 'disabled'
): [string, State] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, props, menuSwitch, '```');
}
