import { ContentNode, TextLikeNode } from '../../../../../parser/content/types';
import { isTextLikeNode } from '../../../../../parser/content/utils';
import { LineNode, PureLineNode } from '../../../../../parser/line/types';
import { isPureLineNode } from '../../../../../parser/line/utils';
import { copyCoordinate } from '../../../../molecules/cursor/Cursor/utils';
import { CursorSelection } from '../../../../molecules/selection/Selection/types';
import {
  copySelection,
  selectionToRange,
  undefinedIfZeroSelection,
} from '../../../../molecules/selection/Selection/utils';
import { insertText } from '../../../Editor/common/text';
import { EditorState } from '../../../Editor/types';
import { isEndPoint } from '../../common/utils';
import { ContentPosition } from '../../hooks/contentPosition';

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
  state: EditorState,
  config: ContentMenuConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, EditorState] {
  const { cursorCoordinate } = state;
  if (!cursorCoordinate || !isPureLineNode(nodes[cursorCoordinate.lineIndex])) return [text, state];

  const contentText = getContent(config.content);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, state, insertedText, config.facingMeta.length + contentText.length);
  if (!newState.cursorCoordinate) return [newText, { ...newState, cursorSelection: undefined }];

  const fixed = { ...newState.cursorCoordinate, charIndex: newState.cursorCoordinate.charIndex - contentText.length };
  const free = newState.cursorCoordinate;
  return [newText, { ...newState, cursorSelection: { fixed, free } }];
}

export function replaceContentAtCursor(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: EditorState,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, EditorState] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.cursorCoordinate || !isPureLineNode(lineNode)) return [text, state];
  const contentNode = getContentNodeIfNonEndPoint(lineNode, contentPosition, !!config.nestedSearch);
  if (!contentNode || isTextLikeNode(contentNode)) return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
  const contentSelection: CursorSelection = {
    fixed: { lineIndex: contentPosition.lineIndex, charIndex: start },
    free: { lineIndex: contentPosition.lineIndex, charIndex: end },
  };

  const rawContentText = line.slice(start + contentNode.facingMeta.length, end - contentNode.trailingMeta.length);
  const contentText = getContent(rawContentText);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, { ...state, cursorSelection: contentSelection }, insertedText);

  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(cursorSelection)];

  const newCharIndex = (charIndex: number) => newCharIndexAfterReplacement(charIndex, contentNode, config);
  newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: undefinedIfZeroSelection(newTextSelection) },
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
  state: EditorState,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, EditorState] {
  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  if (!cursorSelection || cursorSelection.fixed.lineIndex !== cursorSelection.free.lineIndex) return [text, state];
  const lineIndex = cursorSelection.fixed.lineIndex;
  if (!isPureLineNode(nodes[lineIndex])) return [text, state];

  const line = text.split('\n')[lineIndex];
  const { start: selectionStart, end: selectionEnd } = selectionToRange(cursorSelection);

  const rawContentText = line.slice(selectionStart.charIndex, selectionEnd.charIndex);
  const contentText = getContent(rawContentText);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, state, insertedText);

  const [newCursorCoordinate, newTextSelection] = [copyCoordinate(cursorCoordinate), copySelection(cursorSelection)];

  const newCharIndex = (charIndex: number) => newCharIndexAfterCreation(charIndex, cursorSelection, config);
  if (newCursorCoordinate) newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

export function newCharIndexAfterCreation(
  charIndex: number,
  cursorSelection: CursorSelection,
  config: ContentMenuMetaConfig
): number {
  const { start: selectionStart, end: selectionEnd } = selectionToRange(cursorSelection);
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
  state: EditorState,
  config: ContentMenuMetaConfig,
  getContent: (rawContent: string) => string = (rawContent) => rawContent
): [string, EditorState] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.cursorSelection || !isPureLineNode(lineNode)) return [text, state];
  const contentNode = getContentNodeIfNonEndPoint(lineNode, contentPosition, !!config.nestedSearch);
  if (!contentNode || isTextLikeNode(contentNode)) return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  const { start: selectionStart, end: selectionEnd } = selectionToRange(cursorSelection);
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
    fixedMoveAmount += charIndexMoveAmount(cursorSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(cursorSelection.free.charIndex);
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
    fixedMoveAmount += charIndexMoveAmount(cursorSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(cursorSelection.free.charIndex);
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
    fixedMoveAmount += charIndexMoveAmount(cursorSelection.fixed.charIndex);
    freeMoveAmount += charIndexMoveAmount(cursorSelection.free.charIndex);
  }

  const contentSelection: CursorSelection = {
    fixed: { lineIndex: contentPosition.lineIndex, charIndex: start },
    free: { lineIndex: contentPosition.lineIndex, charIndex: end },
  };
  const [newText, newState] = insertText(text, { ...state, cursorSelection: contentSelection }, insertedText);

  const [newCursorCoordinate, newTextSelection] = [copyCoordinate(cursorCoordinate), copySelection(cursorSelection)];
  if (newCursorCoordinate) newCursorCoordinate.charIndex += coordinateMoveAmount;
  if (newTextSelection) {
    newTextSelection.fixed.charIndex += fixedMoveAmount;
    newTextSelection.free.charIndex += freeMoveAmount;
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: undefinedIfZeroSelection(newTextSelection) },
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
