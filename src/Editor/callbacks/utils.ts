import { CursorCoordinate } from '../../Cursor/types';
import { moveCursor, cursorCoordinateToTextIndex, coordinatesAreEqual } from '../../Cursor/utils';
import { TextSelection } from '../../Selection/types';
import { selectionToRange } from '../../Selection/utils';
import { getTextCharElementAt } from '../../TextLines/utils';
import { CharConstants } from '../../components/atoms/TextLines/Char';
import { CharGroupConstants } from '../../components/atoms/TextLines/CharGroup';
import { HeaderConstants } from '../../components/atoms/TextLines/Header';
import { LineConstants } from '../../components/atoms/TextLines/Line';
import { LineGroupConstants } from '../../components/atoms/TextLines/LineGroup';
import { EditorConstants } from '../constants';
import { Props, State, EditAction } from '../types';

export function updateSelectionByCursor(
  textSelection: TextSelection | undefined,
  cursorCoordinate: CursorCoordinate | undefined,
  newCursorCoordinate: CursorCoordinate | undefined,
  disabled = false
): TextSelection | undefined {
  if (disabled || !cursorCoordinate) return undefined;
  const fixed = textSelection ? textSelection.fixed : cursorCoordinate;
  const free = newCursorCoordinate ? newCursorCoordinate : cursorCoordinate;
  return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
}

export function insertText(
  text: string,
  state: State,
  insertedText: string,
  cursourMoveAmount = insertedText.length
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  if (!state.textSelection) {
    if (!insertedText) return [text, state];
    const insertIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
    const newText = text.substring(0, insertIndex) + insertedText + text.substring(insertIndex);
    const cursorCoordinate = moveCursor(newText, state.cursorCoordinate, cursourMoveAmount);
    const action: EditAction = { actionType: 'insert', coordinate: state.cursorCoordinate, text: insertedText };
    const newState = addEditAction(state, action);
    return [newText, resetTextSelection({ ...newState, cursorCoordinate })];
  }

  const { start, end } = selectionToRange(state.textSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  const deletedText = text.substring(startIndex, endIndex);
  const newText = text.substring(0, startIndex) + insertedText + text.substring(endIndex);
  const cursorCoordinate = moveCursor(newText, start, cursourMoveAmount);
  let action: EditAction = { actionType: 'substitute', coordinate: start, deletedText, insertedText };
  if (!insertedText) action = { actionType: 'delete', coordinate: start, text: deletedText };
  const newState = addEditAction(state, action);
  return [newText, resetTextSelection({ ...newState, cursorCoordinate })];
}

function addEditAction(state: State, action: EditAction): State {
  if (state.historyHead === -1) return { ...state, editActionHistory: [action], historyHead: 0 };

  const { editActionHistory, historyHead } = state;
  const concatedHistory = [...editActionHistory.slice(0, historyHead + 1), action];
  const newHistory = concatedHistory.slice(
    Math.max(0, concatedHistory.length - EditorConstants.history.maxLength),
    concatedHistory.length
  );
  return { ...state, editActionHistory: newHistory, historyHead: newHistory.length - 1 };
}

export function showSuggestion(text: string, props: Props, state: State): [string, State] {
  if (!state.cursorCoordinate) return [text, resetSuggestion(state)];

  const constants = EditorConstants.suggestion;
  const { lineIndex, charIndex } = state.cursorCoordinate;
  const currentLine = text.split('\n')[lineIndex];
  const [facingText, trailingText] = [currentLine.substring(0, charIndex), currentLine.substring(charIndex)];

  interface RegexObject {
    facingRegex: RegExp;
    trailingRegex: RegExp;
  }

  interface SuggestionConfig {
    suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
    suggestions?: string[];
    initialSuggestionIndex?: number;
    getSuggestionStart?: (text: string | undefined) => number;
    disabled?: boolean;
  }

  function typedSuggestion(state: State, regexes: RegexObject, config: SuggestionConfig): State | undefined {
    if (!regexes.facingRegex.test(facingText) || !regexes.trailingRegex.test(trailingText)) return undefined;

    const allSuggestions = config.suggestions;
    if (!allSuggestions || allSuggestions.length === 0 || config.disabled) return resetSuggestion(state);

    const groups = facingText.match(regexes.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(groups.text || ''));
    if (suggestions.length === 0) return resetSuggestion(state);

    let suggestionIndex = config.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length !== allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = config.getSuggestionStart?.(groups.text) || groups.text?.length || 0;
    return { ...state, suggestionType: config.suggestionType, suggestions, suggestionIndex, suggestionStart };
  }

  switch (props.syntax) {
    case 'markdown': {
      const regexes: RegexObject = constants.heading;
      const config: SuggestionConfig = { suggestionType: 'text', ...props.textProps };
      const newState = typedSuggestion(state, regexes, config);
      if (newState) return [text, newState];
      break;
    }
    case 'bracket':
    default: {
      const regexes: RegexObject = constants.decoration;
      const config: SuggestionConfig = { suggestionType: 'text', ...props.textProps };
      const newState = typedSuggestion(state, regexes, config);
      if (newState) return [text, newState];
      break;
    }
  }

  for (const tagName of Object.keys(props.taggedLinkPropsMap || {})) {
    const regexes: RegexObject = {
      facingRegex: constants.taggedLink.facingRegex(tagName),
      trailingRegex: constants.taggedLink.trailingRegex,
    };
    const config: SuggestionConfig = {
      suggestionType: 'taggedLink',
      getSuggestionStart: (text) => (text === undefined ? 0 : text.length + 1),
      ...props.taggedLinkPropsMap?.[tagName],
    };
    const newState = typedSuggestion(state, regexes, config);
    if (newState) return [text, newState];
  }

  {
    const regexes: RegexObject = constants.bracketLink;
    const config: SuggestionConfig = { suggestionType: 'bracketLink', ...props.bracketLinkProps };
    const newState = typedSuggestion(state, regexes, config);
    if (newState) return [text, newState];
  }

  {
    const regexes: RegexObject = constants.hashtag;
    const config: SuggestionConfig = { suggestionType: 'hashtag', ...props.hashtagProps };
    const newState = typedSuggestion(state, regexes, config);
    if (newState) return [text, newState];
  }

  {
    const regexes: RegexObject = constants.text;
    const config: SuggestionConfig = { suggestionType: 'text', ...props.textProps };
    const newState = typedSuggestion(state, regexes, config);
    if (newState) return [text, newState];
  }

  return [text, resetSuggestion(state)];
}

export function showIMEBasedSuggestion(
  text: string,
  props: Props,
  state: State,
  specifiedText: string
): [string, State] {
  const allSuggestions = props.textProps?.suggestions;
  if (!allSuggestions || allSuggestions.length === 0) return [text, resetSuggestion(state)];

  const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(specifiedText));
  if (suggestions.length === 0) return [text, resetSuggestion(state)];

  let suggestionIndex = props.textProps?.initialSuggestionIndex;
  if (!suggestionIndex || suggestions.length !== allSuggestions.length) suggestionIndex = 0;
  const suggestionStart = specifiedText.length;
  return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
}

export function insertSuggestion(text: string, state: State, suggestion: string, start: number): [string, State] {
  const [newText, newState] = ((): [string, State] => {
    switch (state.suggestionType) {
      case 'bracketLink':
        return insertText(text, state, suggestion.substring(start));
      case 'hashtag':
        return insertText(text, state, `${suggestion.replaceAll(' ', '_')} `.substring(start));
      case 'taggedLink':
        return insertText(text, state, ` ${suggestion}`.substring(start));
      case 'text':
        return insertText(text, state, suggestion.substring(start));
      case 'none':
        return [text, state];
    }
  })();
  return [newText, resetSuggestion(newState)];
}

export function positionToCursorCoordinate(
  text: string,
  position: [number, number],
  element: HTMLElement
): CursorCoordinate | undefined {
  const lines = text.split('\n');
  const [x, y] = position;
  const elements = document.elementsFromPoint(x, y);

  const findElement = (selectIdRegex: RegExp): Element | undefined =>
    elements.find((e) => selectIdRegex.test(e.getAttribute('data-selectid') || '') && element.contains(e));

  const headerElement = findElement(HeaderConstants.selectIdRegex);
  const charElement = findElement(CharConstants.selectIdRegex);
  const charGroupElement = findElement(CharGroupConstants.selectIdRegex);
  const lineElement = findElement(LineConstants.selectIdRegex);
  const lineGroupElement = findElement(LineGroupConstants.selectIdRegex);
  const marginBottomElement = findElement(EditorConstants.body.selectIdRegex);

  if (headerElement) return undefined;

  if (charElement) {
    const selectId = charElement.getAttribute('data-selectid') as string;
    const groups = selectId.match(CharConstants.selectIdRegex)?.groups as Record<string, string>;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const charIndex = Number.parseInt(groups['charIndex'], 10);

    if (charIndex === lines[lineIndex].length) return { lineIndex, charIndex };
    const charRect = charElement.getBoundingClientRect();
    if (x <= charRect.left + charRect.width / 2) return { lineIndex, charIndex };
    return { lineIndex, charIndex: charIndex + 1 };
  }

  if (charGroupElement) {
    const selectId = charGroupElement.getAttribute('data-selectid') as string;
    const groups = selectId.match(CharGroupConstants.selectIdRegex)?.groups as Record<string, string>;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const firstCharIndex = Number.parseInt(groups['first'], 10);
    const lastCharIndex = Number.parseInt(groups['last'], 10);
    const charGroupRect = charGroupElement.getBoundingClientRect();

    if (x <= charGroupRect.left + charGroupRect.width / 2) {
      return { lineIndex, charIndex: firstCharIndex };
    } else {
      return { lineIndex, charIndex: lastCharIndex + 1 };
    }
  }

  if (lineElement) {
    const selectId = lineElement.getAttribute('data-selectid') as string;
    const groups = selectId.match(LineConstants.selectIdRegex)?.groups as Record<string, string>;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const currentLine = lines[lineIndex];

    let [charIndex, minDistance] = [lines[lineIndex].length, Number.MAX_VALUE];
    for (let index = 0; index <= currentLine.length; index++) {
      const charElement = getTextCharElementAt(lineIndex, index, element);
      const charRect = charElement?.getBoundingClientRect();
      if (!charRect) continue;

      const [ldx, ldy] = [charRect.left - x, (charRect.top + charRect.bottom) / 2 - y];
      const leftDistance = ldx * ldx + lineElement.clientWidth * ldy * ldy;
      if (leftDistance <= minDistance) {
        minDistance = leftDistance;
        charIndex = index;
      }

      if (index === currentLine.length) break;

      const [rdx, rdy] = [charRect.right - x, (charRect.top + charRect.bottom) / 2 - y];
      const rightDistance = rdx * rdx + lineElement.clientWidth * rdy * rdy;
      if (rightDistance <= minDistance) {
        minDistance = rightDistance;
        charIndex = index + 1;
      }
    }

    return { lineIndex, charIndex };
  }

  if (lineGroupElement) {
    const selectId = lineGroupElement.getAttribute('data-selectid') as string;
    const groups = selectId.match(LineGroupConstants.selectIdRegex)?.groups as Record<string, string>;
    const firstLineIndex = Number.parseInt(groups['first'], 10);
    const lastLineIndex = Number.parseInt(groups['last'], 10);
    const lineGroupRect = lineGroupElement.getBoundingClientRect();

    if (x <= lineGroupRect.left + lineGroupRect.width / 2) {
      return { lineIndex: firstLineIndex, charIndex: 0 };
    } else {
      return { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length };
    }
  }

  if (marginBottomElement) {
    return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
  }

  return undefined;
}

export function resetSuggestion(state: State): State {
  return { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1, suggestionStart: 0 };
}

export function resetTextSelection(state: State): State {
  return { ...state, textSelection: undefined, selectionMouse: 'deactive' };
}

export function resetTextSelectionAndSuggestion(state: State): State {
  return {
    ...state,
    textSelection: undefined,
    selectionMouse: 'deactive',
    suggestionType: 'none',
    suggestions: [],
    suggestionIndex: -1,
    suggestionStart: 0,
  };
}
