import { EditorConstants as Constants } from "./constants";
import { TextLinesConstants } from "../TextLines/constants";
export function handleOnKeyDown(text, state, key) {
    if (!state.cursorCoordinate || state.isComposing)
        return [text, state];
    if (key.length == 1)
        return insertText(text, state, key);
    switch (key) {
        case "Enter": {
            const [newText, newState] = insertText(text, state, "\n");
            if (!newState.cursorCoordinate)
                return [newText, newState];
            const newLines = newText.split("\n");
            const prevLine = newLines[newState.cursorCoordinate.lineIndex - 1];
            const regex = TextLinesConstants.syntaxRegex.indent;
            const { indent, content } = prevLine.match(regex)?.groups;
            if (indent.length == 0) {
                return [newText, newState];
            }
            else if (content.length > 0) {
                return insertText(newText, newState, indent);
            }
            else {
                const backCoordinate = moveCursor(newText, newState.cursorCoordinate, -indent.length - 1);
                const textSelection = { fixed: newState.cursorCoordinate, free: backCoordinate };
                return insertText(newText, { ...newState, textSelection }, "");
            }
        }
        case "Tab": {
            const [newText, newState] = insertText(text, state, "\t");
            if (!newState.cursorCoordinate)
                return [newText, newState];
            const newLines = newText.split("\n");
            const { lineIndex, charIndex } = newState.cursorCoordinate;
            const currentLine = newLines[lineIndex];
            if (!/^ *$/.test(currentLine.substring(0, charIndex - 1)))
                return [newText, newState];
            const backCoordinate = moveCursor(newText, newState.cursorCoordinate, -1);
            const textSelection = { fixed: newState.cursorCoordinate, free: backCoordinate };
            return insertText(newText, { ...newState, textSelection }, " ");
        }
        case "Backspace": {
            if (state.textSelection)
                return insertText(text, state, "");
            const backCoordinate = moveCursor(text, state.cursorCoordinate, -1);
            const textSelection = { fixed: state.cursorCoordinate, free: backCoordinate };
            return insertText(text, { ...state, textSelection }, "");
        }
        case "ArrowUp": {
            const lines = text.split("\n");
            const prevLine = lines[state.cursorCoordinate.lineIndex - 1];
            if (prevLine === undefined)
                return [text, state];
            const cursorCoordinate = {
                lineIndex: state.cursorCoordinate.lineIndex - 1,
                charIndex: Math.min(state.cursorCoordinate.charIndex, prevLine.length),
            };
            return [text, { ...state, cursorCoordinate, textSelection: undefined }];
        }
        case "ArrowDown": {
            const lines = text.split("\n");
            const nextLine = lines[state.cursorCoordinate.lineIndex + 1];
            if (nextLine === undefined)
                return [text, state];
            const cursorCoordinate = {
                lineIndex: state.cursorCoordinate.lineIndex + 1,
                charIndex: Math.min(state.cursorCoordinate.charIndex, nextLine.length),
            };
            return [text, { ...state, cursorCoordinate, textSelection: undefined }];
        }
        case "ArrowLeft": {
            const cursorCoordinate = moveCursor(text, state.cursorCoordinate, -1);
            return [text, { ...state, cursorCoordinate, textSelection: undefined }];
        }
        case "ArrowRight": {
            const cursorCoordinate = moveCursor(text, state.cursorCoordinate, 1);
            return [text, { ...state, cursorCoordinate, textSelection: undefined }];
        }
        default:
            return [text, state];
    }
}
export function handleOnMouseDown(text, state, position) {
    const cursorCoordinate = positionToCursorCoordinate(text, position);
    return [text, { ...state, cursorCoordinate, textSelection: undefined, moveCount: 1 }];
}
export function handleOnMouseMove(text, state, position) {
    if (state.moveCount == 0 || !state.cursorCoordinate)
        return [text, state];
    if (state.moveCount < Constants.moveCountThreshold) {
        return [text, { ...state, moveCount: state.moveCount + 1 }];
    }
    const cursorCoordinate = positionToCursorCoordinate(text, position);
    if (coordinatesAreEqual(cursorCoordinate, state.cursorCoordinate))
        return [text, state];
    const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
    const free = { ...cursorCoordinate };
    const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
    return [text, { ...state, cursorCoordinate, textSelection }];
}
export function handleOnMouseUp(text, state, position) {
    if (!state.cursorCoordinate || state.moveCount == 0)
        return [text, state];
    if (state.moveCount < Constants.moveCountThreshold) {
        return [text, { ...state, moveCount: 0 }];
    }
    const cursorCoordinate = positionToCursorCoordinate(text, position);
    const fixed = state.textSelection ? state.textSelection.fixed : { ...state.cursorCoordinate };
    const free = { ...cursorCoordinate };
    const textSelection = !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
    return [text, { ...state, cursorCoordinate, textSelection, moveCount: 0 }];
}
export const handleOnMouseLeave = handleOnMouseUp;
export function handleOnCompositionStart(text, state) {
    if (!state.cursorCoordinate || state.isComposing)
        return [text, state];
    const textSelection = {
        fixed: state.cursorCoordinate,
        free: moveCursor(text, state.cursorCoordinate, -1),
    };
    const [newText, newState] = insertText(text, { ...state, textSelection }, "");
    return [newText, { ...newState, isComposing: true }];
}
export function handleOnCompositionEnd(text, state, dataText) {
    if (!state.cursorCoordinate || !state.isComposing)
        return [text, state];
    const [newText, newState] = insertText(text, state, dataText);
    return [newText, { ...newState, isComposing: false }];
}
function insertText(text, state, insertedText, cursourMoveAmount = insertedText.length) {
    if (!state.cursorCoordinate)
        return [text, state];
    if (!state.textSelection) {
        const insertIndex = cursorCoordinateToTextIndex(text, state.cursorCoordinate);
        const newText = text.substring(0, insertIndex) + insertedText + text.substring(insertIndex);
        const cursorCoordinate = moveCursor(newText, state.cursorCoordinate, cursourMoveAmount);
        return [newText, { ...state, cursorCoordinate, textSelection: undefined }];
    }
    const { fixed, free } = state.textSelection;
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
    const startIndex = cursorCoordinateToTextIndex(text, start);
    const endIndex = cursorCoordinateToTextIndex(text, end);
    const newText = text.substring(0, startIndex) + insertedText + text.substring(endIndex);
    const cursorCoordinate = moveCursor(newText, start, cursourMoveAmount);
    return [newText, { ...state, cursorCoordinate, textSelection: undefined }];
}
function moveCursor(text, coordinate, amount) {
    if (amount == 0)
        return coordinate;
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
            }
            else {
                amount -= lines[lineIndex].length - charIndex + 1;
                lineIndex++;
                charIndex = 0;
            }
        }
    }
    else {
        amount = -amount;
        while (amount > 0) {
            if (lineIndex == 0) {
                charIndex -= Math.min(amount, charIndex);
                break;
            }
            if (charIndex - amount >= 0) {
                charIndex -= amount;
                amount = 0;
            }
            else {
                amount -= charIndex + 1;
                lineIndex--;
                charIndex = lines[lineIndex].length;
            }
        }
    }
    return { lineIndex, charIndex };
}
function positionToCursorCoordinate(text, position) {
    const [x, y] = position;
    const elements = document.elementsFromPoint(x, y);
    const charClassNameRegex = TextLinesConstants.char.classNameRegex;
    const charElement = elements.find((element) => charClassNameRegex.test(element.className));
    const lineClassNameRegex = TextLinesConstants.line.classNameRegex;
    const lineElement = elements.find((element) => lineClassNameRegex.test(element.className));
    const lines = text.split("\n");
    if (charElement) {
        const groups = charElement.className.match(charClassNameRegex)?.groups;
        const lineIndex = Number.parseInt(groups["lineIndex"], 10);
        const charIndex = Number.parseInt(groups["charIndex"], 10);
        return { lineIndex, charIndex };
    }
    else if (lineElement) {
        const groups = lineElement.className.match(lineClassNameRegex)?.groups;
        const lineIndex = Number.parseInt(groups["lineIndex"], 10);
        return { lineIndex, charIndex: lines[lineIndex].length };
    }
    else {
        return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
    }
}
function cursorCoordinateToTextIndex(text, coordinate) {
    const lines = text.split("\n");
    let textIndex = 0;
    for (let lineIndex = 0; lineIndex < coordinate.lineIndex; lineIndex++) {
        textIndex += lines[lineIndex].length + 1;
    }
    textIndex += coordinate.charIndex;
    return textIndex;
}
function coordinatesAreEqual(a, b) {
    return a.lineIndex == b.lineIndex && a.charIndex == b.charIndex;
}
