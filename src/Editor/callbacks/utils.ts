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

  if (
    (props.syntax === undefined || props.syntax == 'bracket') &&
    constants.decoration.facingRegex.test(facingText) &&
    constants.decoration.trailingRegex.test(trailingText)
  ) {
    const allSuggestions = props.textProps?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0) return [text, resetSuggestion(state)];

    const groups = facingText.match(constants.decoration.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(groups.body) && sugg != groups.body);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.textProps?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.body.length;
    return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
  } else if (
    props.syntax == 'markdown' &&
    constants.heading.facingRegex.test(facingText) &&
    constants.heading.trailingRegex.test(trailingText)
  ) {
    const allSuggestions = props.textProps?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0) return [text, resetSuggestion(state)];

    const groups = facingText.match(constants.heading.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(groups.body) && sugg != groups.body);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.textProps?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.body.length;
    return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
  }

  const tagNames = Object.keys(props.taggedLinkPropsMap || {});
  for (const tagName of tagNames) {
    const facingRegex = constants.taggedLink.facingRegex(tagName);
    if (!facingRegex.test(facingText) || !constants.taggedLink.trailingRegex.test(trailingText)) continue;

    const allSuggestions = props.taggedLinkPropsMap?.[tagName]?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0) return [text, resetSuggestion(state)];

    const groups = facingText.match(facingRegex)?.groups as Record<string, string>;
    const linkName = groups.linkName || '';
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(linkName) && sugg != linkName);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.taggedLinkPropsMap?.[tagName]?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.linkName === undefined ? 0 : groups.linkName.length + 1;
    return [text, { ...state, suggestionType: 'taggedLink', suggestions, suggestionIndex, suggestionStart }];
  }

  if (constants.bracketLink.facingRegex.test(facingText) && constants.bracketLink.trailingRegex.test(trailingText)) {
    const allSuggestions = props.bracketLinkProps?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0 || props.bracketLinkProps?.disabled) {
      return [text, resetSuggestion(state)];
    }
    const groups = facingText.match(constants.bracketLink.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(groups.linkName) && sugg != groups.linkName);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.bracketLinkProps?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.linkName.length;
    return [text, { ...state, suggestionType: 'bracketLink', suggestions, suggestionIndex, suggestionStart }];
  }

  if (constants.hashtag.facingRegex.test(facingText) && constants.hashtag.trailingRegex.test(trailingText)) {
    const allSuggestions = props.hashTagProps?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0 || props.hashTagProps?.disabled) {
      return [text, resetSuggestion(state)];
    }
    const groups = facingText.match(constants.hashtag.facingRegex)?.groups as Record<string, string>;
    const hashTagName = groups.hashTagName;
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(hashTagName) && sugg != hashTagName);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.hashTagProps?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.hashTagName.length;
    return [text, { ...state, suggestionType: 'hashTag', suggestions, suggestionIndex, suggestionStart }];
  }

  if (constants.text.facingRegex.test(facingText) && constants.text.trailingRegex.test(trailingText)) {
    const allSuggestions = props.textProps?.suggestions;
    if (!allSuggestions || allSuggestions.length == 0) return [text, resetSuggestion(state)];

    const groups = facingText.match(constants.text.facingRegex)?.groups as Record<string, string>;
    const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(groups.text) && sugg != groups.text);
    if (suggestions.length == 0) return [text, resetSuggestion(state)];

    let suggestionIndex = props.textProps?.initialSuggestionIndex;
    if (!suggestionIndex || suggestions.length != allSuggestions.length) suggestionIndex = 0;
    const suggestionStart = groups.text.length;
    return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
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

  const suggestions = allSuggestions.filter((sugg) => sugg.startsWith(specifiedText) && sugg != specifiedText);
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
