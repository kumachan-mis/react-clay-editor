import { Props, State, CursorCoordinate } from "./types";
import { CursorConstants } from "./constants";

import { getTextCharElementAt } from "../TextLines/utils";
import { getRoot, getEditor } from "../Editor/utils";
import { classNameToSelector } from "../common";

export function cursorPropsToState(props: Props, state: State, element: HTMLElement | null): State {
  const rootRect = element ? getRoot(element)?.getBoundingClientRect() : undefined;
  const editorRect = element ? getEditor(element)?.getBoundingClientRect() : undefined;
  if (!props.coordinate || !element || !editorRect || !rootRect) {
    return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };
  }

  const root = getRoot(element);
  const textAreaSelector = `textarea${classNameToSelector(CursorConstants.textArea.className)}`;
  const textArea = root?.querySelector(textAreaSelector) as HTMLTextAreaElement | null;
  textArea?.focus();
  if (props.suggestions.length > 0) {
    const index = props.suggestionIndex;
    const className = classNameToSelector(CursorConstants.suggestion.item.className(index));
    const listItemSelector = `li${className}`;
    const listItem = root?.querySelector(listItemSelector) as HTMLLIElement | null;
    const list = listItem?.parentElement;
    if (list && listItem) {
      if (listItem.offsetTop < list.scrollTop) {
        list.scrollTop = listItem.offsetTop;
      } else if (listItem.offsetTop + listItem.clientHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = listItem.offsetTop + listItem.clientHeight - list.clientHeight;
      }
    }
  }

  const { lineIndex, charIndex } = props.coordinate;
  const charElement = getTextCharElementAt(lineIndex, charIndex, element);
  const charRect = charElement?.firstElementChild?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - editorRect.top, left: charRect.left - editorRect.left };
  const cursorSize = charRect.height;
  const { top: cursorTop } = position;
  if (cursorTop + editorRect.top - rootRect.top < 0) {
    charElement.scrollIntoView({ block: "start" });
    return state;
  } else if (cursorTop + cursorSize + editorRect.top - rootRect.top > rootRect.height) {
    charElement.scrollIntoView({ block: "end" });
    return state;
  }
  return { ...state, position, cursorSize };
}

export function moveCursor(
  text: string,
  coordinate: CursorCoordinate,
  amount: number
): CursorCoordinate {
  if (amount == 0) return coordinate;

  const lines = text.split("\n");
  let { lineIndex, charIndex } = { ...coordinate };
  if (amount > 0) {
    while (amount > 0) {
      if (lineIndex == lines.length - 1) {
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
      if (lineIndex == 0) {
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
  const lines = text.split("\n");
  let textIndex = 0;
  for (let lineIndex = 0; lineIndex < coordinate.lineIndex; lineIndex++) {
    textIndex += lines[lineIndex].length + 1;
  }
  textIndex += coordinate.charIndex;
  return textIndex;
}

export function coordinatesAreEqual(a: CursorCoordinate, b: CursorCoordinate): boolean {
  return a.lineIndex == b.lineIndex && a.charIndex == b.charIndex;
}
