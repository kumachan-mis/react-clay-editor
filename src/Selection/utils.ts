import { Props, State } from "./types";

import { getTextLineElementAt, getTextCharElementAt } from "../TextLines/utils";

export function selectionPropsToState(props: Props, element: HTMLElement): State {
  if (props.selection === undefined) {
    return {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
    };
  }
  const { fixed, free } = props.selection;
  const { start, end } = (() => {
    if (fixed.lineIndex < free.lineIndex) return { start: fixed, end: free };
    else if (fixed.lineIndex > free.lineIndex) return { start: free, end: fixed };
    else if (fixed.charIndex <= free.charIndex) return { start: fixed, end: free };
    else return { start: free, end: fixed };
  })();

  const getPosition = (startElement: HTMLElement | null, endElement: HTMLElement | null) => {
    if (!startElement || !endElement) return undefined;

    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();
    return {
      top: startRect.top,
      left: startRect.left,
      width: endRect.left - startRect.left + endRect.width,
      height: endRect.top - startRect.top + endRect.height,
    };
  };

  const lineNum = end.lineIndex - start.lineIndex + 1;
  if (lineNum == 1) {
    const startElement = getTextCharElementAt(start.lineIndex, start.charIndex, element);
    const endElement = getTextCharElementAt(end.lineIndex, end.charIndex - 1, element);
    return {
      topDivPosition: undefined,
      centerDivPosition: getPosition(startElement, endElement),
      bottomDivPosition: undefined,
    };
  }

  const topDivPosition = (() => {
    const startElement = getTextCharElementAt(start.lineIndex, start.charIndex, element);
    const endElement = getTextLineElementAt(start.lineIndex, element);
    return getPosition(startElement, endElement);
  })();

  const bottomDivPosition = (() => {
    if (end.charIndex == 0) return undefined;
    const startElement = getTextLineElementAt(end.lineIndex, element);
    const endElement = getTextCharElementAt(end.lineIndex, end.charIndex - 1, element);
    return getPosition(startElement, endElement);
  })();

  const centerDivPosition = (() => {
    if (lineNum == 2) return undefined;
    const startElement = getTextLineElementAt(start.lineIndex + 1, element);
    const endElement = getTextLineElementAt(end.lineIndex - 1, element);
    return getPosition(startElement, endElement);
  })();

  return { topDivPosition, centerDivPosition, bottomDivPosition };
}
