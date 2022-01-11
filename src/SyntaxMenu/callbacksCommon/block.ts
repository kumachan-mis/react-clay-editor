import { CursorCoordinate } from '../../Cursor/types';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { TextSelection } from '../../Selection/types';
import { copySelection } from '../../Selection/utils';
import { BlockNode, LineNode } from '../../parser/types';
import { isBlockNode, isPureLineNode } from '../../parser/utils';
import { MenuHandler } from '../callbacks/types';
import { BlockPosition, CodeMenuProps, FormulaMenuProps } from '../types';
import { getLineRange } from '../utils';

export function blockMenuSwitch(
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  menu: 'blockCode' | 'blockFormula'
): 'on' | 'off' | 'disabled' {
  if (!state.cursorCoordinate) return 'disabled';
  if (blockPosition) {
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || blockNode.type !== menu) return 'disabled';
    return 'on';
  }

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const rangeNodes = lineNodes.slice(firstLineIndex, lastLineIndex + 1);
  if (rangeNodes.every((node) => !isBlockNode(node) && isPureLineNode(node))) return 'off';
  return 'disabled';
}

export function handleOnBlockMenuClick(
  text: string,
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  props: MenuHandler<CodeMenuProps | FormulaMenuProps>,
  menuSwitch: 'on' | 'off' | 'disabled',
  meta: string
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!cursorCoordinate || menuSwitch === 'disabled') return [text, state];

  const lines = text.split('\n');
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  if (menuSwitch === 'off' && firstLineIndex === lastLineIndex && !lines[firstLineIndex]) {
    const contentText = props.blockLabel;
    const insertedText = [meta, contentText, meta].join('\n');
    const [newText, newState] = insertText(text, state, insertedText, insertedText.length - meta.length - 1);
    if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

    const fixed = { ...newState.cursorCoordinate, charIndex: newState.cursorCoordinate.charIndex - contentText.length };
    const free = newState.cursorCoordinate;
    return [newText, { ...newState, textSelection: { fixed, free } }];
  }

  if (menuSwitch === 'off') {
    const contentTextLines = lines.slice(firstLineIndex, lastLineIndex + 1);
    const insertedText = [meta, ...contentTextLines, meta].join('\n');
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

  if (!blockPosition) return [text, state];
  const blockNode = nodes[blockPosition.blockIndex];
  if (!isBlockNode(blockNode)) return [text, state];

  if (allInRange(blockNode, [firstLineIndex, lastLineIndex])) {
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

  const bodyTopIndex = blockNode.range[0] + 1;
  const topMeta = Array(blockNode.facingMeta.indentDepth + 1).join(' ') + meta + '\n';

  const bodyBottomIndex = blockNode.range[1] - (blockNode.trailingMeta ? 1 : 0);
  const bottomMeta = '\n' + Array(blockNode.facingMeta.indentDepth + 1).join(' ') + meta;

  if (firstLineIndex > bodyTopIndex && lastLineIndex < bodyBottomIndex) {
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

  if (firstLineIndex > bodyTopIndex) {
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

  if (lastLineIndex < bodyBottomIndex) {
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

  return [text, state];
}

function allInRange(blockNode: BlockNode, [firstLineIndex, lastLineIndex]: [number, number]): boolean {
  const [top, bottom] = blockNode.range;
  if (firstLineIndex === top && lastLineIndex === top) return true;
  if (!!blockNode.trailingMeta && firstLineIndex === bottom && lastLineIndex === bottom) return true;
  const topIndexes = [top, top + 1];
  const bottomIndexes = blockNode.trailingMeta ? [bottom, bottom - 1] : [bottom];
  return topIndexes.includes(firstLineIndex) && bottomIndexes.includes(lastLineIndex);
}
