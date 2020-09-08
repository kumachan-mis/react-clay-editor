import { Props, State, TextSelection, TextRange } from "./types";

import { getEditor } from "../Editor/utils";
import { getTextCharElementAt } from "../TextLines/utils";
import { cursorCoordinateToTextIndex } from "../Cursor/utils";

export function selectionPropsToState(props: Props, element: HTMLElement): State {
  const defaultTextAreaPosition = { top: 0, left: 0, width: 0, height: 0 };
  const editorRect = getEditor(element)?.getBoundingClientRect();
  if (!props.textSelection || !editorRect) {
    return {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
      textAreaPosition: { top: 0, left: 0, width: 0, height: 0 },
    };
  }

  const { start, end } = selectionToRange(props.textSelection);
  const startElement = getTextCharElementAt(start.lineIndex, start.charIndex, element);
  const endElement = getTextCharElementAt(end.lineIndex, end.charIndex, element);
  const startRect = startElement?.getBoundingClientRect();
  const endRect = endElement?.getBoundingClientRect();
  if (!startRect || !endRect) {
    return {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
      textAreaPosition: { top: 0, left: 0, width: 0, height: 0 },
    };
  }

  const startRectCenter = startRect.bottom - (startRect.bottom - startRect.top) / 2;
  const endRectCenter = endRect.bottom - (endRect.bottom - endRect.top) / 2;
  if (
    (startRect.top <= endRectCenter && endRectCenter <= startRect.bottom) ||
    (endRect.top <= startRectCenter && startRectCenter <= endRect.bottom)
  ) {
    const topDivPosition = undefined;
    const centerDivPosition = {
      top: Math.min(startRect.top, endRect.top) - editorRect.top,
      left: startRect.left - editorRect.left,
      width: endRect.left - startRect.left,
      height: Math.max(startRect.bottom, endRect.bottom) - Math.min(startRect.top, endRect.top),
    };
    const bottomDivPosition = undefined;
    const textAreaPosition = { ...centerDivPosition };
    return { topDivPosition, centerDivPosition, bottomDivPosition, textAreaPosition };
  } else {
    const topDivPosition = {
      top: startRect.top - editorRect.top,
      left: startRect.left - editorRect.left,
      width: editorRect.right - startRect.left,
      height: startRect.height,
    };
    const centerDivPosition = {
      top: startRect.bottom - editorRect.top,
      left: 0,
      width: editorRect.width,
      height: endRect.top - startRect.bottom,
    };
    const bottomDivPosition = {
      top: endRect.top - editorRect.top,
      left: 0,
      width: endRect.left - editorRect.left,
      height: endRect.height,
    };
    const textAreaPosition = {
      top: startRect.top - editorRect.top,
      left: 0,
      width: editorRect.width,
      height: endRect.bottom - startRect.top,
    };
    return { topDivPosition, centerDivPosition, bottomDivPosition, textAreaPosition };
  }
}

export function getSelectedText(props: Props): string {
  const { textSelection, text } = props;
  if (!textSelection) return "";
  const { start, end } = selectionToRange(textSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  return text.substring(startIndex, endIndex);
}

export function selectionToRange(textSelection: TextSelection): TextRange {
  const { fixed, free } = textSelection;
  if (fixed.lineIndex < free.lineIndex) return { start: fixed, end: free };
  else if (fixed.lineIndex > free.lineIndex) return { start: free, end: fixed };
  else if (fixed.charIndex <= free.charIndex) return { start: fixed, end: free };
  else return { start: free, end: fixed };
}
