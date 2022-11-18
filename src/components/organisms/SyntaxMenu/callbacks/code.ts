import { CodeLabels } from '../../../../common/types';
import { BlockNode } from '../../../../parser/block/types';
import { LineNode } from '../../../../parser/line/types';
import { isPureLineNode } from '../../../../parser/line/utils';
import { State } from '../../Editor/types';
import { BlockPosition, ContentPosition } from '../hooks/types';
import { CodeMenuSwitch } from '../switches/code';

import { handleOnBlockMenuClick } from './common/block';
import {
  createContentByTextSelection,
  insertContentAtCursor,
  splitContentByTextSelection,
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
  state: State,
  props: CodeMenuHandlerProps,
  inlineMenuSwitch: CodeMenuSwitch,
  blockMenuSwitch: CodeMenuSwitch
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
  menuSwitch: CodeMenuSwitch
): [string, State] {
  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  const offConfig: ContentMenuConfig = { facingMeta: '`', content: 'inline code', trailingMeta: '`' };
  const onConfig: ContentMenuMetaConfig = { facingMeta: '', trailingMeta: '' };

  if (contentPosition.type === 'empty') return insertContentAtCursor(text, nodes, state, offConfig);

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return insertContentAtCursor(text, nodes, state, offConfig);
    } else {
      return replaceContentAtCursor(text, nodes, contentPosition, state, onConfig);
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
  props: CodeMenuHandlerProps,
  menuSwitch: CodeMenuSwitch
): [string, State] {
  return handleOnBlockMenuClick(text, nodes, blockPosition, state, menuSwitch, {
    label: props.blockLabel,
    meta: '```',
  });
}
