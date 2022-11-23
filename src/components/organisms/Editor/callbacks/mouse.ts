import { coordinatesAreEqual } from '../../../molecules/cursor/Cursor/utils';
import { getWordSelection, getLineSelection } from '../../../molecules/selection/Selection/utils';
import { positionToCursorCoordinate } from '../common/cursor';
import { updateSelectionAfterCursorMove } from '../common/selection';
import { resetSuggestion } from '../common/suggestion';
import { handleOnMoveUp, handleOnMoveDown } from '../shortcuts/callbacks';
import { EditorState } from '../types';

export function handleOnMouseDown(
  text: string,
  state: EditorState,
  event: React.MouseEvent,
  element: HTMLElement | null
): EditorState {
  if (!element) return state;

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, position, element);
  const newState = resetSuggestion({ ...state, cursorCoordinate, cursorSelection: undefined, cursorScroll: 'fired' });
  return newState;
}

export function handleOnMouseMove(
  text: string,
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

  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return { ...state, cursorScroll };
  }
  const newTextSelection = updateSelectionAfterCursorMove(cursorSelection, cursorCoordinate, newCursorCoordinate);
  return { ...state, cursorCoordinate: newCursorCoordinate, cursorSelection: newTextSelection, cursorScroll };
}

export function handleOnMouseUp(
  text: string,
  state: EditorState,
  event: MouseEvent,
  element: HTMLElement | null
): EditorState {
  if (!state.cursorCoordinate || state.cursorScroll === 'none' || !element) return state;

  const cursorScroll = 'none';
  if (!['pause', 'up', 'down'].includes(state.cursorScroll)) {
    return { ...state, cursorScroll: cursorScroll };
  }

  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return { ...state, cursorScroll: cursorScroll };
  }
  const newTextSelection = updateSelectionAfterCursorMove(cursorSelection, cursorCoordinate, newCursorCoordinate);
  return { ...state, cursorCoordinate: newCursorCoordinate, cursorSelection: newTextSelection, cursorScroll };
}

export function handleOnClick(
  text: string,
  state: EditorState,
  event: React.MouseEvent,
  element: HTMLElement | null
): EditorState {
  if (!element) return state;

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, position, element);
  switch (event.detail) {
    case 2: {
      // double click
      const cursorSelection = getWordSelection(text, cursorCoordinate);
      return { ...state, cursorSelection: cursorSelection };
    }
    case 3: {
      // triple click
      const cursorSelection = getLineSelection(text, cursorCoordinate);
      return { ...state, cursorSelection: cursorSelection };
    }
    default:
      return state;
  }
}

export function handleOnMouseScrollUp(text: string, state: EditorState): EditorState {
  const [, newState] = handleOnMoveUp(text, state, undefined, true);
  return newState;
}

export function handleOnMouseScrollDown(text: string, state: EditorState): EditorState {
  const [, newState] = handleOnMoveDown(text, state, undefined, true);
  return newState;
}
