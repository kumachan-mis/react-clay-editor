import { parserConstants } from '../../../../parser/constants';
import { moveCursor, cursorCoordinateToTextIndex } from '../../../molecules/cursor/Cursor/utils';
import { getSelectionText } from '../../../molecules/selection/Selection/utils';
import { resetTextSelection, updateSelectionAfterCursorMove } from '../common/selection';
import { resetSuggestion } from '../common/suggestion';
import { insertText } from '../common/text';
import { State } from '../types';

import { ShortcutCommand } from './types';

export function handleOnShortcut(
  command: ShortcutCommand | undefined,
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  switch (command) {
    case 'forwardDelete':
      return handleOnForwardDelete(text, state, event);
    case 'selectAll':
      return handleOnSelectAll(text, state, event);
    case 'undo':
      return handleOnUndo(text, state, event);
    case 'redo':
      return handleOnRedo(text, state, event);
    case 'moveUp':
      return handleOnMoveUp(text, state, event);
    case 'moveDown':
      return handleOnMoveDown(text, state, event);
    case 'moveLeft':
      return handleOnMoveLeft(text, state, event);
    case 'moveRight':
      return handleOnMoveRight(text, state, event);
    case 'moveLineTop':
      return handleOnMoveLineTop(text, state, event);
    case 'moveLineBottom':
      return handleOnMoveLineBottom(text, state, event);
    default:
      return [text, state];

    // any shortcut commands with a-z are not defined for the following functions
    // - backwardDelete
    // - moveWordTop
    // - moveWordBottom
    // - moveTextTop
    // - moveTextBottom
  }
}

export function handleOnForwardDelete(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  if (state.textSelection) return insertText(text, state, '');

  const current = state.cursorCoordinate;
  const forward = moveCursor(text, current, 1);
  const [newText, newState] = insertText(text, { ...state, textSelection: { fixed: current, free: forward } }, '');
  return [newText, resetSuggestion(newState)];
}

export function handleOnBackwardDelete(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  if (state.textSelection) return insertText(text, state, '');

  const current = state.cursorCoordinate;
  const backward = moveCursor(text, current, -1);
  const forward = moveCursor(text, current, 1);
  const neighborText = getSelectionText(text, { fixed: backward, free: forward });
  switch (neighborText) {
    case '[]':
    case '{}':
    case '()': {
      const [newText, newState] = insertText(text, { ...state, textSelection: { fixed: backward, free: forward } }, '');
      return [newText, resetSuggestion(newState)];
    }
    default: {
      const [newText, newState] = insertText(text, { ...state, textSelection: { fixed: backward, free: current } }, '');
      return [newText, resetSuggestion(newState)];
    }
  }
}

export function handleOnSelectAll(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  const lines = text.split('\n');
  const textSelection = {
    fixed: { lineIndex: 0, charIndex: 0 },
    free: { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length },
  };
  return [text, resetSuggestion({ ...state, textSelection })];
}

export function handleOnUndo(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead === -1 || state.textAreaValue !== '') return [text, state];

  const action = editActionHistory[historyHead];
  switch (action.actionType) {
    case 'replace': {
      const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const endIndex = startIndex + action.insertedText.length;
      const newText = text.substring(0, startIndex) + action.deletedText + text.substring(endIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: moveCursor(newText, action.coordinate, action.deletedText.length),
        historyHead: historyHead - 1,
      });
      return [newText, newState];
    }
    case 'insert': {
      const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const endIndex = startIndex + action.text.length;
      const newText = text.substring(0, startIndex) + text.substring(endIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: action.coordinate,
        historyHead: historyHead - 1,
      });
      return [newText, newState];
    }
    case 'delete': {
      const insertIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const newText = text.substring(0, insertIndex) + action.text + text.substring(insertIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: moveCursor(newText, action.coordinate, action.text.length),
        historyHead: historyHead - 1,
      });
      return [newText, newState];
    }
  }
}

export function handleOnRedo(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead === editActionHistory.length - 1 || state.textAreaValue !== '') {
    return [text, state];
  }

  const action = editActionHistory[historyHead + 1];
  switch (action.actionType) {
    case 'replace': {
      const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const endIndex = startIndex + action.deletedText.length;
      const newText = text.substring(0, startIndex) + action.insertedText + text.substring(endIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: moveCursor(newText, action.coordinate, action.insertedText.length),
        historyHead: historyHead + 1,
      });
      return [newText, newState];
    }
    case 'insert': {
      const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const newText = text.substring(0, startIndex) + action.text + text.substring(startIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: moveCursor(newText, action.coordinate, action.text.length),
        historyHead: historyHead + 1,
      });
      return [newText, newState];
    }
    case 'delete': {
      const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
      const endIndex = startIndex + action.text.length;
      const newText = text.substring(0, startIndex) + text.substring(endIndex);
      const newState = resetTextSelectionAndSuggestion({
        ...state,
        cursorCoordinate: action.coordinate,
        historyHead: historyHead + 1,
      });
      return [newText, newState];
    }
  }
}

export function handleOnMoveUp(
  text: string,
  state: State,
  event?: React.KeyboardEvent<HTMLTextAreaElement>,
  mouseScroll?: boolean
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = (() => {
    if (cursorCoordinate.lineIndex === 0) return { lineIndex: 0, charIndex: 0 };
    const lines = text.split('\n');
    const prevLineIndex = cursorCoordinate.lineIndex - 1;
    if (cursorCoordinate.charIndex > lines[prevLineIndex].length) {
      return { lineIndex: prevLineIndex, charIndex: lines[prevLineIndex].length };
    }
    return { lineIndex: prevLineIndex, charIndex: cursorCoordinate.charIndex };
  })();

  const disabled = !event?.shiftKey && !mouseScroll;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveDown(
  text: string,
  state: State,
  event?: React.KeyboardEvent<HTMLTextAreaElement>,
  mouseScroll?: boolean
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = (() => {
    const lines = text.split('\n');
    if (cursorCoordinate.lineIndex === lines.length - 1) {
      return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
    }
    const nextLineIndex = cursorCoordinate.lineIndex + 1;
    if (cursorCoordinate.charIndex > lines[nextLineIndex].length) {
      return { lineIndex: nextLineIndex, charIndex: lines[nextLineIndex].length };
    }
    return { lineIndex: nextLineIndex, charIndex: cursorCoordinate.charIndex };
  })();

  const disabled = !event?.shiftKey && !mouseScroll;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveLeft(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = moveCursor(text, cursorCoordinate, -1);

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveRight(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = moveCursor(text, cursorCoordinate, 1);

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveWordTop(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = (() => {
    const wordRegex = new RegExp(parserConstants.wordRegex, 'g');
    const lines = text.split('\n');
    const currentLine = lines[cursorCoordinate.lineIndex];
    let charIndex: number | undefined = undefined;
    let match: RegExpExecArray | null = null;
    while ((match = wordRegex.exec(currentLine))) {
      if (!match) break;
      const candidateIndex = wordRegex.lastIndex - match[0].length;
      if (candidateIndex >= cursorCoordinate.charIndex) break;
      charIndex = candidateIndex;
    }
    return { lineIndex: cursorCoordinate.lineIndex, charIndex: charIndex || 0 };
  })();

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveWordBottom(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = (() => {
    const wordRegex = new RegExp(parserConstants.wordRegex, 'g');
    const lines = text.split('\n');
    const currentLine = lines[cursorCoordinate.lineIndex];
    let match: RegExpExecArray | null = null;
    while ((match = wordRegex.exec(currentLine))) {
      if (!match) break;
      const candidateIndex = wordRegex.lastIndex;
      if (candidateIndex > cursorCoordinate.charIndex) {
        return { lineIndex: cursorCoordinate.lineIndex, charIndex: candidateIndex };
      }
    }
    return { lineIndex: cursorCoordinate.lineIndex, charIndex: currentLine.length };
  })();

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveLineTop(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 };

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveLineBottom(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const lines = text.split('\n');
  const newCursorCoordinate = {
    lineIndex: cursorCoordinate.lineIndex,
    charIndex: lines[cursorCoordinate.lineIndex].length,
  };

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveTextTop(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const newCursorCoordinate = { lineIndex: 0, charIndex: 0 };

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

export function handleOnMoveTextBottom(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const { cursorCoordinate, textSelection } = state;

  const lines = text.split('\n');
  const newCursorCoordinate = { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };

  const disabled = !event?.shiftKey;
  const newTextSelection = updateSelectionAfterCursorMove(
    textSelection,
    cursorCoordinate,
    newCursorCoordinate,
    disabled
  );
  return [text, resetSuggestion({ ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection })];
}

function resetTextSelectionAndSuggestion(state: State): State {
  return resetSuggestion(resetTextSelection(state));
}
