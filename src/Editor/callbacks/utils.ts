import { Props, State, EditAction } from '../types';
import { EditorConstants } from '../constants';
import { moveCursor, cursorCoordinateToTextIndex } from '../../Cursor/utils';
import { selectionToRange } from '../../Selection/utils';
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
    Math.max(0, concatedHistory.length - EditorConstants.historyMaxLength),
    concatedHistory.length
  );
  return { ...state, editActionHistory: newHistory, historyHead: newHistory.length - 1 };
}

export function showSuggestion(text: string, props: Props, state: State): [string, State] {
  if (!state.cursorCoordinate) return [text, resetSuggestion(state)];

  const { lineIndex, charIndex } = state.cursorCoordinate;
  const currentLine = text.split('\n')[lineIndex];
  switch (currentLine[charIndex - 1]) {
    case '[': {
      if (currentLine[charIndex] !== undefined && !'] \t\u3000'.includes(currentLine[charIndex])) {
        return [text, resetSuggestion(state)];
      }
      const suggestions = props.bracketLinkProps?.suggestions;
      const suggestionIndex = props.bracketLinkProps?.initialSuggestionIndex || 0;
      if (!suggestions || suggestions.length == 0 || props.bracketLinkProps?.disabled) {
        return [text, resetSuggestion(state)];
      }
      return [text, { ...state, suggestionType: 'bracketLink', suggestions, suggestionIndex }];
    }
    case '#': {
      if (currentLine[charIndex] !== undefined && !' \t\u3000'.includes(currentLine[charIndex])) {
        return [text, resetSuggestion(state)];
      }
      const suggestions = props.hashTagProps?.suggestions;
      const suggestionIndex = props.hashTagProps?.initialSuggestionIndex || 0;
      if (!suggestions || suggestions.length == 0 || props.hashTagProps?.disabled) {
        return [text, resetSuggestion(state)];
      }
      return [text, { ...state, suggestionType: 'hashTag', suggestions, suggestionIndex }];
    }
    case ':': {
      if (!props.taggedLinkPropsMap) return [text, resetSuggestion(state)];
      if (currentLine[charIndex] !== undefined && !'] \t\u3000'.includes(currentLine[charIndex])) {
        return [text, resetSuggestion(state)];
      }
      const tagName = Object.keys(props.taggedLinkPropsMap).find((tagName) => {
        const pattern = `[${tagName}:`;
        const target = currentLine.substring(Math.max(charIndex - pattern.length, 0), charIndex);
        return target == pattern;
      });
      const taggedLinkProps = tagName ? props.taggedLinkPropsMap[tagName] : undefined;

      const suggestions = taggedLinkProps?.suggestions;
      const suggestionIndex = taggedLinkProps?.initialSuggestionIndex || 0;
      if (!suggestions || suggestions.length == 0) return [text, resetSuggestion(state)];
      return [text, { ...state, suggestionType: 'taggedLink', suggestions, suggestionIndex }];
    }
    case ' ': {
      const suggestions = props.decorationProps?.suggestions;
      const suggestionIndex = props.decorationProps?.initialSuggestionIndex || 0;
      if (!suggestions || suggestions.length == 0 || props.hashTagProps?.disabled) {
        return [text, resetSuggestion(state)];
      }

      const header = currentLine.substring(0, charIndex - 1);
      switch (props.syntax) {
        case 'bracket':
          if (!/^.*\[\*{1,3}$/.test(header) || ![']', undefined].includes(currentLine[charIndex])) {
            return [text, resetSuggestion(state)];
          }
          return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex }];
        case 'markdown':
          if (!['#', '##', '###'].includes(header) || currentLine[charIndex] !== undefined) {
            return [text, resetSuggestion(state)];
          }
          return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex }];
        default:
          return [text, resetSuggestion(state)];
      }
    }
    default:
      return [text, resetSuggestion(state)];
  }
}

export function insertSuggestion(text: string, state: State, suggestion: string): [string, State] {
  const [newText, newState] = ((): [string, State] => {
    switch (state.suggestionType) {
      case 'bracketLink':
        return insertText(text, state, suggestion);
      case 'hashTag':
        return insertText(text, state, `${suggestion.replaceAll(' ', '_')} `);
      case 'taggedLink':
        return insertText(text, state, ` ${suggestion}`);
      case 'text':
        return insertText(text, state, suggestion);
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
  type Groups = Record<string, string>;

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
  } else if (lineGroupElement) {
    const groups = lineGroupElement.className.match(lineGroupClassNameRegex)?.groups as Groups;
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
  return { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1 };
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
  };
}
