import { State } from '../../Editor/types';
import { ItemizationNode, LineNode, NormalLineNode, QuotationNode } from '../../parser/types';
import { isPureLineNode } from '../../parser/utils';
import {
  createContentByTextSelection,
  insertContentAtCursor,
  splitContentByTextSelection,
  substituteContentAtCursor,
} from '../callbacksCommon/content';
import { isEndPoint } from '../callbacksCommon/utils';
import { BoldMenuProps, ContentPosition, ContentPositionEmpty, ItalicMenuProps, UnderlineMenuProps } from '../types';

import { MenuHandler } from './types';

interface MenuSwitch {
  bold: 'on' | 'off' | 'disabled';
  italic: 'on' | 'off' | 'disabled';
  underline: 'on' | 'off' | 'disabled';
}

export function decorationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): MenuSwitch {
  if (!contentPosition) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };

  if (!syntax || syntax === 'bracket') {
    // bracket syntax
    return bracketDecorationMenuSwitch(nodes, contentPosition);
  } else {
    // markdown syntax
    return markdownDecorationMenuSwitch(nodes, contentPosition);
  }
}

function bracketDecorationMenuSwitch(nodes: LineNode[], contentPosition: ContentPosition): MenuSwitch {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'off' };

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'decoration': {
      const { bold, italic, underline } = contentNode.decoration;
      return { bold: bold ? 'on' : 'off', italic: italic ? 'on' : 'off', underline: underline ? 'on' : 'off' };
    }
    case 'normal':
      return { bold: 'off', italic: 'off', underline: 'off' };
    default:
      return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  }
}

function markdownDecorationMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition
): MenuSwitch & { underline: 'disabled' } {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'disabled' };

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'decoration': {
      const { bold, italic } = contentNode.decoration;
      if (bold) return { bold: 'on', italic: 'disabled', underline: 'disabled' };
      if (italic) return { bold: 'disabled', italic: 'on', underline: 'disabled' };
      return { bold: 'off', italic: 'off', underline: 'disabled' };
    }
    case 'normal':
      return { bold: 'off', italic: 'off', underline: 'disabled' };
    default:
      return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  }
}

export function handleOnDecorationClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  props: MenuHandler<BoldMenuProps | ItalicMenuProps | UnderlineMenuProps>,
  menuItem: 'bold' | 'italic' | 'underline',
  menuSwitch: MenuSwitch
): [string, State] {
  const menuSwitchItem = menuSwitch[menuItem];
  if (!contentPosition || menuSwitchItem === 'disabled') return [text, state];

  if (!props.syntax || props.syntax === 'bracket') {
    // bracket syntax
    return handleOnBracketDecorationItemClick(text, nodes, contentPosition, state, menuItem, menuSwitchItem);
  } else if (menuItem !== 'underline') {
    // markdown syntax
    return handleOnMarkdownDecorationItemClick(text, nodes, contentPosition, state, menuItem, menuSwitchItem);
  }

  return [text, state];
}

function handleOnBracketDecorationItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  menuItem: 'bold' | 'italic' | 'underline',
  menuSwitch: 'on' | 'off'
): [string, State] {
  const meta = { bold: '*', italic: '/', underline: '_' }[menuItem];

  function handleItemOffWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
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
      return substituteContentAtCursor(text, nodes, contentPosition, state, config);
    }

    return [text, state];
  }

  function handleItemOnWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
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
    return substituteContentAtCursor(text, nodes, contentPosition, state, config);
  }

  function handleItemOffWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
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
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
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
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (!isEndPoint(contentPosition) && contentNode.type !== 'normal') return [text, state];
    const config = { facingMeta: meta, content: menuItem, trailingMeta: meta };
    return insertContentAtCursor(text, nodes, state, config);
  }

  function handleItemOnWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return [text, state];
    return substituteContentAtCursor(text, nodes, contentPosition, state, { facingMeta: '', trailingMeta: '' });
  }

  function handleItemOffWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'normal') return [text, state];
    const config = { facingMeta: meta, content: menuItem, trailingMeta: meta };
    return createContentByTextSelection(text, nodes, state, config);
  }

  function handleItemOnWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
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
