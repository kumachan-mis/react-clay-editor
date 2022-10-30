import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { CursorCoordinate } from '../../components/molecules/Cursor/types';
import { TextSelection } from '../../components/molecules/Selection/types';
import { copySelection } from '../../components/molecules/Selection/utils';
import { LineNode } from '../../parser/types';
import { isPureLineNode } from '../../parser/utils';
import { getLineRange } from '../utils';

import { undefinedIfZeroSelection } from './utils';

export function lineMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State,
  menu: 'itemization' | 'quotation'
): 'alloff' | 'allon' | 'both' | 'disabled' {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const rangeNodes = nodes.slice(firstLineIndex, lastLineIndex + 1);
  if (rangeNodes.some((node) => !['normalLine', menu].includes(node.type))) return 'disabled';
  if (rangeNodes.every((node) => node.type === menu)) return 'allon';
  if (rangeNodes.every((node) => node.type === 'normalLine')) return 'alloff';
  return 'both';
}

export function handleOnLineMenuClick(
  text: string,
  nodes: LineNode[],
  state: State,
  menuItem: 'button' | 'indent' | 'outdent',
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled',
  meta: string
): [string, State] {
  if (!state.cursorCoordinate || menuSwitch === 'disabled' || (menuItem === 'outdent' && menuSwitch === 'alloff')) {
    return [text, state];
  }

  switch (menuItem) {
    case 'button':
      if (menuSwitch === 'allon') {
        return handleLineMenuOn(text, nodes, state, meta);
      } else {
        return handleLineMenuOffOrBoth(text, nodes, state, meta);
      }
    case 'indent':
      return handleLineMenuIndent(text, nodes, state, meta);
    case 'outdent':
      return handleLineMenuOutdent(text, nodes, state, meta);
  }
}

function handleLineMenuOn(text: string, nodes: LineNode[], state: State, meta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation') continue;

    const newCharIndex = (charIndex: number): number => {
      const newCharIndex = charIndex - lineNode.indentDepth - meta.length;
      return newCharIndex >= 0 ? newCharIndex : 0;
    };

    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    const textSelection: TextSelection = {
      fixed: { lineIndex, charIndex: 0 },
      free: { lineIndex, charIndex: lineNode.indentDepth + meta.length },
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

function handleLineMenuOffOrBoth(text: string, nodes: LineNode[], state: State, meta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    if (nodes[lineIndex].type !== 'normalLine') continue;

    const cursorCoordinate: CursorCoordinate = { lineIndex, charIndex: 0 };
    [newText, newState] = insertText(newText, { ...newState, cursorCoordinate, textSelection: undefined }, meta);
    if (newCursorCoordinate.lineIndex === lineIndex) {
      newCursorCoordinate.charIndex += meta.length;
    }
    if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
      newTextSelection.fixed.charIndex += meta.length;
    }
    if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
      newTextSelection.free.charIndex += meta.length;
    }
  }

  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function handleLineMenuIndent(text: string, nodes: LineNode[], state: State, meta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];

  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (!isPureLineNode(lineNode)) continue;
    const heading = lineNode.type === 'normalLine' ? meta : ' ';
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

function handleLineMenuOutdent(text: string, nodes: LineNode[], state: State, meta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let [newText, newState] = [text, state];
  for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
    const lineNode = nodes[lineIndex];
    if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation') continue;

    const deletionLength = lineNode.indentDepth === 0 ? meta.length : 1;
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
