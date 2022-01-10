import { copyCoordinate } from '../../Cursor/utils';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { TextSelection } from '../../Selection/types';
import { copySelection, selectionToRange } from '../../Selection/utils';
import { ContentNode, LineNode, NormalNode } from '../../parser/types';
import { isPureLineNode } from '../../parser/utils';
import { ContentPosition } from '../types';

import { ContentConfig, ContentMetaConfig } from './types';
import { isEndPoint, undefinedIfZeroSelection } from './utils';

export function insertContentAtCursor(
  text: string,
  nodes: LineNode[],
  state: State,
  config: ContentConfig
): [string, State] {
  const { cursorCoordinate } = state;
  if (!cursorCoordinate || !isPureLineNode(nodes[cursorCoordinate.lineIndex])) return [text, state];

  const { facingMeta, content, trailingMeta } = config;
  const insertedText = facingMeta + content + trailingMeta;
  const [newText, newState] = insertText(text, state, insertedText, facingMeta.length + content.length);
  if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

  const fixed = { ...newState.cursorCoordinate, charIndex: newState.cursorCoordinate.charIndex - content.length };
  const free = newState.cursorCoordinate;
  return [newText, { ...newState, textSelection: { fixed, free } }];
}

export function substituteContentAtCursor(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition,
  state: State,
  config: ContentMetaConfig
): [string, State] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.cursorCoordinate || !isPureLineNode(lineNode) || isEndPoint(contentPosition)) return [text, state];
  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (contentNode.type === 'normal') return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];
  const contentSelection: TextSelection = {
    fixed: { lineIndex: contentPosition.lineIndex, charIndex: start },
    free: { lineIndex: contentPosition.lineIndex, charIndex: end },
  };

  const contentText = line.slice(start + contentNode.facingMeta.length, end - contentNode.trailingMeta.length);
  const insertedText = config.facingMeta + contentText + config.trailingMeta;
  const [newText, newState] = insertText(text, { ...state, textSelection: contentSelection }, insertedText);

  const { cursorCoordinate, textSelection } = state;
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  const newCharIndex = (charIndex: number) => newCharIndexAfterSubstitution(charIndex, contentNode, config);
  newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    newTextSelection.free.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

export function newCharIndexAfterSubstitution(
  charIndex: number,
  contentNode: Exclude<ContentNode, NormalNode>,
  config: ContentMetaConfig
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
  config: ContentMetaConfig
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!textSelection || textSelection.fixed.lineIndex !== textSelection.free.lineIndex) return [text, state];
  const lineIndex = textSelection.fixed.lineIndex;
  if (!isPureLineNode(nodes[lineIndex])) return [text, state];

  const line = text.split('\n')[lineIndex];
  const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);

  const contentText = line.slice(selectionStart.charIndex, selectionEnd.charIndex);
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
  config: ContentMetaConfig
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
  config: ContentMetaConfig
): [string, State] {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!state.textSelection || !isPureLineNode(lineNode) || isEndPoint(contentPosition)) return [text, state];
  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (contentNode.type === 'normal') return [text, state];

  const line = text.split('\n')[contentPosition.lineIndex];
  const { cursorCoordinate, textSelection } = state;
  const { start: selectionStart, end: selectionEnd } = selectionToRange(textSelection);
  const [start, end] = [contentNode.range[0], contentNode.range[1] + 1];

  if (selectionEnd.charIndex <= start + contentNode.facingMeta.length) {
    const dummyState = { ...state, cursorCoordinate: selectionEnd };
    return substituteContentAtCursor(text, nodes, contentPosition, dummyState, config);
  }
  if (end - contentNode.trailingMeta.length <= selectionStart.charIndex) {
    const dummyState = { ...state, cursorCoordinate: selectionStart };
    return substituteContentAtCursor(text, nodes, contentPosition, dummyState, config);
  }

  let insertedText = '';
  let [coordinateMoveAmount, fixedMoveAmount, freeMoveAmount] = [0, 0, 0];

  if (selectionStart.charIndex > start + contentNode.facingMeta.length) {
    const contentText = line.slice(start + contentNode.facingMeta.length, selectionStart.charIndex);
    insertedText += contentNode.facingMeta + contentText + contentNode.trailingMeta;
    const charIndexMoveAmount = (charIndex: number): number => {
      let amount = 0;
      if (charIndex > start + contentNode.facingMeta.length) amount += contentNode.facingMeta.length;
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
    const contentText = line.slice(midContentStart, midContentEnd);
    insertedText += config.facingMeta + contentText + config.trailingMeta;
    const charIndexMoveAmount = (charIndex: number): number => {
      if (charIndex <= start) {
        return 0;
      } else if (charIndex <= start + contentNode.facingMeta.length) {
        return start + config.facingMeta.length - charIndex;
      } else if (charIndex <= end - contentNode.trailingMeta.length) {
        return -contentNode.facingMeta.length + config.facingMeta.length;
      }
      return (
        -(contentNode.facingMeta.length + contentNode.trailingMeta.length) +
        (config.facingMeta.length + config.trailingMeta.length)
      );
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
      if (charIndex >= end - contentNode.trailingMeta.length) amount += contentNode.trailingMeta.length;
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
