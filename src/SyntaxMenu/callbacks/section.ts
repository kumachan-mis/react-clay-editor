import { CursorCoordinate } from '../../Cursor/types';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { SectionMenuProps } from '../types';

import { updateSelectionByMenu } from './utils';

export function sectionMenuDisabled(text: string, state: State): boolean {
  const { cursorCoordinate, textSelection } = state;
  if (
    !cursorCoordinate ||
    (textSelection && Math.abs(textSelection.free.lineIndex - textSelection.fixed.lineIndex) > 0)
  ) {
    return true;
  }
  return false;
}

export function handleSectionMenu(
  text: string,
  state: State,
  props: Required<SectionMenuProps>,
  item: 'normal' | 'larger' | 'largest',
  syntax?: 'bracket' | 'markdown'
): [string, State] {
  if (sectionMenuDisabled(text, state)) return [text, state];

  const lines = text.split('\n');
  const { lineIndex } = state.cursorCoordinate as CursorCoordinate;

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
          [facingMeta, trailingMeta] = ['[** ', ']'];
        } else {
          // markdown syntax
          [facingMeta, trailingMeta] = ['## ', ''];
        }
        break;
      case 'largest':
        sectionName = props.largestLabel;
        if (!syntax || syntax === 'bracket') {
          // bracket syntax
          [facingMeta, trailingMeta] = ['[*** ', ']'];
        } else {
          // markdown syntax
          [facingMeta, trailingMeta] = ['# ', ''];
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
