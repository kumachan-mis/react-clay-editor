import { coordinatesAreEqual } from '../../../molecules/cursor/Cursor/utils';
import { getWordSelection, getLineSelection } from '../../../molecules/selection/Selection/utils';
import { positionToCursorCoordinate } from '../common/cursor';
import { updateSelectionAfterCursorMove } from '../common/selection';
import { resetSuggestion } from '../common/suggestion';
import { handleOnMoveUp, handleOnMoveDown } from '../shortcuts/callbacks';
import { State } from '../types';

export function handleOnMouseDown(
  text: string,
  state: State,
  event: React.MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, position, element);
  const newState = resetSuggestion({ ...state, cursorCoordinate, textSelection: undefined, selectionMouse: 'fired' });
  return [text, newState];
}

export function handleOnMouseMove(
  text: string,
  state: State,
  event: MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!state.cursorCoordinate || state.selectionMouse === 'deactive' || !element) return [text, state];

  const elementRect = element.getBoundingClientRect();
  let selectionMouse: 'active-in' | 'active-up' | 'active-down' = 'active-in';
  if (event.clientY < elementRect.top) selectionMouse = 'active-up';
  else if (event.clientY > elementRect.bottom) selectionMouse = 'active-down';

  if (state.selectionMouse === 'fired') return [text, { ...state, selectionMouse }];

  const { cursorCoordinate, textSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return [text, { ...state, selectionMouse }];
  }
  const newTextSelection = updateSelectionAfterCursorMove(textSelection, cursorCoordinate, newCursorCoordinate);
  return [text, { ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection, selectionMouse }];
}

export function handleOnMouseUp(
  text: string,
  state: State,
  event: MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!state.cursorCoordinate || state.selectionMouse === 'deactive' || !element) return [text, state];

  const selectionMouse = 'deactive';
  if (!['active-in', 'active-up', 'active-down'].includes(state.selectionMouse)) {
    return [text, { ...state, selectionMouse }];
  }

  const { cursorCoordinate, textSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, element);
  if (!newCursorCoordinate || coordinatesAreEqual(newCursorCoordinate, cursorCoordinate)) {
    return [text, { ...state, selectionMouse }];
  }
  const newTextSelection = updateSelectionAfterCursorMove(textSelection, cursorCoordinate, newCursorCoordinate);
  return [text, { ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection, selectionMouse }];
}

export function handleOnClick(
  text: string,
  state: State,
  event: React.MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, position, element);
  switch (event.detail) {
    case 2: {
      // double click
      const textSelection = getWordSelection(text, cursorCoordinate);
      return [text, { ...state, textSelection }];
    }
    case 3: {
      // triple click
      const textSelection = getLineSelection(text, cursorCoordinate);
      return [text, { ...state, textSelection }];
    }
    default:
      return [text, state];
  }
}

export function handleOnMouseScrollUp(text: string, state: State): State {
  const [, newState] = handleOnMoveUp(text, state, undefined, true);
  return newState;
}

export function handleOnMouseScrollDown(text: string, state: State): State {
  const [, newState] = handleOnMoveDown(text, state, undefined, true);
  return newState;
}
