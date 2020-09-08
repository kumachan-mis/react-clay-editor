import { Props, State, CursorCoordinate } from "./types";
import { CursorConstants } from "./constants";

import { getTextCharElementAt } from "../TextLines/utils";
import { getRoot, getEditor } from "../Editor/utils";
import { classNameToSelector } from "../common";

interface CursorDrawInfo {
  position: [number, number];
  cursorSize: number;
  elementCursorOn: HTMLElement | null;
}

export function cursorPropsToState(props: Props, state: State, element: HTMLElement): State {
  const rootRect = getRoot(element)?.getBoundingClientRect();
  const editorRect = getEditor(element)?.getBoundingClientRect();
  if (!props.coordinate || !editorRect || !rootRect) {
    return { ...state, position: [0, 0], cursorSize: 0 };
  }

  const selector = `textarea${classNameToSelector(CursorConstants.textArea.className)}`;
  const textArea = getRoot(element)?.querySelector(selector) as HTMLTextAreaElement;
  textArea.focus();

  const { coordinate } = props;
  const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(coordinate, element);
  if (!elementCursorOn) return { ...state, position: [0, 0], cursorSize: 0 };

  const [cursorTop] = position;
  if (cursorTop + editorRect.top - rootRect.top < 0) {
    elementCursorOn.scrollIntoView({ block: "start" });
    return state;
  } else if (cursorTop + cursorSize + editorRect.top - rootRect.top > rootRect.height) {
    elementCursorOn.scrollIntoView({ block: "end" });
    return state;
  }
  return { ...state, position, cursorSize };
}

export function handleOnEditorScroll(props: Props, state: State, element: HTMLElement): State {
  if (!props.coordinate) return { ...state, position: [0, 0], cursorSize: 0 };
  const { coordinate } = props;
  const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(coordinate, element);
  if (!elementCursorOn) return { ...state, position: [0, 0], cursorSize: 0 };
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

function coordinateToCursorDrawInfo(
  coordinate: CursorCoordinate,
  element: HTMLElement
): CursorDrawInfo {
  const editorRect = getEditor(element)?.getBoundingClientRect();
  const charElement = getTextCharElementAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!editorRect || !charRect) return { position: [0, 0], cursorSize: 0, elementCursorOn: null };

  return {
    position: [charRect.top - editorRect.top, charRect.left - editorRect.left],
    cursorSize: charRect.height,
    elementCursorOn: charElement,
  };
}
