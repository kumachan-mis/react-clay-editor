import { EditorState } from '../../../../contexts/EditorStateContext';
import { EditAction } from '../../../../types/cursor/editAction';
import { cursorCoordinateToTextIndex, moveCursor } from '../../../molecules/cursor/Cursor/utils';
import { selectionToRange } from '../../../molecules/selection/Selection/utils';

import { resetCursorSelection } from './selection';

export function insertText(
  text: string,
  state: EditorState,
  insertedText: string,
  cursourMoveAmount = insertedText.length
): [string, EditorState] {
  if (!state.cursorCoordinate) return [text, state];

  if (!state.cursorSelection) {
    if (!insertedText) return [text, state];
    const insertIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
    const newText = text.substring(0, insertIndex) + insertedText + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, state.cursorCoordinate, cursourMoveAmount);
    const action: EditAction = { actionType: 'insert', coordinate: state.cursorCoordinate, text: insertedText };
    const newState = addEditAction(state, action);
    return [newText, resetCursorSelection({ ...newState, cursorCoordinate })];
  }

  const { start, end } = selectionToRange(state.cursorSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  const deletedText = text.substring(startIndex, endIndex);
  const newText = text.substring(0, startIndex) + insertedText + text.substring(endIndex);
  const cursorCoordinate = moveCursor(newText, start, cursourMoveAmount);
  let action: EditAction = { actionType: 'replace', coordinate: start, deletedText, insertedText };
  if (!insertedText) action = { actionType: 'delete', coordinate: start, text: deletedText };
  const newState = addEditAction(state, action);
  return [newText, resetCursorSelection({ ...newState, cursorCoordinate })];
}

function addEditAction(state: EditorState, action: EditAction, historyMaxLength = 50): EditorState {
  if (state.editActionHistoryHead === -1) return { ...state, editActionHistory: [action], editActionHistoryHead: 0 };

  const { editActionHistory, editActionHistoryHead } = state;

  const concatedHistory = [...editActionHistory.slice(0, editActionHistoryHead + 1), action];
  const [sliceStart, sliceEnd] = [Math.max(0, concatedHistory.length - historyMaxLength), concatedHistory.length];
  const newHistory = concatedHistory.slice(sliceStart, sliceEnd);

  return { ...state, editActionHistory: newHistory, editActionHistoryHead: newHistory.length - 1 };
}
