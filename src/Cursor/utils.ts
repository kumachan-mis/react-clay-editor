import { getEditor, getBody } from '../Editor/utils';
import { getTextCharElementAt } from '../TextLines/utils';
import { SuggestionListBodyConstants } from '../components/atoms/SuggesionListBody';
import { SuggestionListItemConstants } from '../components/atoms/SuggesionListItem';

import { Props, State, CursorCoordinate } from './types';

export function cursorPropsToState(props: Props, state: State, element: HTMLElement): State {
  const editorElement = getEditor(element);
  const editorRect = editorElement?.getBoundingClientRect();
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.coordinate || !bodyRect || !editorElement || !editorRect) {
    return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };
  }

  const list = editorElement.querySelector(
    `ul[data-selectid="${SuggestionListBodyConstants.selectId}"]`
  ) as HTMLUListElement | null;
  const listItem = editorElement.querySelector(
    `li[data-selectid="${SuggestionListItemConstants.selectId(props.suggestionIndex)}"]`
  ) as HTMLLIElement | null;
  if (props.suggestions.length > 0 && list && listItem) {
    if (listItem.offsetTop < list.scrollTop) {
      list.scrollTop = listItem.offsetTop;
    } else if (listItem.offsetTop + listItem.clientHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = listItem.offsetTop + listItem.clientHeight - list.clientHeight;
    }
  }

  const { coordinate } = props;
  const charElement = getTextCharElementAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - bodyRect.top, left: charRect.left - bodyRect.left };
  const [cursorSize, margin] = [charRect.height, 4];
  if (props.mouseHold !== 'active-in') {
    if (charRect.top - editorRect.top - margin < 0) {
      editorElement.scrollTop += charRect.top - editorRect.top;
      return handleOnEditorScrollOrResize(props, state, element);
    } else if (charRect.top + cursorSize - editorRect.top > editorRect.height - margin) {
      editorElement.scrollTop += charRect.top + cursorSize - editorRect.top - editorRect.height;
      return handleOnEditorScrollOrResize(props, state, element);
    }
  }

  return { ...state, position, cursorSize };
}

export function handleOnEditorScrollOrResize(props: Props, state: State, element: HTMLElement): State {
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.coordinate || !bodyRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const { coordinate } = props;
  const charElement = getTextCharElementAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - bodyRect.top, left: charRect.left - bodyRect.left };
  const cursorSize = charRect.height;
  return { ...state, position, cursorSize };
}

export function moveCursor(text: string, coordinate: CursorCoordinate, amount: number): CursorCoordinate {
  if (amount === 0) return coordinate;

  const lines = text.split('\n');
  let { lineIndex, charIndex } = { ...coordinate };
  if (amount > 0) {
    while (amount > 0) {
      if (lineIndex === lines.length - 1) {
        charIndex += Math.min(amount, lines[lineIndex].length - charIndex);
        break;
      }
      if (charIndex + amount <= lines[lineIndex].length) {
        charIndex += amount;
        amount = 0;
      } else {
        amount -= lines[lineIndex].length - charIndex + 1;
        lineIndex++;
        charIndex = 0;
      }
    }
  } else {
    amount = -amount;
    while (amount > 0) {
      if (lineIndex === 0) {
        charIndex -= Math.min(amount, charIndex);
        break;
      }
      if (charIndex - amount >= 0) {
        charIndex -= amount;
        amount = 0;
      } else {
        amount -= charIndex + 1;
        lineIndex--;
        charIndex = lines[lineIndex].length;
      }
    }
  }
  return { lineIndex, charIndex };
}

export function cursorCoordinateToTextIndex(text: string, coordinate: CursorCoordinate): number {
  const lines = text.split('\n');
  let textIndex = 0;
  for (let lineIndex = 0; lineIndex < coordinate.lineIndex; lineIndex++) {
    textIndex += lines[lineIndex].length + 1;
  }
  textIndex += coordinate.charIndex;
  return textIndex;
}

export function copyCoordinate(coordinate: CursorCoordinate | undefined): CursorCoordinate | undefined {
  if (!coordinate) return undefined;
  return { ...coordinate };
}

export function coordinatesAreEqual(a: CursorCoordinate, b: CursorCoordinate): boolean {
  return a.lineIndex === b.lineIndex && a.charIndex === b.charIndex;
}
