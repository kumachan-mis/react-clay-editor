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

  if (!state.textSelection && lines[lineIndex].length === 0) {
    let [facingMeta, sectionName, trailingMeta] = ['', '', ''];
    switch (item) {
      case 'normal':
        sectionName = props.normalLabel;
        if (!syntax || syntax === 'bracket') {
          // bracket syntax
          [facingMeta, trailingMeta] = ['[* ', ']'];
        } else {
          // markdown syntax
          [facingMeta, trailingMeta] = ['### ', ''];
        }
        break;
      case 'larger':
        sectionName = props.largerLabel;
        if (!syntax || syntax === 'bracket') {
          // bracket syntax
          [facingMeta, trailingMeta] = ['[* ', ']'];
        } else {
          // markdown syntax
          [facingMeta, trailingMeta] = ['### ', ''];
        }
        break;
      case 'largest':
        sectionName = props.largestLabel;
        if (!syntax || syntax === 'bracket') {
          // bracket syntax
          [facingMeta, trailingMeta] = ['[* ', ']'];
        } else {
          // markdown syntax
          [facingMeta, trailingMeta] = ['### ', ''];
        }
        break;
      default:
        return [text, state];
    }
    const insertedText = facingMeta + sectionName + trailingMeta;
    const cursourMoveAmount = facingMeta.length + sectionName.length;
    const [newText, newState] = insertText(text, state, insertedText, cursourMoveAmount);
    const newTextSelection = updateSelectionByMenu(newText, newState.cursorCoordinate, -sectionName.length);
    return [newText, { ...newState, textSelection: newTextSelection }];
  }
  return [text, state];
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
