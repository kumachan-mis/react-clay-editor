import { insertText } from '../../../../../Editor/callbacks/utils';
import { State } from '../../../../../Editor/types';
import { LineNode, PureLineNode, ContentNode, TextLikeNode } from '../../../../../parser/types';
import { isPureLineNode, isTextLikeNode } from '../../../../../parser/utils';
import { copyCoordinate } from '../../../cursor/Cursor/utils';
import { TextSelection } from '../../../selection/Selection/types';
import { copySelection, selectionToRange, undefinedIfZeroSelection } from '../../../selection/Selection/utils';
import { isEndPoint } from '../../common/utils';
import { ContentPosition } from '../../hooks/types';

export type ContentMenuConfig = {
  facingMeta: string;
  content: string;
  trailingMeta: string;
  nestedSearch?: boolean;
};

export type ContentMenuMetaConfig = {
  facingMeta: string;
  trailingMeta: string;
  nestedSearch?: boolean;
};

export function insertContentAtCursor(
  text: string,
  nodes: LineNode[],
  state: State,
  config: ContentMenuConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, State] {
  const { cursorCoordinate } = state;
  if (!cursorCoordinate || !isPureLineNode(nodes[cursorCoordinate.lineIndex])) return [text, state];

  const contentText = getContent(config.content);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, state, insertedText, config.facingMeta.length + contentText.length);
  if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

  const fixed = { ...newState.cursorCoordinate, charIndex: newState.cursorCoordinate.charIndex - contentText.length };
  const free = newState.cursorCoordinate;
  return [newText, { ...newState, textSelection: { fixed, free } }];
}

export function replaceContentAtCursor(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, State] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.cursorCoordinate || !isPureLineNode(lineNode)) return [text, state];
  const contentNode = getContentNodeIfNonEndPoint(lineNode, contentPosition, !!config.nestedSearch);
  if (!contentNode || isTextLikeNode(contentNode)) return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
  const contentSelection: TextSelection = {
    fixed: { lineIndex: contentPosition.lineIndex, charIndex: start },
    free: { lineIndex: contentPosition.lineIndex, charIndex: end },
  };

  const rawContentText = line.slice(start + contentNode.facingMeta.length, end - contentNode.trailingMeta.length);
  const contentText = getContent(rawContentText);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, { ...state, textSelection: contentSelection }, insertedText);

  const { cursorCoordinate, textSelection } = state;
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  const newCharIndex = (charIndex: number) => newCharIndexAfterReplacement(charIndex, contentNode, config);
  newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

export function newCharIndexAfterReplacement(
  charIndex: number,
  contentNode: Exclude<ContentNode, TextLikeNode>,
  config: ContentMenuMetaConfig
): number {
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
  if (charIndex <= start) {
    return charIndex;
  } else if (charIndex <= start + contentNode.facingMeta.length) {
    return start + config.facingMeta.length;
  } else if (charIndex <= end - contentNode.trailingMeta.length) {
    return charIndex - contentNode.facingMeta.length + config.facingMeta.length;
  }
  return (
    charIndex -
    (contentNode.facingMeta.length + contentNode.trailingMeta.length) +
    (config.facingMeta.length + config.trailingMeta.length)
  );
}

export function createContentByTextSelection(
  text: string,
  nodes: LineNode[],
  state: State,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!textSelection || textSelection.fixed.lineIndex !== textSelection.free.lineIndex) return [text, state];
  const lineIndex = textSelection.fixed.lineIndex;
  if (!isPureLineNode(nodes[lineIndex])) return [text, state];

  const line = text.split('\n')[lineIndex];
  const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);

  const rawContentText = line.slice(selectionStart.charIndex, selectionEnd.charIndex);
  const contentText = getContent(rawContentText);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, state, insertedText);

  const [newCursorCoordinate, newTextSelection] = [copyCoordinate(cursorCoordinate), copySelection(textSelection)];

  const newCharIndex = (charIndex: number) => newCharIndexAfterCreation(charIndex, textSelection, config);
  if (newCursorCoordinate) newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

export function newCharIndexAfterCreation(
  charIndex: number,
  textSelection: TextSelection,
  config: ContentMenuMetaConfig
): number {
  const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);
  if (charIndex <= selectionStart.charIndex) {
    return selectionStart.charIndex + config.facingMeta.length;
  } else if (charIndex <= selectionEnd.charIndex) {
    return charIndex + config.facingMeta.length;
  }
  return charIndex + (config.facingMeta.length + config.trailingMeta.length);
}

export function splitContentByTextSelection(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, State] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.textSelection || !isPureLineNode(lineNode)) return [text, state];
  const contentNode = getContentNodeIfNonEndPoint(lineNode, contentPosition, !!config.nestedSearch);
  if (!contentNode || isTextLikeNode(contentNode)) return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const { cursorCoordinate, textSelection } = state;
  const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];

  if (selectionEnd.charIndex <= start + contentNode.facingMeta.length) {
    const dummyState = { ...state, cursorCoordinate: selectionEnd };
    return replaceContentAtCursor(text, nodes, contentPosition, dummyState, config);
  }
  if (end - contentNode.trailingMeta.length <= selectionStart.charIndex) {
    const dummyState = { ...state, cursorCoordinate: selectionStart };
    return replaceContentAtCursor(text, nodes, contentPosition, dummyState, config);
  }

  let insertedText = '';
  let [coordinateMoveAmount, fixedMoveAmount, freeMoveAmount] = [0, 0, 0];

  if (selectionStart.charIndex > start + contentNode.facingMeta.length) {
    const contentText = line.slice(start + contentNode.facingMeta.length, selectionStart.charIndex);
    insertedText += contentNode.facingMeta + contentText + contentNode.trailingMeta;
    const charIndexMoveAmount = (charIndex: number): number => {
      let amount = 0;
      if (charIndex >= start + contentNode.facingMeta.length) amount += contentNode.facingMeta.length;
      if (charIndex >= selectionStart.charIndex) amount += contentNode.trailingMeta.length;
      return amount;
    };
    if (cursorCoordinate) coordinateMoveAmount += charIndexMoveAmount(cursorCoordinate.charIndex);
    fixedMoveAmount += charIndexMoveAmount(textSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(textSelection.free.charIndex);
  }

  {
    const midContentStart = Math.max(selectionStart.charIndex, start + contentNode.facingMeta.length);
    const midContentEnd = Math.min(selectionEnd.charIndex, end - contentNode.trailingMeta.length);
    const rawContentText = line.slice(midContentStart, midContentEnd);
    const contentText = getContent(rawContentText);
    insertedText += config.facingMeta + contentText + config.trailingMeta;
    const charIndexMoveAmount = (charIndex: number): number => {
      if (midContentStart - contentNode.facingMeta.length < charIndex && charIndex < midContentStart) {
        return config.facingMeta.length - contentNode.facingMeta.length + midContentStart - charIndex;
      }
      if (midContentEnd < charIndex && charIndex < midContentEnd + contentNode.trailingMeta.length) {
        return config.facingMeta.length - contentNode.facingMeta.length + midContentEnd - charIndex;
      }

      let amount = 0;
      if (charIndex >= midContentStart) amount += config.facingMeta.length - contentNode.facingMeta.length;
      if (charIndex > midContentEnd) amount += config.trailingMeta.length - contentNode.trailingMeta.length;
      return amount;
    };
    if (cursorCoordinate) coordinateMoveAmount += charIndexMoveAmount(cursorCoordinate.charIndex);
    fixedMoveAmount += charIndexMoveAmount(textSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(textSelection.free.charIndex);
  }

  if (selectionEnd.charIndex < end - contentNode.trailingMeta.length) {
    const contentText = line.slice(selectionEnd.charIndex, end - contentNode.trailingMeta.length);
    insertedText += contentNode.facingMeta + contentText + contentNode.trailingMeta;
    const charIndexMoveAmount = (charIndex: number): number => {
      let amount = 0;
      if (charIndex > selectionEnd.charIndex) amount += contentNode.facingMeta.length;
      if (charIndex > end - contentNode.trailingMeta.length) amount += contentNode.trailingMeta.length;
      return amount;
    };
    if (cursorCoordinate) coordinateMoveAmount += charIndexMoveAmount(cursorCoordinate.charIndex);
    fixedMoveAmount += charIndexMoveAmount(textSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(textSelection.free.charIndex);
  }

  const contentSelection: TextSelection = {
    fixed: { lineIndex: contentPosition.lineIndex, charIndex: start },
    free: { lineIndex: contentPosition.lineIndex, charIndex: end },
  };
  const [newText, newState] = insertText(text, { ...state, textSelection: contentSelection }, insertedText);

  const [newCursorCoordinate, newTextSelection] = [copyCoordinate(cursorCoordinate), copySelection(textSelection)];
  if (newCursorCoordinate) newCursorCoordinate.charIndex += coordinateMoveAmount;
  if (newTextSelection) {
    newTextSelection.fixed.charIndex += fixedMoveAmount;
    newTextSelection.free.charIndex += freeMoveAmount;
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function getContentNodeIfNonEndPoint(
  lineNode: PureLineNode,
  contentPosition: ContentPosition,
  nestedSearch: boolean
): ContentNode | undefined {
  if (isEndPoint(contentPosition)) return undefined;
  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (!nestedSearch || contentPosition.type !== 'nested' || contentNode.type !== 'decoration') {
    return contentNode;
  }

  if (isEndPoint(contentPosition.childPosition)) return undefined;
  const childContentNode = contentNode.children[contentPosition.childPosition.contentIndexes[0]];
  return childContentNode;
}
