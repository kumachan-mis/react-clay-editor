import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { TextSelection } from '../../Selection/types';
import { copySelection, selectionToRange } from '../../Selection/utils';
import { ItemizationNode, LineNode, NormalLineNode, QuotationNode } from '../../parser/types';
import { isPureLineNode } from '../../parser/utils';
import { isEndPoint, undefinedIfZeroSelection } from '../callbacksCommon/utils';
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
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'off' };

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };

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
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'disabled' };

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };

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
  if (!state.cursorCoordinate) return [text, state];
  const meta = { bold: '*', italic: '/', underline: '_' }[menuItem];

  if (contentPosition.type === 'empty') {
    const insertedText = `[${meta} ${menuItem}]`;
    const [newText, newState] = insertText(text, state, insertedText, insertedText.length - 1);
    if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

    const fixed = { ...newState.cursorCoordinate, charIndex: newState.cursorCoordinate.charIndex - menuItem.length };
    const free = newState.cursorCoordinate;
    return [newText, { ...newState, textSelection: { fixed, free } }];
  }

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const line = text.split('\n')[contentPosition.lineIndex];
  let [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
  let [newText, newState] = [text, state];

  function updateForItemOffWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): void {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (isEndPoint(contentPosition) || contentNode.type === 'normal') {
      const insertedText = `[${meta} ${menuItem}]`;
      [newText, newState] = insertText(newText, newState, insertedText, insertedText.length - 1);
      if (!newState.cursorCoordinate) return;
      newCursorCoordinate = newState.cursorCoordinate;
      const free = { ...newCursorCoordinate, charIndex: newCursorCoordinate.charIndex - menuItem.length };
      const fixed = newState.cursorCoordinate;
      newTextSelection = { fixed, free };
    } else if (contentNode.type === 'decoration') {
      const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
      const insertIndex = start + contentNode.facingMeta.length - 1;
      const insertedText = line.slice(start, insertIndex) + meta + line.slice(insertIndex, end);
      const contentSelection: TextSelection = {
        fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: start },
        free: { lineIndex: cursorCoordinate.lineIndex, charIndex: end },
      };
      [newText, newState] = insertText(newText, { ...newState, textSelection: contentSelection }, insertedText);
      if (newCursorCoordinate.charIndex > insertIndex) newCursorCoordinate.charIndex += meta.length;
    }
  }

  function updateForItemOnWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): void {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'decoration') return;

    let decoCount = 0;
    for (const decoItem of ['bold', 'italic', 'underline'] as const) {
      if (contentNode.decoration[decoItem]) decoCount++;
    }

    const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
    const contentSelection: TextSelection = {
      fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: start },
      free: { lineIndex: cursorCoordinate.lineIndex, charIndex: end },
    };
    const { facingMeta, trailingMeta } = contentNode;
    if (decoCount <= 1) {
      const moveCharIndexByMetaDeletion = (charIndex: number): number => {
        const newCharIndex = charIndex - facingMeta.length;
        const bodyLength = line.length - facingMeta.length - trailingMeta.length;
        if (newCharIndex < 0) return 0;
        if (newCharIndex > bodyLength) return bodyLength;
        return newCharIndex;
      };
      const insertedText = line.slice(start + facingMeta.length, end - trailingMeta.length);
      [newText, newState] = insertText(newText, { ...newState, textSelection: contentSelection }, insertedText);
      newCursorCoordinate.charIndex = moveCharIndexByMetaDeletion(newCursorCoordinate.charIndex);
    } else {
      const newFacingMeta = facingMeta.replaceAll(meta, '');
      const contentText = line.slice(start + facingMeta.length, end - trailingMeta.length);
      const insertedText = newFacingMeta + contentText + trailingMeta;
      [newText, newState] = insertText(newText, { ...newState, textSelection: contentSelection }, insertedText);
      if (newCursorCoordinate.charIndex > start + facingMeta.length) {
        newCursorCoordinate.charIndex -= facingMeta.length - newFacingMeta.length;
      } else {
        const countCharInString = (s: string, c: string): number => s.split(c).length - 1;
        const facingMetaFragment = line.slice(start, newCursorCoordinate.charIndex);
        newCursorCoordinate.charIndex -= countCharInString(facingMetaFragment, meta);
      }
    }
  }

  function updateForItemOffWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>,
    textSelection: TextSelection
  ): void {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);
    if (contentNode.type === 'normal') {
      const contentText = line.slice(selectionStart.charIndex, selectionEnd.charIndex);
      const insertedText = `[${meta} ${contentText}]`;
      [newText, newState] = insertText(newText, newState, insertedText, insertedText.length - 1);
      if (!newState.cursorCoordinate) return;
      newCursorCoordinate = newState.cursorCoordinate;
      const free = { ...newCursorCoordinate, charIndex: newCursorCoordinate.charIndex - contentText.length };
      const fixed = newState.cursorCoordinate;
      newTextSelection = { fixed, free };
      return;
    }

    if (contentNode.type !== 'decoration') return;

    const { facingMeta, trailingMeta } = contentNode;
    const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
    const contentSelection: TextSelection = {
      fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: start },
      free: { lineIndex: cursorCoordinate.lineIndex, charIndex: end },
    };

    let insertedText = '';
    let [coordinateMoveAmount, fixedMoveAmount, freeMoveAmount] = [0, 0, 0];
    if (selectionStart.charIndex > start + facingMeta.length) {
      insertedText += facingMeta + line.slice(start + facingMeta.length, selectionStart.charIndex) + trailingMeta;
      const charIndexMoveAmount = (charIndex: number): number => {
        let amount = 0;
        if (charIndex > start + facingMeta.length) amount += facingMeta.length;
        if (charIndex >= selectionStart.charIndex) amount += trailingMeta.length;
        return amount;
      };
      coordinateMoveAmount += charIndexMoveAmount(newCursorCoordinate.charIndex);
      if (newTextSelection) {
        fixedMoveAmount += charIndexMoveAmount(newTextSelection.fixed.charIndex);
        freeMoveAmount += charIndexMoveAmount(newTextSelection.free.charIndex);
      }
    }

    {
      const newFacingMeta = facingMeta.slice(0, facingMeta.length - 1) + meta + facingMeta[facingMeta.length - 1];
      const midContentStart = Math.max(selectionStart.charIndex, start + facingMeta.length);
      const midContentEnd = Math.min(selectionEnd.charIndex, end - trailingMeta.length);
      insertedText += newFacingMeta + line.slice(midContentStart, midContentEnd) + trailingMeta;
      const charIndexMoveAmount = (charIndex: number): number => {
        let amount = 0;
        if (charIndex > start + facingMeta.length - 1) amount += meta.length;
        return amount;
      };
      coordinateMoveAmount += charIndexMoveAmount(newCursorCoordinate.charIndex);
      if (newTextSelection) {
        fixedMoveAmount += charIndexMoveAmount(newTextSelection.fixed.charIndex);
        freeMoveAmount += charIndexMoveAmount(newTextSelection.free.charIndex);
      }
    }

    if (selectionEnd.charIndex < end - trailingMeta.length) {
      insertedText += facingMeta + line.slice(selectionEnd.charIndex, end - trailingMeta.length) + trailingMeta;
      const charIndexMoveAmount = (charIndex: number): number => {
        let amount = 0;
        if (charIndex > selectionEnd.charIndex) amount += facingMeta.length;
        if (charIndex >= end - trailingMeta.length) amount += trailingMeta.length;
        return amount;
      };
      coordinateMoveAmount += charIndexMoveAmount(newCursorCoordinate.charIndex);
      if (newTextSelection) {
        fixedMoveAmount += charIndexMoveAmount(newTextSelection.fixed.charIndex);
        freeMoveAmount += charIndexMoveAmount(newTextSelection.free.charIndex);
      }
    }

    [newText, newState] = insertText(newText, { ...newState, textSelection: contentSelection }, insertedText);
    newCursorCoordinate.charIndex += coordinateMoveAmount;
    if (newTextSelection) {
      newTextSelection.fixed.charIndex += fixedMoveAmount;
      newTextSelection.free.charIndex += freeMoveAmount;
    }
  }

  function updateForItemOnWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>,
    textSelection: TextSelection
  ): void {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    const { start, end } = selectionToRange(textSelection);
  }

  if (!textSelection) {
    if (menuSwitch === 'off') {
      updateForItemOffWithoutSelection(lineNode, contentPosition);
    } else {
      updateForItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      updateForItemOffWithSelection(lineNode, contentPosition, textSelection);
    } else {
      updateForItemOnWithSelection(lineNode, contentPosition, textSelection);
    }
  }
  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function handleOnMarkdownDecorationItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  menuItem: 'bold' | 'italic',
  menuSwitch: 'on' | 'off'
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  if (contentPosition.type === 'empty') {
    return [text, state];
  }

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  const contentNode = lineNode.children[contentPosition.lineIndex];
  const { cursorCoordinate, textSelection } = state;
  const line = text.split('\n')[contentNode.lineIndex];
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
  const [newText, newState] = [text, state];

  function updateForItemOffWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): void {}

  function updateForItemOnWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): void {}

  function updateForItemOffWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>,
    textSelection: TextSelection
  ): void {}

  function updateForItemOnWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>,
    textSelection: TextSelection
  ): void {}

  if (!textSelection) {
    if (menuSwitch === 'off') {
      updateForItemOffWithoutSelection(lineNode, contentPosition);
    } else {
      updateForItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      updateForItemOffWithSelection(lineNode, contentPosition, textSelection);
    } else {
      updateForItemOnWithSelection(lineNode, contentPosition, textSelection);
    }
  }
  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}
