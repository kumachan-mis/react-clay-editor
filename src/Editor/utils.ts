import { Props, State, EditAction, ShortcutCommand } from './types';
import { EditorConstants } from './constants';

import { moveCursor, cursorCoordinateToTextIndex, coordinatesAreEqual } from '../Cursor/utils';
import {
  getWordSelection,
  getLineSelection,
  getSelectedText,
  selectionToRange,
} from '../Selection/utils';
import { CursorCoordinate } from '../Cursor/types';
import { TextLinesConstants } from '../TextLines/constants';
import { classNameToSelector, isMacOS } from '../common';

export function getRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div${classNameToSelector(EditorConstants.root.className)}`);
}

export function getEditor(element: HTMLElement): HTMLElement | null {
  return element.closest(`div${classNameToSelector(EditorConstants.editor.className)}`);
}

export function handleOnMouseDown(
  text: string,
  state: State,
  event: React.MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
  const newState: State = {
    ...state,
    cursorCoordinate,
    textSelection: undefined,
    selectionWithMouse: 'fired',
    suggestionType: 'none',
    suggestions: [],
    suggestionIndex: -1,
  };
  return [text, newState];
}

export function handleOnMouseMove(
  text: string,
  state: State,
  event: MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!state.cursorCoordinate || state.selectionWithMouse == 'inactive' || !element) {
    return [text, state];
  }
  if (state.selectionWithMouse == 'fired') {
    return [text, { ...state, selectionWithMouse: 'active' }];
  }

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
  if (!cursorCoordinate || coordinatesAreEqual(cursorCoordinate, state.cursorCoordinate)) {
    return [text, state];
  }
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = { ...cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [text, { ...state, cursorCoordinate, textSelection }];
}

export function handleOnMouseUp(
  text: string,
  state: State,
  event: MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!state.cursorCoordinate || state.selectionWithMouse == 'inactive' || !element) {
    return [text, state];
  }
  if (state.selectionWithMouse != 'active') {
    return [text, { ...state, selectionWithMouse: 'inactive' }];
  }

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = cursorCoordinate ? cursorCoordinate : { ...state.cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [text, { ...state, cursorCoordinate, textSelection, selectionWithMouse: 'inactive' }];
}

export function handleOnClick(
  text: string,
  state: State,
  event: React.MouseEvent,
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const position: [number, number] = [event.clientX, event.clientY];
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
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

export function handleOnKeyDown(
  text: string,
  props: Props,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const command = shortcutCommand(event);
  if (!state.cursorCoordinate || state.isComposing || (event.key.length == 1 && !command)) {
    return [text, state];
  }

  event.preventDefault();
  event.nativeEvent.stopImmediatePropagation();

  switch (event.key) {
    case 'Tab': {
      return insertText(text, state, '\t');
    }
    case 'Enter': {
      if (state.suggestionType != 'none') {
        return insertSuggestion(text, state, state.suggestions[state.suggestionIndex]);
      }
      const [newText, newState] = insertText(text, state, '\n');
      if (!newState.cursorCoordinate) return [newText, newState];

      const newPrevLine = newText.split('\n')[newState.cursorCoordinate.lineIndex - 1];
      const { indent } = newPrevLine.match(TextLinesConstants.regexes.itemization)
        ?.groups as Record<string, string>;
      return insertText(newText, newState, indent);
    }
    case 'Backspace': {
      if (state.textSelection) return insertText(text, state, '');

      const [newText, newState] = (() => {
        const free = moveCursor(text, state.cursorCoordinate, -1);
        const fixed = moveCursor(text, state.cursorCoordinate, 1);
        const textMayDelete = getSelectedText(text, { fixed, free });
        switch (textMayDelete) {
          case '[]':
          case '{}':
          case '()': {
            const textSelection = { fixed, free };
            return insertText(text, { ...state, textSelection }, '');
          }
          default: {
            const textSelection = { fixed: state.cursorCoordinate, free };
            return insertText(text, { ...state, textSelection }, '');
          }
        }
      })();

      return showSuggestion(newText, props, newState);
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
      if (
        (!isMacOS() ? event.ctrlKey && !event.altKey : event.altKey && !event.ctrlKey) &&
        !event.metaKey
      ) {
        return handleOnMoveWordTop(text, state, event);
      }
      const [newText, newState] = handleOnMoveLeft(text, state, event);
      return showSuggestion(newText, props, newState);
    }
    case 'ArrowRight': {
      if (isMacOS() && event.metaKey && !event.ctrlKey && !event.altKey) {
        return handleOnMoveLineBottom(text, state, event);
      }
      if (
        (!isMacOS() ? event.ctrlKey && !event.altKey : event.altKey && !event.ctrlKey) &&
        !event.metaKey
      ) {
        return handleOnMoveWordBottom(text, state, event);
      }
      const [newText, newState] = handleOnMoveRight(text, state, event);
      return showSuggestion(newText, props, newState);
    }
    case 'Home': {
      if (
        (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
        !event.altKey
      ) {
        return handleOnMoveTextTop(text, state, event);
      }
      return handleOnMoveLineTop(text, state, event);
    }
    case 'End': {
      if (
        (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
        !event.altKey
      ) {
        return handleOnMoveTextBottom(text, state, event);
      }
      return handleOnMoveLineBottom(text, state, event);
    }
    case 'Escape': {
      if (state.suggestionType == 'none') return [text, state];
      return [text, { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1 }];
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
  if (state.isComposing) {
    return [
      text,
      { ...state, textAreaValue, suggestionType: 'none', suggestions: [], suggestionIndex: -1 },
    ];
  }

  const [newText, newState] = (() => {
    switch (textAreaValue) {
      case '[': {
        const textIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
        return textIndex == text.length || text[textIndex].match(/^\s$/)
          ? insertText(text, state, '[]', 1)
          : insertText(text, state, '[');
      }
      case '{': {
        const textIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
        return textIndex == text.length || text[textIndex].match(/^\s$/)
          ? insertText(text, state, '{}', 1)
          : insertText(text, state, '{');
      }
      case '(': {
        const textIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
        return textIndex == text.length || text[textIndex].match(/^\s$/)
          ? insertText(text, state, '()', 1)
          : insertText(text, state, '(');
      }
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
  return [
    text,
    { ...state, isComposing: true, suggestionType: 'none', suggestions: [], suggestionIndex: -1 },
  ];
}

export function handleOnTextCompositionEnd(
  text: string,
  state: State,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.isComposing) return [text, state];
  const [newText, newState] = insertText(text, state, event.data);
  return [newText, { ...newState, textAreaValue: '', isComposing: false }];
}

export function handleOnTextCut(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state];
  event.preventDefault();
  const selectedText = getSelectedText(text, state.textSelection);
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
  const selectedText = getSelectedText(text, state.textSelection);
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
  event.nativeEvent.stopImmediatePropagation();

  const suggestion = event.currentTarget.textContent;
  if (!suggestion) return [text, state];
  return insertSuggestion(text, state, suggestion);
}

function insertText(
  text: string,
  state: State,
  insertedText: string,
  cursourMoveAmount = insertedText.length
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  if (!state.textSelection) {
    const insertIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
    const newText = text.substring(0, insertIndex) + insertedText + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, state.cursorCoordinate, cursourMoveAmount);
    const newState = addEditActions(state, [
      { actionType: 'insert', coordinate: state.cursorCoordinate, text: insertedText },
    ]);
    return [newText, { ...newState, cursorCoordinate, textSelection: undefined }];
  }

  const { start, end } = selectionToRange(state.textSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  const deletedText = text.substring(startIndex, endIndex);
  const newText = text.substring(0, startIndex) + insertedText + text.substring(endIndex);
  const cursorCoordinate = moveCursor(newText, start, cursourMoveAmount);
  const newState = addEditActions(state, [
    { actionType: 'delete', coordinate: start, text: deletedText },
    { actionType: 'insert', coordinate: start, text: insertedText },
  ]);
  return [newText, { ...newState, cursorCoordinate, textSelection: undefined }];
}

function showSuggestion(text: string, props: Props, state: State): [string, State] {
  if (!state.cursorCoordinate) {
    return [text, { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1 }];
  }

  const { lineIndex, charIndex } = state.cursorCoordinate;
  const currentLine = text.split('\n')[lineIndex];
  switch (currentLine[charIndex - 1]) {
    case '[': {
      const suggestions = props.bracketLinkProps?.suggestions;
      const suggestionIndex = props.bracketLinkProps?.initialSuggestionIndex || 0;
      const suggestionState: Pick<State, 'suggestionType' | 'suggestions' | 'suggestionIndex'> =
        suggestions && suggestions.length > 0 && !props.bracketLinkProps?.disabled
          ? { suggestionType: 'bracketLink', suggestions, suggestionIndex }
          : { suggestionType: 'none', suggestions: [], suggestionIndex: -1 };
      return [text, { ...state, ...suggestionState }];
    }
    case '#': {
      const suggestions = props.hashTagProps?.suggestions;
      const suggestionIndex = props.hashTagProps?.initialSuggestionIndex || 0;
      const suggestionState: Pick<State, 'suggestionType' | 'suggestions' | 'suggestionIndex'> =
        suggestions && suggestions.length > 0 && !props.hashTagProps?.disabled
          ? { suggestionType: 'hashTag', suggestions, suggestionIndex }
          : { suggestionType: 'none', suggestions: [], suggestionIndex: -1 };
      return [text, { ...state, ...suggestionState }];
    }
    case ':': {
      if (!props.taggedLinkPropsMap) {
        return [text, { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1 }];
      }

      const tagName = (() => {
        for (const tagName of Object.keys(props.taggedLinkPropsMap)) {
          const pattern = `[${tagName}:`;
          const target = currentLine.substring(Math.max(charIndex - pattern.length, 0), charIndex);
          if (target == pattern) return tagName;
        }
        return undefined;
      })();
      const taggedLinkProps = tagName ? props.taggedLinkPropsMap[tagName] : undefined;

      const suggestions = taggedLinkProps?.suggestions;
      const suggestionIndex = taggedLinkProps?.initialSuggestionIndex || 0;
      const suggestionState: Pick<State, 'suggestionType' | 'suggestions' | 'suggestionIndex'> =
        suggestions && suggestions.length > 0
          ? { suggestionType: 'taggedLink', suggestions, suggestionIndex }
          : { suggestionType: 'none', suggestions: [], suggestionIndex: -1 };
      return [text, { ...state, ...suggestionState }];
    }
    default:
      return [text, { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1 }];
  }
}

function insertSuggestion(text: string, state: State, suggestion: string): [string, State] {
  const [newText, newState] = ((): [string, State] => {
    switch (state.suggestionType) {
      case 'bracketLink':
        return insertText(text, state, suggestion);
      case 'hashTag':
        return insertText(text, state, `${suggestion} `);
      case 'taggedLink':
        return insertText(text, state, ` ${suggestion}`);
      case 'none':
        return [text, state];
    }
  })();
  return [newText, { ...newState, suggestionType: 'none', suggestions: [], suggestionIndex: -1 }];
}

function addEditActions(state: State, actions: EditAction[]): State {
  const validActions = actions.filter((action) => action.text != '');
  if (validActions.length == 0) return state;

  if (state.historyHead == -1) {
    return { ...state, editActionHistory: validActions, historyHead: validActions.length - 1 };
  }

  const { editActionHistory, historyHead } = state;
  const concatedHistory = [...editActionHistory.slice(0, historyHead + 1), ...validActions];
  const newHistory = concatedHistory.slice(
    Math.max(0, concatedHistory.length - EditorConstants.historyMaxLength),
    concatedHistory.length
  );
  return { ...state, editActionHistory: newHistory, historyHead: newHistory.length - 1 };
}

function positionToCursorCoordinate(
  text: string,
  state: State,
  position: [number, number],
  element: HTMLElement
): CursorCoordinate | undefined {
  type Groups = Record<string, string>;

  const [x, y] = position;
  const elements = document.elementsFromPoint(x, y);
  const charClassNameRegex = TextLinesConstants.char.classNameRegex;
  const charElement = elements.find(
    (charEl) => charClassNameRegex.test(charEl.className) && element.contains(charEl)
  );
  const charGroupClassNameRegex = TextLinesConstants.charGroup.classNameRegex;
  const charGroupElement = elements.find(
    (charGrpEl) => charGroupClassNameRegex.test(charGrpEl.className) && element.contains(charGrpEl)
  );
  const lineClassNameRegex = TextLinesConstants.line.classNameRegex;
  const lineElement = elements.find(
    (lineEl) => lineClassNameRegex.test(lineEl.className) && element.contains(lineEl)
  );

  const marginBottomClassNameRegex = TextLinesConstants.marginBottom.classNameRegex;
  const marginBottomElement = elements.find(
    (marginEl) => marginBottomClassNameRegex.test(marginEl.className) && element.contains(marginEl)
  );

  const lines = text.split('\n');
  if (charElement) {
    const groups = charElement.className.match(charClassNameRegex)?.groups as Groups;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const charIndex = Number.parseInt(groups['charIndex'], 10);
    if (charIndex == lines[lineIndex].length) return { lineIndex, charIndex };
    const charRect = charElement.getBoundingClientRect();
    if (x <= charRect.left + charRect.width / 2) {
      return { lineIndex, charIndex };
    } else {
      return { lineIndex, charIndex: charIndex + 1 };
    }
  } else if (charGroupElement) {
    const groups = charGroupElement.className.match(charGroupClassNameRegex)?.groups as Groups;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const fromCharIndex = Number.parseInt(groups['from'], 10);
    const toCharIndex = Number.parseInt(groups['to'], 10);
    const charGroupRect = charGroupElement.getBoundingClientRect();
    if (x <= charGroupRect.left + charGroupRect.width / 2) {
      return { lineIndex, charIndex: fromCharIndex };
    } else {
      return { lineIndex, charIndex: toCharIndex };
    }
  } else if (lineElement) {
    const groups = lineElement.className.match(lineClassNameRegex)?.groups as Groups;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    return { lineIndex, charIndex: lines[lineIndex].length };
  } else if (marginBottomElement) {
    return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
  } else {
    return state.cursorCoordinate;
  }
}

function shortcutCommand(
  event: React.KeyboardEvent<HTMLTextAreaElement>
): ShortcutCommand | undefined {
  if (selectAllTriggered(event)) return 'selectAll';
  if (undoTriggered(event)) return 'undo';
  if (redoTriggered(event)) return 'redo';
  if (moveUpTriggered(event)) return 'moveUp';
  if (moveDownTriggered(event)) return 'moveDown';
  if (moveLeftTriggered(event)) return 'moveLeft';
  if (moveRightTriggered(event)) return 'moveRight';
  if (moveWordTopTriggered(event)) return 'moveWordTop';
  if (moveWordBottomTriggered(event)) return 'moveWordBottom';
  if (moveLineTopTriggered(event)) return 'moveLineTop';
  if (moveLineBottomTriggered(event)) return 'moveLineBottom';
  if (moveTextTopTriggered(event)) return 'moveTextTop';
  if (moveTextBottomTriggered(event)) return 'moveTextBottom';
  return undefined;
}

function selectAllTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == 'a' &&
    !event.altKey &&
    !event.shiftKey
  );
}

function undoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == 'z' &&
    !event.altKey &&
    !event.shiftKey
  );
}

function redoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    ((event.shiftKey && event.key == 'z') || (!event.shiftKey && event.key == 'y')) &&
    !event.altKey
  );
}

function moveUpTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'p' || event.key == 'P') && !event.metaKey && !event.altKey;
}

function moveDownTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'n' || event.key == 'N') && !event.metaKey && !event.altKey;
}

function moveLeftTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'b' || event.key == 'B') && !event.metaKey && !event.altKey;
}

function moveRightTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'f' || event.key == 'F') && !event.metaKey && !event.altKey;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveWordTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveWordBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

function moveLineTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    isMacOS() &&
    event.ctrlKey &&
    (event.key == 'a' || event.key == 'A') &&
    !event.metaKey &&
    !event.altKey
  );
}

function moveLineBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    isMacOS() &&
    event.ctrlKey &&
    (event.key == 'e' || event.key == 'E') &&
    !event.metaKey &&
    !event.altKey
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTextTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTextBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

function handleOnShortcut(
  command: ShortcutCommand | undefined,
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  switch (command) {
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
    case 'moveWordTop':
      return handleOnMoveWordTop(text, state, event);
    case 'moveWordBottom':
      return handleOnMoveWordBottom(text, state, event);
    case 'moveLineTop':
      return handleOnMoveLineTop(text, state, event);
    case 'moveLineBottom':
      return handleOnMoveLineBottom(text, state, event);
    case 'moveTextTop':
      return handleOnMoveTextTop(text, state, event);
    case 'moveTextBottom':
      return handleOnMoveTextBottom(text, state, event);
    default:
      return [text, state];
  }
}

function handleOnSelectAll(
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
  return [
    text,
    { ...state, textSelection, suggestionType: 'none', suggestions: [], suggestionIndex: -1 },
  ];
}

function handleOnUndo(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead == -1 || state.textAreaValue != '') return [text, state];

  const action = editActionHistory[historyHead];
  if (action.actionType == 'insert') {
    const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
    const endIndex = startIndex + action.text.length;
    const newText = text.substring(0, startIndex) + text.substring(endIndex);
    const cursorCoordinate = action.coordinate;
    return [
      newText,
      {
        ...state,
        cursorCoordinate,
        textSelection: undefined,
        historyHead: historyHead - 1,
        suggestionType: 'none',
        suggestions: [],
        suggestionIndex: -1,
      },
    ];
  } else if (action.actionType == 'delete') {
    const insertIndex = cursorCoordinateToTextIndex(text, action.coordinate);
    const newText = text.substring(0, insertIndex) + action.text + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, action.coordinate, action.text.length);
    return [
      newText,
      {
        ...state,
        cursorCoordinate,
        textSelection: undefined,
        historyHead: historyHead - 1,
        suggestionType: 'none',
        suggestions: [],
        suggestionIndex: -1,
      },
    ];
  }
  return [text, state];
}

function handleOnRedo(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead == editActionHistory.length - 1 || state.textAreaValue != '') {
    return [text, state];
  }

  const action = editActionHistory[historyHead + 1];
  const [newText, cursorCoordinate] = ((): [string, CursorCoordinate] => {
    switch (action.actionType) {
      case 'insert': {
        const insertIndex = cursorCoordinateToTextIndex(text, action.coordinate);
        const newText = text.substring(0, insertIndex) + action.text + text.substring(insertIndex);
        const cursorCoordinate = moveCursor(newText, action.coordinate, action.text.length);
        return [newText, cursorCoordinate];
      }
      case 'delete': {
        const startIndex = cursorCoordinateToTextIndex(text, action.coordinate);
        const endIndex = startIndex + action.text.length;
        const newText = text.substring(0, startIndex) + text.substring(endIndex);
        const cursorCoordinate = action.coordinate;
        return [newText, cursorCoordinate];
      }
    }
  })();

  return [
    newText,
    {
      ...state,
      cursorCoordinate,
      textSelection: undefined,
      historyHead: historyHead + 1,
      suggestionType: 'none',
      suggestions: [],
      suggestionIndex: -1,
    },
  ];
}

function handleOnMoveUp(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const prevLine = lines[state.cursorCoordinate.lineIndex - 1];
  if (prevLine === undefined) return [text, state];

  const cursorCoordinate = {
    lineIndex: state.cursorCoordinate.lineIndex - 1,
    charIndex: Math.min(state.cursorCoordinate.charIndex, prevLine.length),
  };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveDown(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const nextLine = lines[state.cursorCoordinate.lineIndex + 1];
  if (nextLine === undefined) return [text, state];

  const cursorCoordinate = {
    lineIndex: state.cursorCoordinate.lineIndex + 1,
    charIndex: Math.min(state.cursorCoordinate.charIndex, nextLine.length),
  };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveLeft(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = moveCursor(text, state.cursorCoordinate, -1);
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveRight(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = moveCursor(text, state.cursorCoordinate, 1);
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveWordTop(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = (() => {
    const wordRegex = new RegExp(TextLinesConstants.wordRegex, 'g');
    const lines = text.split('\n');
    const currentLine = lines[state.cursorCoordinate.lineIndex];
    let charIndex: number | undefined = undefined;
    let match: RegExpExecArray | null = null;
    while ((match = wordRegex.exec(currentLine))) {
      if (match === null) break;
      const candidateIndex = wordRegex.lastIndex - match[0].length;
      if (candidateIndex >= state.cursorCoordinate.charIndex) break;
      charIndex = candidateIndex;
    }
    return { lineIndex: state.cursorCoordinate.lineIndex, charIndex: charIndex || 0 };
  })();
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveWordBottom(
  text: string,
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = (() => {
    const wordRegex = new RegExp(TextLinesConstants.wordRegex, 'g');
    const lines = text.split('\n');
    const currentLine = lines[state.cursorCoordinate.lineIndex];
    let match: RegExpExecArray | null = null;
    while ((match = wordRegex.exec(currentLine))) {
      if (match === null) break;
      const candidateIndex = wordRegex.lastIndex;
      if (candidateIndex > state.cursorCoordinate.charIndex) {
        return { lineIndex: state.cursorCoordinate.lineIndex, charIndex: candidateIndex };
      }
    }
    return { lineIndex: state.cursorCoordinate.lineIndex, charIndex: currentLine.length };
  })();
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveLineTop(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = { lineIndex: state.cursorCoordinate.lineIndex, charIndex: 0 };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveLineBottom(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const cursorCoordinate = {
    lineIndex: state.cursorCoordinate.lineIndex,
    charIndex: lines[state.cursorCoordinate.lineIndex].length,
  };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveTextTop(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const cursorCoordinate = { lineIndex: 0, charIndex: 0 };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}

function handleOnMoveTextBottom(
  text: string,
  state: State,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const cursorCoordinate = {
    lineIndex: lines.length - 1,
    charIndex: lines[lines.length - 1].length,
  };
  const textSelection = (() => {
    if (!event.shiftKey) return undefined;
    const fixed = state.textSelection ? state.textSelection.fixed : state.cursorCoordinate;
    const free = { ...cursorCoordinate };
    return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  })();
  return [text, { ...state, cursorCoordinate, textSelection }];
}
