import { LineNode } from '../../../../../parser/line/types';
import { isPureLineNode } from '../../../../../parser/line/utils';
import { insertText } from '../../../../organisms/Editor/common/text';
import { State } from '../../../../organisms/Editor/types';
import { CursorCoordinate } from '../../../cursor/Cursor/types';
import { TextSelection } from '../../../selection/Selection/types';
import { copySelection, undefinedIfZeroSelection } from '../../../selection/Selection/utils';
import { getLineRange } from '../../common/utils';

export type LineMenuConfig = {
  meta: string;
};

export function handleOnLineMenuClick(
  text: string,
  nodes: LineNode[],
  state: State,
  menuItem: 'button' | 'indent' | 'outdent',
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled',
  config: LineMenuConfig
): [string, State] {
  if (!state.cursorCoordinate || menuSwitch === 'disabled' || (menuItem === 'outdent' && menuSwitch === 'alloff')) {
    return [text, state];
  }

  switch (menuItem) {
    case 'button':
      if (menuSwitch === 'allon') {
        return handleLineMenuOn(text, nodes, state, config);
      } else {
        return handleLineMenuOffOrBoth(text, nodes, state, config);
      }
    case 'indent':
      return handleLineMenuIndent(text, nodes, state, config);
    case 'outdent':
      return handleLineMenuOutdent(text, nodes, state, config);
  }
}

function handleLineMenuOn(text: string, nodes: LineNode[], state: State, config: LineMenuConfig): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation') continue;

    const newCharIndex = (charIndex: number): number => {
      const newCharIndex = charIndex - lineNode.indentDepth - config.meta.length;
      return newCharIndex >= 0 ? newCharIndex : 0;
    };

    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    const textSelection: TextSelection = {
      fixed: { lineIndex, charIndex: 0 },
      free: { lineIndex, charIndex: lineNode.indentDepth + config.meta.length },
    };
    [newText, newState] = insertText(newText, { ...newState, cursorCoordinate, textSelection }, '');
    if (newCursorCoordinate.lineIndex === lineIndex) {
      newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    }
    if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
      newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    }
    if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
      newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
    }
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function handleLineMenuOffOrBoth(
  text: string,
  nodes: LineNode[],
  state: State,
  config: LineMenuConfig
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    if (nodes[lineIndex].type !== 'normalLine') continue;

    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    [newText, newState] = insertText(newText, { ...newState, cursorCoordinate, textSelection: undefined }, config.meta);
    if (newCursorCoordinate.lineIndex === lineIndex) {
      newCursorCoordinate.charIndex += config.meta.length;
    }
    if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
      newTextSelection.fixed.charIndex += config.meta.length;
    }
    if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
      newTextSelection.free.charIndex += config.meta.length;
    }
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function handleLineMenuIndent(text: string, nodes: LineNode[], state: State, config: LineMenuConfig): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (!isPureLineNode(lineNode)) continue;
    const heading = lineNode.type === 'normalLine' ? config.meta : ' ';
    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    [newText, newState] = insertText(newText, { ...newState, cursorCoordinate, textSelection: undefined }, heading);
    if (newCursorCoordinate.lineIndex === lineIndex) {
      newCursorCoordinate.charIndex += heading.length;
    }
    if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
      newTextSelection.fixed.charIndex += heading.length;
    }
    if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
      newTextSelection.free.charIndex += heading.length;
    }
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function handleLineMenuOutdent(text: string, nodes: LineNode[], state: State, config: LineMenuConfig): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];
  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation') continue;

    const deletionLength = lineNode.indentDepth === 0 ? config.meta.length : 1;
    const newCharIndex = (charIndex: number): number => {
      const newCharIndex = charIndex - deletionLength;
      return newCharIndex >= 0 ? newCharIndex : 0;
    };
    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    const textSelection: TextSelection = {
      fixed: { lineIndex, charIndex: 0 },
      free: { lineIndex, charIndex: deletionLength },
    };
    [newText, newState] = insertText(newText, { ...newState, cursorCoordinate, textSelection }, '');
    if (newCursorCoordinate.lineIndex === lineIndex) {
      newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    }
    if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
      newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
    }
    if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
      newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
    }
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}
