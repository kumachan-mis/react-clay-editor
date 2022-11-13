import { isMacOS } from '../../../../common/utils';
import { bracketItemizationRegex } from '../../../../parser/itemization/parseBracketItemization';
import { markdownItemizationRegex } from '../../../../parser/itemization/parseMarkdownItemization';
import { quotationRegex } from '../../../../parser/quotation/parseQuotation';
import { getSelectionText } from '../../../molecules/selection/Selection/utils';
import { showSuggestion, showIMEBasedSuggestion, insertSuggestion, resetSuggestion } from '../common/suggestion';
import { insertText } from '../common/text';
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
} from '../shortcuts/callbacks';
import { shortcutCommand } from '../shortcuts/triggers';
import { Props, State } from '../types';

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

      const groups = newPrevLine.match(quotationRegex)?.groups;
      if (groups) return insertText(newText, newState, groups.indent + groups.meta);

      if (!props.syntax || props.syntax === 'bracket') {
        // bracket syntax
        const groups = newPrevLine.match(bracketItemizationRegex)?.groups;
        if (groups) return insertText(newText, newState, groups.indent + groups.bullet);
      } else {
        // markdown syntax
        const groups = newPrevLine.match(markdownItemizationRegex)?.groups;
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
