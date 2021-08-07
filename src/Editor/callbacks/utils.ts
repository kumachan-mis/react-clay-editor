import { Props, State, EditAction } from '../types';
import { EditorConstants } from '../constants';
import { moveCursor, cursorCoordinateToTextIndex } from '../../Cursor/utils';
import { selectionToRange } from '../../Selection/utils';
import { getTextCharElementAt } from '../../TextLines/utils';
import { CursorCoordinate } from '../../Cursor/types';
import { TextLinesConstants } from '../../TextLines/constants';

export function insertText(
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
    return [newText, resetTextSelection({ ...newState, cursorCoordinate })];
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
  return [newText, resetTextSelection({ ...newState, cursorCoordinate })];
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
    suggestionType: 'text' | 'bracketLink' | 'hashTag' | 'taggedLink' | 'none';
    suggestions?: string[];
    initialSuggestionIndex?: number;
    getSuggestionStart?: (text: string | undefined) => number;
    disabled?: boolean;
  }

  function typedSuggestion(state: State, regexes: RegexObject, config: SuggestionConfig): State | undefined {
    if (!regexes.facingRegex.test(facingText) || !regexes.trailingRegex.test(trailingText)) return undefined;

    const allSuggestions = config.suggestions;
    if (!allSuggestions || allSuggestions.length == 0 || config.disabled) return resetSuggestion(state);

    const groups = facingText.match(regexes.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(groups.text || ''));
    if (suggestions.length == 0) return resetSuggestion(state);

    let suggestionIndex = config.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
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
    const config: SuggestionConfig = { suggestionType: 'hashTag', ...props.hashTagProps };
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
  if (!allSuggestions || allSuggestions.length == 0) return [text, resetSuggestion(state)];

  const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(specifiedText));
  if (suggestions.length == 0) return [text, resetSuggestion(state)];

  let suggestionIndex = props.textProps?.initialSuggestionIndex;
  if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
  const suggestionStart = specifiedText.length;
  return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
}

export function insertSuggestion(text: string, state: State, suggestion: string, start: number): [string, State] {
  const [newText, newState] = ((): [string, State] => {
    switch (state.suggestionType) {
      case 'bracketLink':
        return insertText(text, state, suggestion.substring(start));
      case 'hashTag':
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
  state: State,
  position: [number, number],
  element: HTMLElement
): CursorCoordinate | undefined {
  const [x, y] = position;
  const elements = document.elementsFromPoint(x, y);

  const charClassNameRegex = TextLinesConstants.char.classNameRegex;
  const charElement = elements.find((charEl) => charClassNameRegex.test(charEl.className) && element.contains(charEl));
  const charGroupClassNameRegex = TextLinesConstants.charGroup.classNameRegex;
  const charGroupElement = elements.find(
    (charGrpEl) => charGroupClassNameRegex.test(charGrpEl.className) && element.contains(charGrpEl)
  );
  const lineClassNameRegex = TextLinesConstants.line.classNameRegex;
  const lineElement = elements.find((lineEl) => lineClassNameRegex.test(lineEl.className) && element.contains(lineEl));
  const lineGroupClassNameRegex = TextLinesConstants.lineGroup.classNameRegex;
  const lineGroupElement = elements.find(
    (lineGrpEl) => lineGroupClassNameRegex.test(lineGrpEl.className) && element.contains(lineGrpEl)
  );
  const marginBottomClassName = EditorConstants.editor.className;
  const marginBottomElement = elements.find(
    (marginEl) => marginEl.className == marginBottomClassName && element.contains(marginEl)
  );

  const lines = text.split('\n');
  if (charElement) {
    const groups = charElement.className.match(charClassNameRegex)?.groups as Record<string, string>;
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
    const groups = charGroupElement.className.match(charGroupClassNameRegex)?.groups as Record<string, string>;
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
    const groups = lineElement.className.match(lineClassNameRegex)?.groups as Record<string, string>;
    const lineIndex = Number.parseInt(groups['lineIndex'], 10);
    const currentLine = lines[lineIndex];
    let [charIndex, minDistance] = [lines[lineIndex].length, Number.MAX_VALUE];
    for (let index = 0; index < currentLine.length; index++) {
      const charElement = getTextCharElementAt(lineIndex, index, element);
      const charRect = charElement?.firstElementChild?.getBoundingClientRect();
      if (!charRect) continue;
      const [ldx, ldy] = [charRect.left - x, (charRect.top + charRect.bottom) / 2 - y];
      const leftDistance = ldx * ldx + lineElement.clientWidth * ldy * ldy;
      if (leftDistance <= minDistance) {
        minDistance = leftDistance;
        charIndex = index;
      }
      const [rdx, rdy] = [charRect.right - x, (charRect.top + charRect.bottom) / 2 - y];
      const rightDistance = rdx * rdx + lineElement.clientWidth * rdy * rdy;
      if (rightDistance <= minDistance) {
        minDistance = rightDistance;
        charIndex = index + 1;
      }
    }
    return { lineIndex, charIndex };
  } else if (lineGroupElement) {
    const groups = lineGroupElement.className.match(lineGroupClassNameRegex)?.groups as Record<string, string>;
    const fromLineIndex = Number.parseInt(groups['from'], 10);
    const toLineIndex = Number.parseInt(groups['to'], 10);
    const lineGroupRect = lineGroupElement.getBoundingClientRect();
    if (x <= lineGroupRect.left + lineGroupRect.width / 2) {
      return { lineIndex: fromLineIndex, charIndex: 0 };
    } else {
      return { lineIndex: toLineIndex, charIndex: lines[toLineIndex].length };
    }
  } else if (marginBottomElement) {
    return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
  } else {
    return state.cursorCoordinate;
  }
}

export function resetSuggestion(state: State): State {
  return { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1, suggestionStart: 0 };
}

export function resetTextSelection(state: State): State {
  return { ...state, textSelection: undefined, selectionWithMouse: 'inactive' };
}

export function resetTextSelectionAndSuggestion(state: State): State {
  return {
    ...state,
    textSelection: undefined,
    selectionWithMouse: 'inactive',
    suggestionType: 'none',
    suggestions: [],
    suggestionIndex: -1,
    suggestionStart: 0,
  };
}
