import { LineNode, PureLineNode } from '../../../../parser/line/types';
import { isPureLineNode } from '../../../../parser/line/utils';
import { State } from '../../Editor/types';
import { isEndPoint } from '../common/utils';
import { ContentPosition, ContentPositionEmpty } from '../hooks/contentPosition';
import { DecorationMenuItemType, DecorationMenuSwitch, DecorationMenuSwitchItem } from '../switches/decoration';

import {
  createContentByTextSelection,
  insertContentAtCursor,
  splitContentByTextSelection,
  replaceContentAtCursor,
} from './common/content';

export type DecorationMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
};

export function handleOnDecorationClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  props: DecorationMenuHandlerProps,
  menuItem: DecorationMenuItemType,
  menuSwitch: DecorationMenuSwitch
): [string, State] {
  const menuSwitchItem = menuSwitch[menuItem];
  if (!contentPosition || menuSwitchItem === 'disabled') return [text, state];

  if (!props.syntax || props.syntax === 'bracket') {
    // bracket syntax
    return handleOnBracketDecorationItemClick(text, nodes, contentPosition, state, menuItem, menuSwitchItem);
  } else {
    // markdown syntax
    if (menuItem === 'underline') return [text, state];
    return handleOnMarkdownDecorationItemClick(text, nodes, contentPosition, state, menuItem, menuSwitchItem);
  }
}

function handleOnBracketDecorationItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  menuItem: DecorationMenuItemType,
  menuSwitch: Exclude<DecorationMenuSwitchItem, 'disabled'>
): [string, State] {
  const meta = { bold: '*', italic: '/', underline: '_' }[menuItem];

  function handleItemOffWithoutSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (isEndPoint(contentPosition) || contentNode.type === 'normal') {
      const config = { facingMeta: `[${meta} `, content: menuItem, trailingMeta: ']' };
      return insertContentAtCursor(text, nodes, state, config);
    }

    if (contentNode.type === 'decoration') {
      const newMeta = contentNode.facingMeta.substring(1, contentNode.facingMeta.length - 1) + meta;
      const config = { facingMeta: `[${newMeta} `, trailingMeta: ']' };
      return replaceContentAtCursor(text, nodes, contentPosition, state, config);
    }

    return [text, state];
  }

  function handleItemOnWithoutSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return [text, state];

    let decoCount = 0;
    for (const decoItem of ['bold', 'italic', 'underline'] as const) {
      if (contentNode.decoration[decoItem]) decoCount++;
    }

    const config = { facingMeta: '', trailingMeta: '' };
    if (decoCount > 1) {
      config.facingMeta = contentNode.facingMeta.replaceAll(meta, '');
      config.trailingMeta = contentNode.trailingMeta;
    }
    return replaceContentAtCursor(text, nodes, contentPosition, state, config);
  }

  function handleItemOffWithSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type === 'normal') {
      const config = { facingMeta: `[${meta} `, trailingMeta: ']' };
      return createContentByTextSelection(text, nodes, state, config);
    }

    if (contentNode.type === 'decoration') {
      const newMeta = contentNode.facingMeta.substring(1, contentNode.facingMeta.length - 1) + meta;
      const config = { facingMeta: `[${newMeta} `, trailingMeta: ']' };
      return splitContentByTextSelection(text, nodes, contentPosition, state, config);
    }

    return [text, state];
  }

  function handleItemOnWithSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return [text, state];

    let decoCount = 0;
    for (const decoItem of ['bold', 'italic', 'underline'] as const) {
      if (contentNode.decoration[decoItem]) decoCount++;
    }

    const config = { facingMeta: '', trailingMeta: '' };
    if (decoCount > 1) {
      config.facingMeta = contentNode.facingMeta.replaceAll(meta, '');
      config.trailingMeta = contentNode.trailingMeta;
    }
    return splitContentByTextSelection(text, nodes, contentPosition, state, config);
  }

  if (!state.cursorCoordinate) return [text, state];

  if (contentPosition.type === 'empty') {
    const config = { facingMeta: `[${meta} `, content: menuItem, trailingMeta: ']' };
    return insertContentAtCursor(text, nodes, state, config);
  }

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return handleItemOffWithoutSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      return handleItemOffWithSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithSelection(lineNode, contentPosition);
    }
  }
}

function handleOnMarkdownDecorationItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  menuItem: 'bold' | 'italic',
  menuSwitch: 'on' | 'off'
): [string, State] {
  const meta = { bold: '*', italic: '_' }[menuItem];

  function handleItemOffWithoutSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (!isEndPoint(contentPosition) && contentNode.type !== 'normal') return [text, state];
    const config = { facingMeta: meta, content: menuItem, trailingMeta: meta };
    return insertContentAtCursor(text, nodes, state, config);
  }

  function handleItemOnWithoutSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return [text, state];
    return replaceContentAtCursor(text, nodes, contentPosition, state, { facingMeta: '', trailingMeta: '' });
  }

  function handleItemOffWithSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'normal') return [text, state];
    const config = { facingMeta: meta, content: menuItem, trailingMeta: meta };
    return createContentByTextSelection(text, nodes, state, config);
  }

  function handleItemOnWithSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return [text, state];
    return splitContentByTextSelection(text, nodes, contentPosition, state, { facingMeta: '', trailingMeta: '' });
  }

  if (!state.cursorCoordinate) return [text, state];

  if (contentPosition.type === 'empty') {
    const config = { facingMeta: meta, content: menuItem, trailingMeta: meta };
    return insertContentAtCursor(text, nodes, state, config);
  }

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return handleItemOffWithoutSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      return handleItemOffWithSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithSelection(lineNode, contentPosition);
    }
  }
}
