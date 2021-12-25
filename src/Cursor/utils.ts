import { getRoot, getBody } from '../Editor/utils';
import { getTextCharElementAt } from '../TextLines/utils';

import { CursorConstants } from './constants';
import { Props, State, CursorCoordinate } from './types';

export function cursorPropsToState(props: Props, state: State, element: HTMLElement): State {
  const root = getRoot(element);
  const rootRect = root?.getBoundingClientRect();
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.coordinate || !bodyRect || !root || !rootRect) {
    return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };
  }

  root?.querySelector('textarea')?.focus({ preventScroll: true });

  if (props.suggestions.length > 0) {
    const listItemSelector = `li[data-selectid="${CursorConstants.suggestion.item.selectId(props.suggestionIndex)}"]`;
    const listSelector = `li[data-selectid="${CursorConstants.suggestion.list.selectId}"]`;
    const listItem = root?.querySelector(listItemSelector) as HTMLLIElement | null;
    const list = root?.querySelector(listSelector) as HTMLUListElement | null;
    if (list && listItem && listItem.offsetTop < list.scrollTop) {
      list.scrollTop = listItem.offsetTop;
    } else if (list && listItem && listItem.offsetTop + listItem.clientHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = listItem.offsetTop + listItem.clientHeight - list.clientHeight;
    }
  }

  const { coordinate } = props;
  const charElement = getTextCharElementAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - bodyRect.top, left: charRect.left - bodyRect.left };
  const [cursorSize, margin] = [charRect.height, charRect.height];

  if (!props.isHeld) {
    if (charRect.top - rootRect.top - margin < 0) {
      root.scrollTop += charRect.top - rootRect.top - margin;
    } else if (charRect.top + cursorSize - rootRect.top > rootRect.height - margin) {
      root.scrollTop += charRect.top + cursorSize - rootRect.top - rootRect.height + margin;
    }
    return handleOnEditorScrollOrResize(props, state, element);
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

export function coordinatesAreEqual(a: CursorCoordinate, b: CursorCoordinate): boolean {
  return a.lineIndex === b.lineIndex && a.charIndex === b.charIndex;
}
