import { EditorState } from '../../../contexts/EditorStateContext';
import { getWordSelection, getLineSelection } from '../../molecules/selection/Selection/utils';
import { positionToCursorCoordinate } from '../EditorTextFieldBody/common/cursor';
import { resetSuggestion } from '../EditorTextFieldBody/common/suggestion';

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
      return { ...state, cursorSelection };
    }
    case 3: {
      // triple click
      const cursorSelection = getLineSelection(text, cursorCoordinate);
      return { ...state, cursorSelection };
    }
    default:
      return state;
  }
}
