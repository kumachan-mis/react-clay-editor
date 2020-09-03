import { Props, State, CursorCoordinate } from "./types";

import { getTextLineElementAt, getTextCharElementAt } from "../TextLines/utils";
import { getRoot, getEditor } from "../Editor/utils";

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
  const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(
    props.coordinate,
    element
  );
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
  const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(
    props.coordinate,
    element
  );
  if (!elementCursorOn) return { ...state, position: [0, 0], cursorSize: 0 };
  return { ...state, position, cursorSize };
}

function coordinateToCursorDrawInfo(
  coordinate: CursorCoordinate,
  element: HTMLElement
): CursorDrawInfo {
  const editorRect = getEditor(element)?.getBoundingClientRect();
  if (!editorRect) return { position: [0, 0], cursorSize: 0, elementCursorOn: null };

  const { lineIndex, charIndex } = coordinate;
  const charElement = getTextCharElementAt(lineIndex, charIndex - 1, element);
  const lineElement = getTextLineElementAt(lineIndex, element);
  if (charElement) {
    const charRect = charElement.getBoundingClientRect();
    return {
      position: [charRect.top - editorRect.top, charRect.right - editorRect.left],
      cursorSize: charRect.height,
      elementCursorOn: charElement,
    };
  } else if (lineElement) {
    const nextCharElement = getTextCharElementAt(lineIndex, charIndex, element);
    const elementCursorOn = nextCharElement?.textContent ? nextCharElement : lineElement;
    const rect = elementCursorOn.getBoundingClientRect();
    return {
      position: [rect.top - editorRect.top, rect.left - editorRect.left],
      cursorSize: rect.height,
      elementCursorOn,
    };
  }
  return { position: [0, 0], cursorSize: 0, elementCursorOn: null };
}
