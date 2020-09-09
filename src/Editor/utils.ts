import { State, OptionState, SelectionWithMouse, ShortcutCommand } from "./types";
import { EditorConstants } from "./constants";

import { moveCursor, cursorCoordinateToTextIndex, coordinatesAreEqual } from "../Cursor/utils";
import { selectionToRange, getSelectedText } from "../Selection/utils";
import { CursorCoordinate } from "../Cursor/types";
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
  option: OptionState,
  position: [number, number],
  element: HTMLElement | null
): [string, State, OptionState] {
  if (!element) return [text, state, option];
  const cursorCoordinate = positionToCursorCoordinate(text, state, option, position, element);

  return [
    text,
    { ...state, cursorCoordinate, textSelection: undefined },
    { ...option, selectionWithMouse: SelectionWithMouse.Started },
  ];
}

export function handleOnMouseMove(
  text: string,
  state: State,
  option: OptionState,
  position: [number, number],
  element: HTMLElement | null
): [string, State, OptionState] {
  if (
    !state.cursorCoordinate ||
    option.selectionWithMouse == SelectionWithMouse.Inactive ||
    !element
  ) {
    return [text, state, option];
  }
  if (option.selectionWithMouse == SelectionWithMouse.Started) {
    return [text, state, { ...option, selectionWithMouse: SelectionWithMouse.Active }];
  }
  const cursorCoordinate = positionToCursorCoordinate(text, state, option, position, element);
  if (coordinatesAreEqual(cursorCoordinate, state.cursorCoordinate)) return [text, state, option];
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = { ...cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [text, { ...state, cursorCoordinate, textSelection }, option];
}

export function handleOnMouseUp(
  text: string,
  state: State,
  option: OptionState,
  position: [number, number],
  element: HTMLElement | null
): [string, State, OptionState] {
  if (
    !state.cursorCoordinate ||
    option.selectionWithMouse == SelectionWithMouse.Inactive ||
    !element
  ) {
    return [text, state, option];
  }
  if (option.selectionWithMouse != SelectionWithMouse.Active) {
    return [text, state, { ...option, selectionWithMouse: SelectionWithMouse.Inactive }];
  }
  const cursorCoordinate = positionToCursorCoordinate(text, state, option, position, element);
  const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
  const free = { ...cursorCoordinate };
  const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
  return [
    text,
    { ...state, cursorCoordinate, textSelection },
    { ...option, selectionWithMouse: SelectionWithMouse.Inactive },
  ];
}

export const handleOnMouseLeave = handleOnMouseUp;

export function handleOnKeyDown(
  text: string,
  state: State,
  option: OptionState,
  event: React.KeyboardEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  const command = shortcutCommand(event);
  if (!state.cursorCoordinate || state.isComposing || (event.key.length == 1 && !command)) {
    return [text, state, option];
  }
  event.preventDefault();

  switch (event.key) {
    case "Enter": {
      const [newText, newState, newOption] = insertText(text, state, option, "\n");
      if (!newState.cursorCoordinate) return [newText, newState, newOption];

      const newLines = newText.split("\n");
      const prevLine = newLines[newState.cursorCoordinate.lineIndex - 1];
      const regex = TextLinesConstants.regexes.indent;
      const { indent, content } = prevLine.match(regex)?.groups as Record<string, string>;
      if (indent.length == 0) {
        return [newText, newState, newOption];
      } else if (content.length > 0) {
        return insertText(newText, newState, newOption, indent);
      } else {
        const backCoordinate = moveCursor(newText, newState.cursorCoordinate, -indent.length - 1);
        const textSelection = { fixed: newState.cursorCoordinate, free: backCoordinate };
        return insertText(newText, { ...newState, textSelection }, newOption, "");
      }
    }
    case "Tab": {
      const [newText, newState, newOption] = insertText(text, state, option, "\t");
      if (!newState.cursorCoordinate) return [newText, newState, newOption];

      const newLines = newText.split("\n");
      const { lineIndex, charIndex } = newState.cursorCoordinate;
      const currentLine = newLines[lineIndex];
      if (!/^ *$/.test(currentLine.substring(0, charIndex - 1))) {
        return [newText, newState, newOption];
      }
      const backCoordinate = moveCursor(newText, newState.cursorCoordinate, -1);
      const textSelection = { fixed: newState.cursorCoordinate, free: backCoordinate };
      return insertText(newText, { ...newState, textSelection }, newOption, " ");
    }
    case "Backspace": {
      if (state.textSelection) return insertText(text, state, option, "");
      const backCoordinate = moveCursor(text, state.cursorCoordinate, -1);
      const textSelection = { fixed: state.cursorCoordinate, free: backCoordinate };
      return insertText(text, { ...state, textSelection }, option, "");
    }
    case "ArrowUp": {
      const lines = text.split("\n");
      const prevLine = lines[state.cursorCoordinate.lineIndex - 1];
      if (prevLine === undefined) return [text, state, option];
      const cursorCoordinate = {
        lineIndex: state.cursorCoordinate.lineIndex - 1,
        charIndex: Math.min(state.cursorCoordinate.charIndex, prevLine.length),
      };
      return [text, { ...state, cursorCoordinate, textSelection: undefined }, option];
    }
    case "ArrowDown": {
      const lines = text.split("\n");
      const nextLine = lines[state.cursorCoordinate.lineIndex + 1];
      if (nextLine === undefined) return [text, state, option];
      const cursorCoordinate = {
        lineIndex: state.cursorCoordinate.lineIndex + 1,
        charIndex: Math.min(state.cursorCoordinate.charIndex, nextLine.length),
      };
      return [text, { ...state, cursorCoordinate, textSelection: undefined }, option];
    }
    case "ArrowLeft": {
      const cursorCoordinate = moveCursor(text, state.cursorCoordinate, -1);
      return [text, { ...state, cursorCoordinate, textSelection: undefined }, option];
    }
    case "ArrowRight": {
      const cursorCoordinate = moveCursor(text, state.cursorCoordinate, 1);
      return [text, { ...state, cursorCoordinate, textSelection: undefined }, option];
    }
    default:
      return handleOnShortcut(text, state, option, command);
  }
}

export function handleOnChange(
  text: string,
  state: State,
  option: OptionState,
  event: React.ChangeEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate) return [text, state, option];
  if (state.isComposing) return [text, { ...state, textAreaValue: event.target.value }, option];
  return insertText(text, state, option, event.target.value);
}

export function handleOnCompositionStart(
  text: string,
  state: State,
  option: OptionState,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate || state.isComposing) return [text, state, option];
  return [text, { ...state, isComposing: true }, option];
}

export function handleOnCompositionEnd(
  text: string,
  state: State,
  option: OptionState,
  event: React.CompositionEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate || !state.isComposing) return [text, state, option];
  const [newText, newState, newOption] = insertText(text, state, option, event.data);
  return [newText, { ...newState, textAreaValue: "", isComposing: false }, newOption];
}

export function handleOnCut(
  text: string,
  state: State,
  option: OptionState,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state, option];
  event.preventDefault();
  const selectedText = getSelectedText(state.textSelection, text);
  event.clipboardData.setData("text/plain", selectedText);
  return insertText(text, state, option, "");
}

export function handleOnCopy(
  text: string,
  state: State,
  option: OptionState,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate || !state.textSelection) return [text, state, option];
  event.preventDefault();
  const selectedText = getSelectedText(state.textSelection, text);
  event.clipboardData.setData("text/plain", selectedText);
  return [text, state, option];
}

export function handleOnPaste(
  text: string,
  state: State,
  option: OptionState,
  event: React.ClipboardEvent<HTMLTextAreaElement>
): [string, State, OptionState] {
  if (!state.cursorCoordinate) return [text, state, option];
  event.preventDefault();
  const textToPaste = event.clipboardData.getData("text");
  return insertText(text, state, option, textToPaste);
}

function insertText(
  text: string,
  state: State,
  option: OptionState,
  insertedText: string,
  cursourMoveAmount = insertedText.length
): [string, State, OptionState] {
  if (!state.cursorCoordinate) return [text, state, option];

  if (!state.textSelection) {
    const insertIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
    const newText = text.substring(0, insertIndex) + insertedText + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, state.cursorCoordinate, cursourMoveAmount);
    return [newText, { ...state, cursorCoordinate, textSelection: undefined }, option];
  }

  const { start, end } = selectionToRange(state.textSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  const newText = text.substring(0, startIndex) + insertedText + text.substring(endIndex);
  const cursorCoordinate = moveCursor(newText, start, cursourMoveAmount);
  return [newText, { ...state, cursorCoordinate, textSelection: undefined }, option];
}

function positionToCursorCoordinate(
  text: string,
  state: State,
  option: OptionState,
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
  } else if (option.selectionWithMouse == SelectionWithMouse.Active && state.cursorCoordinate) {
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
  option: OptionState,
  command: ShortcutCommand | undefined
): [string, State, OptionState] {
  if (command == "selectAll") return handleOnSelectAll(text, state, option);
  if (command == "undo") return handleOnUndo(text, state, option);
  if (command == "redo") return handleOnRedo(text, state, option);
  return [text, state, option];
}

function handleOnSelectAll(
  text: string,
  state: State,
  option: OptionState
): [string, State, OptionState] {
  if (!state.cursorCoordinate) return [text, state, option];
  const lines = text.split("\n");
  const textSelection = {
    fixed: { lineIndex: 0, charIndex: 0 },
    free: { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length },
  };
  return [text, { ...state, textSelection }, option];
}

function handleOnUndo(
  text: string,
  state: State,
  option: OptionState
): [string, State, OptionState] {
  return [text, state, option];
}

function handleOnRedo(
  text: string,
  state: State,
  option: OptionState
): [string, State, OptionState] {
  return [text, state, option];
}
