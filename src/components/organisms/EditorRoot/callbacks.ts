import { EditorState } from '../../../contexts/EditorStateContext';
import { coordinatesAreEqual } from '../../molecules/cursor/Cursor/utils';
import { positionToCursorCoordinate } from '../EditorTextFieldBody/common/cursor';
import { updateSelectionAfterCursorMove } from '../EditorTextFieldBody/common/selection';
import { handleOnMoveDown, handleOnMoveUp } from '../EditorTextFieldBody/shortcuts/callbacks';

export function handleOnMouseMove(
  text: string,
  lineIdToIndex: Map<string, number>,
  state: EditorState,
  event: MouseEvent,
  element: HTMLElement | null
): EditorState {
  if (!state.cursorCoordinate || state.cursorScroll === 'none' || !element) return state;

  const elementRect = element.getBoundingClientRect();

  let cursorScroll: 'pause' | 'up' | 'down' = 'pause';
  if (event.clientY < elementRect.top) {
    cursorScroll = 'up';
  } else if (event.clientY > elementRect.bottom) {
    cursorScroll = 'down';
  }

  if (state.cursorScroll === 'fired') return { ...state, cursorScroll };

  const { cursorCoordinate, cursorSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, lineIdToIndex, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return { ...state, cursorScroll };
  }
  const newCursorSelection = updateSelectionAfterCursorMove(cursorSelection, cursorCoordinate, newCursorCoordinate);
  return { ...state, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection, cursorScroll };
}

export function handleOnMouseUp(
  text: string,
  lineIdToIndex: Map<string, number>,
  state: EditorState,
  event: MouseEvent,
  element: HTMLElement | null
): EditorState {
  if (!state.cursorCoordinate || state.cursorScroll === 'none' || !element) return state;

  const cursorScroll = 'none';
  if (!['pause', 'up', 'down'].includes(state.cursorScroll)) return { ...state, cursorScroll: cursorScroll };

  const { cursorCoordinate, cursorSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, lineIdToIndex, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return { ...state, cursorScroll: cursorScroll };
  }
  const newCursorSelection = updateSelectionAfterCursorMove(cursorSelection, cursorCoordinate, newCursorCoordinate);
  return { ...state, cursorCoordinate: newCursorCoordinate, cursorSelection: newCursorSelection, cursorScroll };
}

export function handleOnMouseScrollUp(text: string, state: EditorState): EditorState {
  const [, newState] = handleOnMoveUp(text, state, undefined, true);
  return newState;
}

export function handleOnMouseScrollDown(text: string, state: EditorState): EditorState {
  const [, newState] = handleOnMoveDown(text, state, undefined, true);
  return newState;
}
