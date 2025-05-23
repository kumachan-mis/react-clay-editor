import { EditorState } from '../../../../../contexts/EditorStateContext';
import { TopLevelNode } from '../../../../../parser';
import { BlockNode, isBlockNode } from '../../../../../parser/block/blockNode';
import { CursorCoordinate } from '../../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../../types/selection/cursorSelection';
import { copySelection } from '../../../../molecules/selection/Selection/utils';
import { insertText } from '../../../EditorTextFieldBody/common/text';
import { getLineRange } from '../../common/utils';
import { BlockPosition } from '../../hooks/blockPosition';
import { BlockMenuSwitch } from '../../switches/common/block';

export type BlockMenuConfig = {
  label: string;
  meta: string;
};

export function handleOnBlockMenuClick(
  text: string,
  nodes: TopLevelNode[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  menuSwitch: BlockMenuSwitch,
  config: BlockMenuConfig,
): [string, EditorState] {
  if (!state.cursorCoordinate || menuSwitch === 'disabled') return [text, state];

  if (menuSwitch === 'off') return handleBlockMenuOff(text, state, config);

  if (!blockPosition) return [text, state];

  const blockNode = nodes[blockPosition.blockIndex];
  if (!isBlockNode(blockNode)) return [text, state];

  const { cursorCoordinate, cursorSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);
  if (allInRange(blockNode, [firstLineIndex, lastLineIndex])) {
    return handleBlockMenuAllInRange(text, state, blockNode);
  }

  const bodyTopIndex = blockNode._lineRange[0] + 1;
  const topMeta = Array(blockNode.facingMeta.indent.length + 1).join(' ') + config.meta + '\n';

  const bodyBottomIndex = blockNode._lineRange[1] - (blockNode.trailingMeta ? 1 : 0);
  const bottomMeta = '\n' + Array(blockNode.facingMeta.indent.length + 1).join(' ') + config.meta;

  if (firstLineIndex > bodyTopIndex && lastLineIndex < bodyBottomIndex) {
    return handleBlockMenuMiddleRange(text, state, topMeta, bottomMeta);
  }

  if (firstLineIndex > bodyTopIndex) return handleBlockMenuUpperRange(text, state, blockNode, topMeta);
  if (lastLineIndex < bodyBottomIndex) return handleBlockMenuLowerRange(text, state, blockNode, bottomMeta);

  return [text, state];
}

function handleBlockMenuOff(text: string, state: EditorState, config: BlockMenuConfig): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const { cursorCoordinate, cursorSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  if (firstLineIndex === lastLineIndex && !lines[firstLineIndex]) {
    const insertedText = [config.meta, config.label, config.meta].join('\n');
    const [newText, newState] = insertText(text, state, insertedText, insertedText.length - config.meta.length - 1);
    if (!newState.cursorCoordinate) return [newText, { ...newState, cursorSelection: undefined }];

    const fixed = {
      ...newState.cursorCoordinate,
      charIndex: newState.cursorCoordinate.charIndex - config.label.length,
    };
    const free = newState.cursorCoordinate;
    return [newText, { ...newState, cursorSelection: { fixed, free } }];
  }

  const contentTextLines = lines.slice(firstLineIndex, lastLineIndex + 1);
  const insertedText = [config.meta, ...contentTextLines, config.meta].join('\n');
  const blockSelection: CursorSelection = {
    fixed: { lineIndex: firstLineIndex, charIndex: 0 },
    free: { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length },
  };
  const [newText, newState] = insertText(text, { ...state, cursorSelection: blockSelection }, insertedText);

  const [newCursorCoordinate, newCursorSelection] = [{ ...cursorCoordinate }, copySelection(cursorSelection)];
  const newLineIndex = (lineIndex: number): number => {
    if (lineIndex < firstLineIndex) return lineIndex;
    if (lineIndex <= lastLineIndex) return lineIndex + 1;
    return lineIndex + 1;
  };
  newCursorCoordinate.lineIndex = newLineIndex(newCursorCoordinate.lineIndex);
  if (newCursorSelection) {
    newCursorSelection.fixed.lineIndex = newLineIndex(newCursorSelection.fixed.lineIndex);
    newCursorSelection.free.lineIndex = newLineIndex(newCursorSelection.free.lineIndex);
  }
  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection }];
}

function handleBlockMenuAllInRange(text: string, state: EditorState, blockNode: BlockNode): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, cursorSelection } = state;
  const lines = text.split('\n');

  if (blockNode.children.length === 0) {
    const blockSelection: CursorSelection = {
      fixed: { lineIndex: blockNode._lineRange[0], charIndex: 0 },
      free: { lineIndex: blockNode._lineRange[1], charIndex: lines[blockNode._lineRange[1]].length },
    };
    const [newText, newState] = insertText(text, { ...state, cursorSelection: blockSelection }, '');
    return [newText, newState];
  }

  const start = blockNode._lineRange[0] + 1;
  const end = blockNode._lineRange[1] + (blockNode.trailingMeta ? 0 : 1);

  const insertedText = lines.slice(start, end).join('\n');
  const blockSelection: CursorSelection = {
    fixed: { lineIndex: blockNode._lineRange[0], charIndex: 0 },
    free: { lineIndex: blockNode._lineRange[1], charIndex: lines[blockNode._lineRange[1]].length },
  };
  const [newText, newState] = insertText(text, { ...state, cursorSelection: blockSelection }, insertedText);

  const getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
    if (cursorCoordinate.lineIndex < blockNode._lineRange[0]) {
      return cursorCoordinate;
    } else if (cursorCoordinate.lineIndex === blockNode._lineRange[0]) {
      return { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 };
    } else if (cursorCoordinate.lineIndex < blockNode._lineRange[1] || !blockNode.trailingMeta) {
      return { lineIndex: cursorCoordinate.lineIndex - 1, charIndex: cursorCoordinate.charIndex };
    } else if (cursorCoordinate.lineIndex === blockNode._lineRange[1]) {
      return { lineIndex: cursorCoordinate.lineIndex - 2, charIndex: lines[cursorCoordinate.lineIndex - 1].length };
    } else {
      return { lineIndex: cursorCoordinate.lineIndex - 2, charIndex: cursorCoordinate.charIndex };
    }
  };
  const newCursorCoordinate = getNewCursorCoordinate(cursorCoordinate);
  const newCursorSelection = copySelection(cursorSelection);
  if (newCursorSelection) {
    newCursorSelection.fixed = getNewCursorCoordinate(newCursorSelection.fixed);
    newCursorSelection.free = getNewCursorCoordinate(newCursorSelection.free);
  }
  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection }];
}

function handleBlockMenuMiddleRange(
  text: string,
  state: EditorState,
  topMeta: string,
  bottomMeta: string,
): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, cursorSelection } = state;
  const lines = text.split('\n');
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  let [newText, newState] = [text, state];

  const topCoordinate: CursorCoordinate = { lineIndex: firstLineIndex, charIndex: 0 };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: topCoordinate, cursorSelection: undefined },
    topMeta,
  );

  const bottomCoordinate: CursorCoordinate = { lineIndex: lastLineIndex + 1, charIndex: lines[lastLineIndex].length };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: bottomCoordinate, cursorSelection: undefined },
    bottomMeta,
  );

  const [newCursorCoordinate, newCursorSelection] = [{ ...cursorCoordinate }, copySelection(cursorSelection)];
  const newLineIndex = (lineIndex: number): number => {
    if (lineIndex < firstLineIndex) return lineIndex;
    if (lineIndex <= lastLineIndex) return lineIndex + 1;
    else return lineIndex + 2;
  };
  newCursorCoordinate.lineIndex = newLineIndex(newCursorCoordinate.lineIndex);
  if (newCursorSelection) {
    newCursorSelection.fixed.lineIndex = newLineIndex(newCursorSelection.fixed.lineIndex);
    newCursorSelection.free.lineIndex = newLineIndex(newCursorSelection.free.lineIndex);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection }];
}

function handleBlockMenuUpperRange(
  text: string,
  state: EditorState,
  blockNode: BlockNode,
  topMeta: string,
): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, cursorSelection } = state;
  const lines = text.split('\n');
  const [firstLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  let [newText, newState] = [text, state];

  const topCoordinate: CursorCoordinate = { lineIndex: firstLineIndex, charIndex: 0 };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: topCoordinate, cursorSelection: undefined },
    topMeta,
  );
  let getNewCursorCoordinate = (cursorCoordinate: CursorCoordinate): CursorCoordinate => {
    if (cursorCoordinate.lineIndex < firstLineIndex) return cursorCoordinate;
    return { lineIndex: cursorCoordinate.lineIndex + 1, charIndex: cursorCoordinate.charIndex };
  };

  if (blockNode.trailingMeta) {
    const bottom = blockNode._lineRange[1];
    const bottomSelection: CursorSelection = {
      fixed: { lineIndex: bottom, charIndex: lines[bottom - 1].length },
      free: { lineIndex: bottom + 1, charIndex: lines[bottom].length },
    };
    [newText, newState] = insertText(newText, { ...newState, cursorSelection: bottomSelection }, '');
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
  const newCursorSelection = copySelection(cursorSelection);
  if (newCursorSelection) {
    newCursorSelection.fixed = getNewCursorCoordinate(newCursorSelection.fixed);
    newCursorSelection.free = getNewCursorCoordinate(newCursorSelection.free);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection }];
}

function handleBlockMenuLowerRange(
  text: string,
  state: EditorState,
  blockNode: BlockNode,
  bottomMeta: string,
): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, cursorSelection } = state;
  const lines = text.split('\n');
  const [, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  let [newText, newState] = [text, state];

  const bottomCoordinate: CursorCoordinate = { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length };
  [newText, newState] = insertText(
    newText,
    { ...newState, cursorCoordinate: bottomCoordinate, cursorSelection: undefined },
    bottomMeta,
  );

  const top = blockNode._lineRange[0];
  const topSelection: CursorSelection = {
    fixed: { lineIndex: top, charIndex: 0 },
    free: { lineIndex: top + 1, charIndex: 0 },
  };
  [newText, newState] = insertText(newText, { ...newState, cursorSelection: topSelection }, '');

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
  const newCursorSelection = copySelection(cursorSelection);
  if (newCursorSelection) {
    newCursorSelection.fixed = getNewCursorCoordinate(newCursorSelection.fixed);
    newCursorSelection.free = getNewCursorCoordinate(newCursorSelection.free);
  }

  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection }];
}

function allInRange(blockNode: BlockNode, [firstLineIndex, lastLineIndex]: [number, number]): boolean {
  const [top, bottom] = blockNode._lineRange;
  if (firstLineIndex === top && lastLineIndex === top) return true;
  if (!!blockNode.trailingMeta && firstLineIndex === bottom && lastLineIndex === bottom) return true;

  const topIndexes = blockNode.children.length > 0 ? [top, top + 1] : [top];
  const bottomIndexes = blockNode.trailingMeta ? [bottom, bottom - 1] : [bottom];

  return topIndexes.includes(firstLineIndex) && bottomIndexes.includes(lastLineIndex);
}
