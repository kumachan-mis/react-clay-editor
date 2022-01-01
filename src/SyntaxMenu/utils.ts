import { CursorCoordinate } from '../Cursor/types';
import { moveCursor } from '../Cursor/utils';
import { insertText } from '../Editor/callbacks/utils';
import { State } from '../Editor/types';
import { TextSelection } from '../Selection/types';

import { SectionMenuProps } from './types';

export function handleSectionMenu(
  text: string,
  state: State,
  props: Required<SectionMenuProps>,
  item: 'normal' | 'larger' | 'largest',
  syntax?: 'bracket' | 'markdown'
): [string, State] {
  if (!state.cursorCoordinate) return [text, state];

  const lines = text.split('\n');
  const { lineIndex } = state.cursorCoordinate;

  function handleBracketSyntax(): [string, State] {
    if (!state.textSelection && lines[lineIndex].length === 0) {
      let [insertedText, selectedText] = ['', ''];
      switch (item) {
        case 'normal':
          [insertedText, selectedText] = [`[* ${props.normalLabel}]`, props.normalLabel];
          break;
        case 'larger':
          [insertedText, selectedText] = [`[** ${props.largerLabel}]`, props.largerLabel];
          break;
        case 'largest':
          [insertedText, selectedText] = [`[*** ${props.largestLabel}]`, props.largestLabel];
          break;
        default:
          return [text, state];
      }
      const [newText, newState] = insertText(text, state, insertedText, insertedText.length - 1);
      const newTextSelection = updateSelectionByMenu(newText, newState.cursorCoordinate, -selectedText.length);
      return [newText, { ...newState, textSelection: newTextSelection }];
    }
    return [text, state];
  }

  function handleMarkdownSyntax(): [string, State] {
    if (!state.textSelection && lines[lineIndex].length === 0) {
      let [insertedText, selectedText] = ['', ''];
      switch (item) {
        case 'normal':
          [insertedText, selectedText] = [`### ${props.normalLabel}`, props.normalLabel];
          break;
        case 'larger':
          [insertedText, selectedText] = [`## ${props.largerLabel}`, props.largerLabel];
          break;
        case 'largest':
          [insertedText, selectedText] = [`# ${props.largestLabel}`, props.largestLabel];
          break;
        default:
          return [text, state];
      }
      const [newText, newState] = insertText(text, state, insertedText, insertedText.length);
      const newTextSelection = updateSelectionByMenu(newText, newState.cursorCoordinate, -selectedText.length);
      return [newText, { ...newState, textSelection: newTextSelection }];
    }
    return [text, state];
  }

  return !syntax || syntax === 'bracket' ? handleBracketSyntax() : handleMarkdownSyntax();
}

function updateSelectionByMenu(
  newText: string,
  newCursorCoordinate: CursorCoordinate | undefined,
  selectionAmount: number
): TextSelection | undefined {
  if (!newCursorCoordinate) return undefined;

  if (selectionAmount > 0) {
    const fixed = newCursorCoordinate;
    const free = moveCursor(newText, newCursorCoordinate, selectionAmount);
    return { fixed, free };
  } else if (selectionAmount < 0) {
    const fixed = moveCursor(newText, newCursorCoordinate, selectionAmount);
    const free = newCursorCoordinate;
    return { fixed, free };
  }
  return undefined;
}
