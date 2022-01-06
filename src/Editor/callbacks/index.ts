import { coordinatesAreEqual } from '../../Cursor/utils';
import { getWordSelection, getLineSelection, getSelectionText } from '../../Selection/utils';
import { isMacOS } from '../../common/utils';
import { parserConstants } from '../../parser/constants';
import { Props, State } from '../types';

import { shortcutCommand } from './shortcutCommands';
import {
  handleOnShortcut,
  handleOnForwardDelete,
  handleOnBackwardDelete,
  handleOnMoveUp,
  handleOnMoveDown,
  handleOnMoveLeft,
  handleOnMoveRight,
  handleOnMoveWordTop,
  handleOnMoveWordBottom,
  handleOnMoveLineTop,
  handleOnMoveLineBottom,
  handleOnMoveTextTop,
  handleOnMoveTextBottom,
} from './shortcutHandlers';
import {
  updateSelectionByCursor,
  insertText,
  showSuggestion,
  showIMEBasedSuggestion,
  insertSuggestion,
  resetSuggestion,
  positionToCursorCoordinate,
} from './utils';

export function handleOnMouseDown(
  text: string,
  state: State,
  event: React.MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, position, element);
  const newState = resetSuggestion({
    ...state,
    cursorCoordinate,
    textSelection: undefined,
    selectionMouse: 'fired',
  });
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
  const newTextSelection = updateSelectionByCursor(textSelection, cursorCoordinate, newCursorCoordinate);
  return [text, { ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection, selectionMouse }];
}

export function handleOnMouseUp(
  text: string,
  state: State,
  event: MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!state.cursorCoordinate || state.selectionMouse === 'deactive' || !element) return [text, state];
  if (!['active-in', 'active-up', 'active-down'].includes(state.selectionMouse)) {
    return [text, { ...state, selectionMouse: 'deactive' }];
  }

  const { cursorCoordinate, textSelection } = state;
  const position: [number, number] = [event.clientX, event.clientY];
  const newCursorCoordinate = positionToCursorCoordinate(text, position, element);
  const newTextSelection = updateSelectionByCursor(textSelection, cursorCoordinate, newCursorCoordinate);
  return [
    text,
    { ...state, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection, selectionMouse: 'deactive' },
  ];
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

export function handleOnKeyDown(
  text: string,
  props: Props,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const command = shortcutCommand(event);
  if (!state.cursorCoordinate || state.isComposing || (event.key.length === 1 && !command)) return [text, state];

  event.preventDefault();

  switch (event.key) {
    case 'Tab': {
      return insertText(text, state, '\t');
    }
    case 'Enter': {
      if (state.suggestionType !== 'none') {
        return insertSuggestion(text, state, state.suggestions[state.suggestionIndex], state.suggestionStart);
      }
      const [newText, newState] = insertText(text, state, '\n');
      if (!newState.cursorCoordinate) return [newText, newState];

      const lines = newText.split('\n');
      const newPrevLine = lines[newState.cursorCoordinate.lineIndex - 1];

      const groups = newPrevLine.match(parserConstants.common.quotation)?.groups;
      if (groups) return insertText(newText, newState, groups.indent + groups.meta);

      if (!props.syntax || props.syntax === 'bracket') {
        // bracket syntax
        const groups = newPrevLine.match(parserConstants.bracketSyntax.itemization)?.groups;
        if (groups) return insertText(newText, newState, groups.indent + groups.bullet);
      } else {
        // markdown syntax
        const groups = newPrevLine.match(parserConstants.markdownSyntax.itemization)?.groups;
        if (groups) return insertText(newText, newState, groups.indent + groups.bullet);
      }

      return [newText, newState];
    }
    case 'Backspace': {
      return handleOnBackwardDelete(text, state, event);
    }
    case 'Delete': {
      return handleOnForwardDelete(text, state, event);
    }
    case 'ArrowUp': {
      if (state.suggestions.length > 0) {
        const suggestionIndex = Math.max(state.suggestionIndex - 1, 0);
        return [text, { ...state, suggestionIndex: suggestionIndex }];
      }
      if (isMacOS() && event.metaKey && !event.ctrlKey && !event.altKey) {
        return handleOnMoveTextTop(text, state, event);
      }
      return handleOnMoveUp(text, state, event);
    }
    case 'ArrowDown': {
      if (state.suggestions.length > 0) {
        const suggestionIndex = Math.min(state.suggestionIndex + 1, state.suggestions.length - 1);
        return [text, { ...state, suggestionIndex: suggestionIndex }];
      }
      if (isMacOS() && event.metaKey && !event.ctrlKey && !event.altKey) {
        return handleOnMoveTextBottom(text, state, event);
      }
      return handleOnMoveDown(text, state, event);
    }
    case 'ArrowLeft': {
      if (isMacOS() && event.metaKey && !event.ctrlKey && !event.altKey) {
        return handleOnMoveLineTop(text, state, event);
      }
      if ((!isMacOS() ? event.ctrlKey && !event.altKey : event.altKey && !event.ctrlKey) && !event.metaKey) {
        return handleOnMoveWordTop(text, state, event);
      }
      return handleOnMoveLeft(text, state, event);
    }
    case 'ArrowRight': {
      if (isMacOS() && event.metaKey && !event.ctrlKey && !event.altKey) {
        return handleOnMoveLineBottom(text, state, event);
      }
      if ((!isMacOS() ? event.ctrlKey && !event.altKey : event.altKey && !event.ctrlKey) && !event.metaKey) {
        return handleOnMoveWordBottom(text, state, event);
      }
      return handleOnMoveRight(text, state, event);
    }
    case 'Home': {
      if ((!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) && !event.altKey) {
        return handleOnMoveTextTop(text, state, event);
      }
      return handleOnMoveLineTop(text, state, event);
    }
    case 'End': {
      if ((!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) && !event.altKey) {
        return handleOnMoveTextBottom(text, state, event);
      }
      return handleOnMoveLineBottom(text, state, event);
    }
    case 'Escape': {
      if (state.suggestionType === 'none') return [text, state];
      return [text, resetSuggestion(state)];
    }
    default:
      return handleOnShortcut(command, text, state, event);
  }
}

export function handleOnTextChange(
  text: string,
  props: Props,
  state: State,
  event: React.ChangeEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const textAreaValue = event.target.value;
  if (state.isComposing) return [text, resetSuggestion({ ...state, textAreaValue })];

  const selectionText = getSelectionText(text, state.textSelection);

  const [newText, newState] = (() => {
    switch (textAreaValue) {
      case '[':
        return insertText(text, state, `[${selectionText}]`, selectionText.length + 1);
      case '{':
        return insertText(text, state, `{${selectionText}}`, selectionText.length + 1);
      case '(':
        return insertText(text, state, `(${selectionText})`, selectionText.length + 1);
      default:
        return insertText(text, state, textAreaValue);
    }
  })();
  return showSuggestion(newText, props, newState);
}

export function handleOnTextCompositionStart(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || state.isComposing) return [text, state];
  return [text, resetSuggestion({ ...state, isComposing: true })];
}

export function handleOnTextCompositionEnd(
  text: string,
  props: Props,
  state: State,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.isComposing) return [text, state];
  const [newText, newState] = insertText(text, state, event.data);
  return showIMEBasedSuggestion(newText, props, { ...newState, textAreaValue: '', isComposing: false }, event.data);
}

export function handleOnTextCut(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state];
  event.preventDefault();
  const selectedText = getSelectionText(text, state.textSelection);
  event.clipboardData.setData('text/plain', selectedText);
  return insertText(text, state, '');
}

export function handleOnTextCopy(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state];
  event.preventDefault();
  const selectedText = getSelectionText(text, state.textSelection);
  event.clipboardData.setData('text/plain', selectedText);
  return [text, state];
}

export function handleOnTextPaste(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  event.preventDefault();
  const textToPaste = event.clipboardData.getData('text');
  return insertText(text, state, textToPaste);
}

export function handleOnSuggectionMouseDown(
  text: string,
  state: State,
  event: React.MouseEvent<HTMLLIElement>
): [string, State] {
  event.preventDefault();
  event.stopPropagation();

  const suggestion = event.currentTarget.textContent;
  if (!suggestion) return [text, state];
  return insertSuggestion(text, state, suggestion, state.suggestionStart);
}
