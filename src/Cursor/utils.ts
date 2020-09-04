import { Props, State, CursorCoordinate } from "./types";

import { getTextCharElementAt } from "../TextLines/utils";
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
