import { Props, State } from "./types";

import { getEditor } from "../Editor/utils";
import { getTextCharElementAt } from "../TextLines/utils";

export function selectionPropsToState(props: Props, element: HTMLElement): State {
  const editorRect = getEditor(element)?.getBoundingClientRect();
  if (props.textSelection === undefined || !editorRect) {
    return {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
      textAreaPosition: undefined,
    };
  }

  const { fixed, free } = props.textSelection;
  const { start, end } = (() => {
    if (fixed.lineIndex < free.lineIndex) return { start: fixed, end: free };
    else if (fixed.lineIndex > free.lineIndex) return { start: free, end: fixed };
    else if (fixed.charIndex <= free.charIndex) return { start: fixed, end: free };
    else return { start: free, end: fixed };
  })();

  const startElement = getTextCharElementAt(start.lineIndex, start.charIndex, element);
  const endElement = getTextCharElementAt(end.lineIndex, end.charIndex, element);
  const startRect = startElement?.getBoundingClientRect();
  const endRect = endElement?.getBoundingClientRect();
  if (!startRect || !endRect) {
    return {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
      textAreaPosition: undefined,
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
    return { topDivPosition, centerDivPosition, bottomDivPosition, textAreaPosition: undefined };
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
    return { topDivPosition, centerDivPosition, bottomDivPosition, textAreaPosition: undefined };
  }
}

export function getSelectedText(props: Props): string {
  if (!props.textSelection) return "";
  return "";
}
