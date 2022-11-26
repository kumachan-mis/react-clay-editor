import { EditorState } from '../../../../contexts/EditorStateContext';
import { BlockNode } from '../../../../parser/block/types';
import { LineNode } from '../../../../parser/line/types';
import { isPureLineNode } from '../../../../parser/line/utils';
import { CodeLabels } from '../../../../types/label/code';
import { BlockPosition } from '../hooks/blockPosition';
import { ContentPosition } from '../hooks/contentPosition';
import { CodeMenuSwitch } from '../switches/code';

import { handleOnBlockMenuClick } from './common/block';
import {
  createContentByCursorSelection,
  insertContentAtCursor,
  splitContentByCursorSelection,
  replaceContentAtCursor,
  ContentMenuConfig,
  ContentMenuMetaConfig,
} from './common/content';

export type CodeMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<CodeLabels>;

export function handleOnCodeButtonClick(
  text: string,
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  props: CodeMenuHandlerProps,
  inlineMenuSwitch: CodeMenuSwitch,
  blockMenuSwitch: CodeMenuSwitch
): [string, EditorState] {
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
  state: EditorState,
  menuSwitch: CodeMenuSwitch
): [string, EditorState] {
  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  const offConfig: ContentMenuConfig = { facingMeta: '`', content: 'inline code', trailingMeta: '`' };
  const onConfig: ContentMenuMetaConfig = { facingMeta: '', trailingMeta: '' };

  if (contentPosition.type === 'empty') return insertContentAtCursor(text, nodes, state, offConfig);

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.cursorSelection) {
    if (menuSwitch === 'off') {
      return insertContentAtCursor(text, nodes, state, offConfig);
    } else {
      return replaceContentAtCursor(text, nodes, contentPosition, state, onConfig);
    }
  } else {
    if (menuSwitch === 'off') {
      return createContentByCursorSelection(text, nodes, state, offConfig);
    } else {
      return splitContentByCursorSelection(text, nodes, contentPosition, state, onConfig);
    }
  }
}

export function handleOnBlockCodeItemClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  props: CodeMenuHandlerProps,
  menuSwitch: CodeMenuSwitch
): [string, EditorState] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, menuSwitch, {
    label: props.blockLabel,
    meta: '```',
  });
}
