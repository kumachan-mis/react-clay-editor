import { Props, State, EditAction, ShortcutCommand } from "./types";
import { EditorConstants } from "./constants";

import { moveCursor, cursorCoordinateToTextIndex, coordinatesAreEqual } from "../Cursor/utils";
import { selectionToRange, getSelectedText } from "../Selection/utils";
import { parseLine } from "../TextLines/utils";
import { CursorCoordinate, SuggestionType } from "../Cursor/types";
import { SelectionWithMouse } from "../Selection/types";
import { TextLinesConstants } from "../TextLines/constants";
import { classNameToSelector, isMacOS } from "../common";

export function getRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div${classNameToSelector(EditorConstants.root.className)}`);
}

export function getEditor(element: HTMLElement): HTMLElement | null {
  return element.closest(`div${classNameToSelector(EditorConstants.editor.className)}`);
}

export function handleOnMouseDown(
  text: string,
  state: State,
  position: [number, number],
  element: HTMLElement | null
): [string, State] {
  if (!element) return [text, state];

  const newState = {
    ...state,
    cursorCoordinate: positionToCursorCoordinate(text, state, position, element),
    textSelection: undefined,
    selectionWithMouse: SelectionWithMouse.Started,
    ...EditorConstants.defaultSuggestionState,
  };
  return [text, newState];
}

export function handleOnMouseMove(
  text: string,
  state: State,
  position: [number, number],
  element: HTMLElement | null
): [string, State] {
  if (
    !state.cursorCoordinate ||
    state.selectionWithMouse == SelectionWithMouse.Inactive ||
    !element
  ) {
    return [text, state];
  }
  if (state.selectionWithMouse == SelectionWithMouse.Started) {
    return [text, { ...state, selectionWithMouse: SelectionWithMouse.Active }];
  }
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
  if (coordinatesAreEqual(cursorCoordinate, state.cursorCoordinate)) return [text, state];
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = { ...cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [text, { ...state, cursorCoordinate, textSelection }];
}

export function handleOnMouseUp(
  text: string,
  state: State,
  position: [number, number],
  element: HTMLElement | null
): [string, State] {
  if (
    !state.cursorCoordinate ||
    state.selectionWithMouse == SelectionWithMouse.Inactive ||
    !element
  ) {
    return [text, state];
  }
  if (state.selectionWithMouse != SelectionWithMouse.Active) {
    return [text, { ...state, selectionWithMouse: SelectionWithMouse.Inactive }];
  }
  const cursorCoordinate = positionToCursorCoordinate(text, state, position, element);
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = { ...cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [
    text,
    { ...state, cursorCoordinate, textSelection, selectionWithMouse: SelectionWithMouse.Inactive },
  ];
}

export const handleOnMouseLeave = handleOnMouseUp;

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

  switch (event.key) {
    case "Tab": {
      if (state.suggestionType != SuggestionType.None) {
        return [text, { ...state, ...EditorConstants.defaultSuggestionState }];
      }
      return insertText(text, state, "\t");
    }
    case "Enter": {
      if (state.suggestionType != SuggestionType.None) {
        return insertSuggestion(text, state, state.suggestions[state.suggestionIndex]);
      }
      const [newText, newState] = insertText(text, state, "\n");
      if (!newState.cursorCoordinate) return [newText, newState];

      const newLines = newText.split("\n");
      const { indent, content } = parseLine(newLines[newState.cursorCoordinate.lineIndex - 1]);
      if (indent.length == 0) {
        return [newText, newState];
      } else if (content.length > 0) {
        return insertText(newText, newState, indent);
      } else {
        const backCoordinate = moveCursor(newText, newState.cursorCoordinate, -indent.length - 1);
        const textSelection = { fixed: newState.cursorCoordinate, free: backCoordinate };
        return insertText(newText, { ...newState, textSelection }, "");
      }
    }
    case "Backspace": {
      if (state.textSelection) return insertText(text, state, "");
      const backCoordinate = moveCursor(text, state.cursorCoordinate, -1);
      const textSelection = { fixed: state.cursorCoordinate, free: backCoordinate };
      const [newText, newState] = insertText(text, { ...state, textSelection }, "");
      return showSuggestion(newText, props, newState);
    }
    case "ArrowUp": {
      if (state.suggestions.length > 0) {
        const suggestionIndex = Math.max(state.suggestionIndex - 1, 0);
        return [text, { ...state, suggestionIndex: suggestionIndex }];
      }
      const lines = text.split("\n");
      const prevLine = lines[state.cursorCoordinate.lineIndex - 1];
      if (prevLine === undefined) return [text, state];
      const cursorCoordinate = {
        lineIndex: state.cursorCoordinate.lineIndex - 1,
        charIndex: Math.min(state.cursorCoordinate.charIndex, prevLine.length),
      };
      return [text, { ...state, cursorCoordinate, textSelection: undefined }];
    }
    case "ArrowDown": {
      if (state.suggestions.length > 0) {
        const suggestionIndex = Math.min(state.suggestionIndex + 1, state.suggestions.length - 1);
        return [text, { ...state, suggestionIndex: suggestionIndex }];
      }
      const lines = text.split("\n");
      const nextLine = lines[state.cursorCoordinate.lineIndex + 1];
      if (nextLine === undefined) return [text, state];
      const cursorCoordinate = {
        lineIndex: state.cursorCoordinate.lineIndex + 1,
        charIndex: Math.min(state.cursorCoordinate.charIndex, nextLine.length),
      };
      return [text, { ...state, cursorCoordinate, textSelection: undefined }];
    }
    case "ArrowLeft": {
      const cursorCoordinate = moveCursor(text, state.cursorCoordinate, -1);
      const newState = { ...state, cursorCoordinate, textSelection: undefined };
      return showSuggestion(text, props, newState);
    }
    case "ArrowRight": {
      const cursorCoordinate = moveCursor(text, state.cursorCoordinate, 1);
      const newState = { ...state, cursorCoordinate, textSelection: undefined };
      return showSuggestion(text, props, newState);
    }
    default:
      return handleOnShortcut(text, state, command);
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
    return [text, { ...state, textAreaValue, ...EditorConstants.defaultSuggestionState }];
  }
  const [newText, newState] = insertText(text, state, textAreaValue);
  return showSuggestion(newText, props, newState);
}

export function handleOnTextCompositionStart(
  text: string,
  state: State,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || state.isComposing) return [text, state];
  return [text, { ...state, isComposing: true, ...EditorConstants.defaultSuggestionState }];
}

export function handleOnTextCompositionEnd(
  text: string,
  state: State,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.isComposing) return [text, state];
  const [newText, newState] = insertText(text, state, event.data);
  return [newText, { ...newState, textAreaValue: "", isComposing: false }];
}

export function handleOnTextCut(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state];
  event.preventDefault();
  const selectedText = getSelectedText(state.textSelection, text);
  event.clipboardData.setData("text/plain", selectedText);
  return insertText(text, state, "");
}

export function handleOnTextCopy(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state];
  event.preventDefault();
  const selectedText = getSelectedText(state.textSelection, text);
  event.clipboardData.setData("text/plain", selectedText);
  return [text, state];
}

export function handleOnTextPaste(
  text: string,
  state: State,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  event.preventDefault();
  const textToPaste = event.clipboardData.getData("text");
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
      { actionType: "insert", coordinate: state.cursorCoordinate, text: insertedText },
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
    { actionType: "delete", coordinate: start, text: deletedText },
    { actionType: "insert", coordinate: start, text: insertedText },
  ]);
  return [newText, { ...newState, cursorCoordinate, textSelection: undefined }];
}

function showSuggestion(text: string, props: Props, state: State): [string, State] {
  if (!state.cursorCoordinate) {
    return [text, { ...state, ...EditorConstants.defaultSuggestionState }];
  }

  const { lineIndex, charIndex } = state.cursorCoordinate;
  const currentLine = text.split("\n")[lineIndex];
  switch (currentLine[charIndex - 1]) {
    case "[": {
      const suggestions = props.bracketLinkProps?.suggestions;
      const suggestionIndex = props.bracketLinkProps?.initialSuggestionIndex || 0;
      const suggestionState =
        suggestions && suggestions.length > 0 && !props.bracketLinkProps?.disabled
          ? { suggestionType: SuggestionType.BracketLink, suggestions, suggestionIndex }
          : EditorConstants.defaultSuggestionState;
      return [text, { ...state, ...suggestionState }];
    }
    case "#": {
      const suggestions = props.hashTagProps?.suggestions;
      const suggestionIndex = props.hashTagProps?.initialSuggestionIndex || 0;
      const suggestionState =
        suggestions && suggestions.length > 0 && !props.hashTagProps?.disabled
          ? { suggestionType: SuggestionType.HashTag, suggestions, suggestionIndex }
          : EditorConstants.defaultSuggestionState;
      return [text, { ...state, ...suggestionState }];
    }
    case ":": {
      if (!props.taggedLinkPropsMap) {
        return [text, { ...state, ...EditorConstants.defaultSuggestionState }];
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
      const suggestionState =
        suggestions && suggestions.length > 0
          ? { suggestionType: SuggestionType.TaggedLink, suggestions, suggestionIndex }
          : EditorConstants.defaultSuggestionState;
      return [text, { ...state, ...suggestionState }];
    }
    default:
      return [text, { ...state, ...EditorConstants.defaultSuggestionState }];
  }
}

function insertSuggestion(text: string, state: State, suggestion: string): [string, State] {
  switch (state.suggestionType) {
    case SuggestionType.BracketLink: {
      const [newText, newState] = insertText(text, state, `${suggestion}]`);
      return [newText, { ...newState, ...EditorConstants.defaultSuggestionState }];
    }
    case SuggestionType.HashTag: {
      const [newText, newState] = insertText(text, state, `${suggestion} `);
      return [newText, { ...newState, ...EditorConstants.defaultSuggestionState }];
    }
    case SuggestionType.TaggedLink: {
      const [newText, newState] = insertText(text, state, ` ${suggestion}]`);
      return [newText, { ...newState, ...EditorConstants.defaultSuggestionState }];
    }
    case SuggestionType.None:
    default:
      return [text, { ...state, ...EditorConstants.defaultSuggestionState }];
  }
}

function addEditActions(state: State, actions: EditAction[]): State {
  const validActions = actions.filter((action) => action.text != "");
  if (validActions.length == 0) return state;

  if (state.historyHead == -1) {
    return { ...state, editActionHistory: validActions, historyHead: actions.length - 1 };
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
): CursorCoordinate {
  type Groups = Record<string, string>;

  const [x, y] = position;
  const elements = document.elementsFromPoint(x, y);
  const charClassNameRegex = TextLinesConstants.char.classNameRegex;
  const charElement = elements.find(
    (charEl) => charClassNameRegex.test(charEl.className) && element.contains(charEl)
  );
  const lineClassNameRegex = TextLinesConstants.line.classNameRegex;
  const lineElement = elements.find(
    (lineEl) => lineClassNameRegex.test(lineEl.className) && element.contains(lineEl)
  );
  const lines = text.split("\n");
  if (charElement) {
    const groups = charElement.className.match(charClassNameRegex)?.groups as Groups;
    const lineIndex = Number.parseInt(groups["lineIndex"], 10);
    const charIndex = Number.parseInt(groups["charIndex"], 10);
    return { lineIndex, charIndex };
  } else if (lineElement) {
    const groups = lineElement.className.match(lineClassNameRegex)?.groups as Groups;
    const lineIndex = Number.parseInt(groups["lineIndex"], 10);
    return { lineIndex, charIndex: lines[lineIndex].length };
  } else if (state.selectionWithMouse == SelectionWithMouse.Active && state.cursorCoordinate) {
    return { ...state.cursorCoordinate };
  } else {
    return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
  }
}

function shortcutCommand(
  event: React.KeyboardEvent<HTMLTextAreaElement>
): ShortcutCommand | undefined {
  if (selectAllTriggered(event)) return "selectAll";
  if (undoTriggered(event)) return "undo";
  if (redoTriggered(event)) return "redo";
  return undefined;
}

function selectAllTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == "a" &&
    !event.altKey &&
    !event.shiftKey
  );
}

function undoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == "z" &&
    !event.altKey &&
    !event.shiftKey
  );
}

function redoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    ((event.shiftKey && event.key == "z") || (!event.shiftKey && event.key == "y")) &&
    !event.altKey
  );
}

function handleOnShortcut(
  text: string,
  state: State,
  command: ShortcutCommand | undefined
): [string, State] {
  switch (command) {
    case "selectAll":
      return handleOnSelectAll(text, state);
    case "undo":
      return handleOnUndo(text, state);
    case "redo":
      return handleOnRedo(text, state);
    default:
      return [text, state];
  }
}

function handleOnSelectAll(text: string, state: State): [string, State] {
  if (!state.cursorCoordinate) return [text, state];
  const lines = text.split("\n");
  const textSelection = {
    fixed: { lineIndex: 0, charIndex: 0 },
    free: { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length },
  };
  return [text, { ...state, textSelection, ...EditorConstants.defaultSuggestionState }];
}

function handleOnUndo(text: string, state: State): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead == -1 || state.textAreaValue != "") return [text, state];

  const action = editActionHistory[historyHead];
  if (action.actionType == "insert") {
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
        ...EditorConstants.defaultSuggestionState,
      },
    ];
  } else if (action.actionType == "delete") {
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
        ...EditorConstants.defaultSuggestionState,
      },
    ];
  }
  return [text, state];
}

function handleOnRedo(text: string, state: State): [string, State] {
  const { editActionHistory, historyHead } = state;
  if (historyHead == editActionHistory.length - 1 || state.textAreaValue != "") {
    return [text, state];
  }

  const action = editActionHistory[historyHead + 1];
  if (action.actionType == "insert") {
    const insertIndex = cursorCoordinateToTextIndex(text, action.coordinate);
    const newText = text.substring(0, insertIndex) + action.text + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, action.coordinate, action.text.length);
    return [
      newText,
      {
        ...state,
        cursorCoordinate,
        textSelection: undefined,
        historyHead: historyHead + 1,
        ...EditorConstants.defaultSuggestionState,
      },
    ];
  } else if (action.actionType == "delete") {
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
        historyHead: historyHead + 1,
        ...EditorConstants.defaultSuggestionState,
      },
    ];
  }

  return [text, state];
}
