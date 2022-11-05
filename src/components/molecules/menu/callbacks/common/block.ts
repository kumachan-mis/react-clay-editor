import { BlockNode, LineNode } from '../../../../../parser/types';
import { isBlockNode } from '../../../../../parser/utils';
import { insertText } from '../../../../organisms/Editor/common/text';
import { State } from '../../../../organisms/Editor/types';
import { CursorCoordinate } from '../../../cursor/Cursor/types';
import { TextSelection } from '../../../selection/Selection/types';
import { copySelection } from '../../../selection/Selection/utils';
import { getLineRange } from '../../common/utils';
import { BlockPosition } from '../../hooks/types';
import { BlockMenuSwitch } from '../../switches/common/block';

export type BlockMenuConfig = {
  label: string;
  meta: string;
};

export function handleOnBlockMenuClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  menuSwitch: BlockMenuSwitch,
  config: BlockMenuConfig
): [string, State] {
  if (!state.cursorCoordinate || menuSwitch === 'disabled') return [text, state];

  if (menuSwitch === 'off') return handleBlockMenuOff(text, state, config);

  if (!blockPosition) return [text, state];

  const blockNode = nodes[blockPosition.blockIndex];
  if (!isBlockNode(blockNode)) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  if (allInRange(blockNode, [firstLineIndex, lastLineIndex])) {
    return handleBlockMenuAllInRange(text, state, blockNode);
  }

  const bodyTopIndex = blockNode.range[0] + 1;
  const topMeta = Array(blockNode.facingMeta.indentDepth + 1).join(' ') + config.meta + '\n';

  const bodyBottomIndex = blockNode.range[1] - (blockNode.trailingMeta ? 1 : 0);
  const bottomMeta = '\n' + Array(blockNode.facingMeta.indentDepth + 1).join(' ') + config.meta;

  if (firstLineIndex > bodyTopIndex && lastLineIndex < bodyBottomIndex) {
    return handleBlockMenuMiddleRange(text, state, topMeta, bottomMeta);
  }

  if (firstLineIndex > bodyTopIndex) return handleBlockMenuUpperRange(text, state, blockNode, topMeta);
  if (lastLineIndex < bodyBottomIndex) return handleBlockMenuLowerRange(text, state, blockNode, bottomMeta);

  return [text, state];
}

function handleBlockMenuOff(text: string, state: State, config: BlockMenuConfig): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);

  if (firstLineIndex === lastLineIndex && !lines[firstLineIndex]) {
    const insertedText = [config.meta, config.label, config.meta].join('\n');
    const [newText, newState] = insertText(text, state, insertedText, insertedText.length - config.meta.length - 1);
    if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

    const fixed = {
      ...newState.cursorCoordinate,
      charIndex: newState.cursorCoordinate.charIndex - config.label.length,
    };
    const free = newState.cursorCoordinate;
    return [newText, { ...newState, textSelection: { fixed, free } }];
  }

  const contentTextLines = lines.slice(firstLineIndex, lastLineIndex + 1);
  const insertedText = [config.meta, ...contentTextLines, config.meta].join('\n');
  const blockSelection: TextSelection = {
    fixed: { lineIndex: firstLineIndex, charIndex: 0 },
    free: { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length },
  };
  const [newText, newState] = insertText(text, { ...state, textSelection: blockSelection }, insertedText);

  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
  const newLineIndex = (lineIndex: number): number => {
    if (lineIndex < firstLineIndex) return lineIndex;
    if (lineIndex <= lastLineIndex) return lineIndex + 1;
    return lineIndex + 1;
  };
  newCursorCoordinate.lineIndex = newLineIndex(newCursorCoordinate.lineIndex);
  if (newTextSelection) {
    newTextSelection.fixed.lineIndex = newLineIndex(newTextSelection.fixed.lineIndex);
    newTextSelection.free.lineIndex = newLineIndex(newTextSelection.free.lineIndex);
  }
  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function handleBlockMenuAllInRange(text: string, state: State, blockNode: BlockNode): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const lines = text.split('\n');

  const [start, end] = [blockNode.range[0] + 1, blockNode.range[1]];
  const insertedText = lines.slice(start, blockNode.trailingMeta ? end : end + 1).join('\n');
  const blockSelection: TextSelection = {
    fixed: { lineIndex: blockNode.range[0], charIndex: 0 },
    free: { lineIndex: blockNode.range[1], charIndex: lines[blockNode.range[1]].length },
  };
  const [newText, newState] = insertText(text, { ...state, textSelection: blockSelection }, insertedText);

  const getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
    if (cursorCoordinate.lineIndex < blockNode.range[0]) {
      return cursorCoordinate;
    } else if (cursorCoordinate.lineIndex === blockNode.range[0]) {
      return { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 };
    } else if (cursorCoordinate.lineIndex < blockNode.range[1] || !blockNode.trailingMeta) {
      return { lineIndex: cursorCoordinate.lineIndex - 1, charIndex: cursorCoordinate.charIndex };
    } else if (cursorCoordinate.lineIndex === blockNode.range[1]) {
      return { lineIndex: cursorCoordinate.lineIndex - 2, charIndex: lines[cursorCoordinate.lineIndex - 1].length };
    } else {
      return { lineIndex: cursorCoordinate.lineIndex - 2, charIndex: cursorCoordinate.charIndex };
    }
  };
  const newCursorCoordinate = getNewCursorCoordinate(cursorCoordinate);
  const newTextSelection = copySelection(textSelection);
  if (newTextSelection) {
    newTextSelection.fixed = getNewCursorCoordinate(newTextSelection.fixed);
    newTextSelection.free = getNewCursorCoordinate(newTextSelection.free);
  }
  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function handleBlockMenuMiddleRange(text: string, state: State, topMeta: string, bottomMeta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const lines = text.split('\n');
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);

  let [newText, newState] = [text, state];

  const topCoordinate: CursorCoordinate = { lineIndex: firstLineIndex, charIndex: 0 };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: topCoordinate, textSelection: undefined },
    topMeta
  );

  const bottomCoordinate: CursorCoordinate = { lineIndex: lastLineIndex + 1, charIndex: lines[lastLineIndex].length };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: bottomCoordinate, textSelection: undefined },
    bottomMeta
  );

  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
  const newLineIndex = (lineIndex: number): number => {
    if (lineIndex < firstLineIndex) return lineIndex;
    if (lineIndex <= lastLineIndex) return lineIndex + 1;
    else return lineIndex + 2;
  };
  newCursorCoordinate.lineIndex = newLineIndex(newCursorCoordinate.lineIndex);
  if (newTextSelection) {
    newTextSelection.fixed.lineIndex = newLineIndex(newTextSelection.fixed.lineIndex);
    newTextSelection.free.lineIndex = newLineIndex(newTextSelection.free.lineIndex);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function handleBlockMenuUpperRange(text: string, state: State, blockNode: BlockNode, topMeta: string): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const lines = text.split('\n');
  const [firstLineIndex] = getLineRange(cursorCoordinate, textSelection);

  let [newText, newState] = [text, state];

  const topCoordinate: CursorCoordinate = { lineIndex: firstLineIndex, charIndex: 0 };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: topCoordinate, textSelection: undefined },
    topMeta
  );
  let getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
    if (cursorCoordinate.lineIndex < firstLineIndex) return cursorCoordinate;
    return { lineIndex: cursorCoordinate.lineIndex + 1, charIndex: cursorCoordinate.charIndex };
  };

  if (blockNode.trailingMeta) {
    const bottom = blockNode.range[1];
    const bottomSelection: TextSelection = {
      fixed: { lineIndex: bottom, charIndex: lines[bottom - 1].length },
      free: { lineIndex: bottom + 1, charIndex: lines[bottom].length },
    };
    [newText, newState] = insertText(newText, { ...newState, textSelection: bottomSelection }, '');
    getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
      if (cursorCoordinate.lineIndex < firstLineIndex) {
        return cursorCoordinate;
      } else if (cursorCoordinate.lineIndex < bottom) {
        return { lineIndex: cursorCoordinate.lineIndex + 1, charIndex: cursorCoordinate.charIndex };
      } else if (cursorCoordinate.lineIndex === bottom) {
        return { lineIndex: cursorCoordinate.lineIndex, charIndex: lines[bottom - 1].length };
      } else {
        return cursorCoordinate;
      }
    };
  }

  const newCursorCoordinate = getNewCursorCoordinate(cursorCoordinate);
  const newTextSelection = copySelection(textSelection);
  if (newTextSelection) {
    newTextSelection.fixed = getNewCursorCoordinate(newTextSelection.fixed);
    newTextSelection.free = getNewCursorCoordinate(newTextSelection.free);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function handleBlockMenuLowerRange(
  text: string,
  state: State,
  blockNode: BlockNode,
  bottomMeta: string
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;
  const lines = text.split('\n');
  const [, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);

  let [newText, newState] = [text, state];

  const bottomCoordinate: CursorCoordinate = { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: bottomCoordinate, textSelection: undefined },
    bottomMeta
  );

  const top = blockNode.range[0];
  const topSelection: TextSelection = {
    fixed: { lineIndex: top, charIndex: 0 },
    free: { lineIndex: top + 1, charIndex: 0 },
  };
  [newText, newState] = insertText(newText, { ...newState, textSelection: topSelection }, '');

  const getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
    if (cursorCoordinate.lineIndex < top) {
      return cursorCoordinate;
    } else if (cursorCoordinate.lineIndex === top) {
      return { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 };
    } else if (cursorCoordinate.lineIndex <= lastLineIndex) {
      return { lineIndex: cursorCoordinate.lineIndex - 1, charIndex: cursorCoordinate.charIndex };
    } else {
      return cursorCoordinate;
    }
  };

  const newCursorCoordinate = getNewCursorCoordinate(cursorCoordinate);
  const newTextSelection = copySelection(textSelection);
  if (newTextSelection) {
    newTextSelection.fixed = getNewCursorCoordinate(newTextSelection.fixed);
    newTextSelection.free = getNewCursorCoordinate(newTextSelection.free);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function allInRange(blockNode: BlockNode, [firstLineIndex, lastLineIndex]: [number, number]): boolean {
  const [top, bottom] = blockNode.range;
  if (firstLineIndex === top && lastLineIndex === top) return true;
  if (!!blockNode.trailingMeta && firstLineIndex === bottom && lastLineIndex === bottom) return true;
  const topIndexes = [top, top + 1];
  const bottomIndexes = blockNode.trailingMeta ? [bottom, bottom - 1] : [bottom];
  return topIndexes.includes(firstLineIndex) && bottomIndexes.includes(lastLineIndex);
}
