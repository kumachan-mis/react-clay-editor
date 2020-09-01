import { TextLinesConstants } from "../TextLines/constants";
export function selectionPropsToState(props) {
    if (props.selection === undefined) {
        return {
            topDivPosition: undefined,
            centerDivPosition: undefined,
            bottomDivPosition: undefined,
        };
    }
    const { fixed, free } = props.selection;
    const { start, end } = (() => {
        if (fixed.lineIndex < free.lineIndex)
            return { start: fixed, end: free };
        else if (fixed.lineIndex > free.lineIndex)
            return { start: free, end: fixed };
        else if (fixed.charIndex <= free.charIndex)
            return { start: fixed, end: free };
        else
            return { start: free, end: fixed };
    })();
    const idsToPosition = (startId, endId) => {
        const startElement = document.getElementById(startId);
        const endElement = document.getElementById(endId);
        if (!startElement || !endElement)
            return undefined;
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
        const startId = TextLinesConstants.char.id(start.lineIndex, start.charIndex);
        const endId = TextLinesConstants.char.id(end.lineIndex, end.charIndex - 1);
        return {
            topDivPosition: undefined,
            centerDivPosition: idsToPosition(startId, endId),
            bottomDivPosition: undefined,
        };
    }
    const topDivPosition = (() => {
        const startId = TextLinesConstants.char.id(start.lineIndex, start.charIndex);
        const endId = TextLinesConstants.line.id(start.lineIndex);
        return idsToPosition(startId, endId);
    })();
    const bottomDivPosition = (() => {
        if (end.charIndex == 0)
            return undefined;
        const startId = TextLinesConstants.line.id(end.lineIndex);
        const endId = TextLinesConstants.char.id(end.lineIndex, end.charIndex - 1);
        return idsToPosition(startId, endId);
    })();
    const centerDivPosition = (() => {
        if (lineNum == 2)
            return undefined;
        const startId = TextLinesConstants.line.id(start.lineIndex + 1);
        const endId = TextLinesConstants.line.id(end.lineIndex - 1);
        return idsToPosition(startId, endId);
    })();
    return { topDivPosition, centerDivPosition, bottomDivPosition };
}
