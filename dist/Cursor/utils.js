import { TextLinesConstants } from "../TextLines/constants";
export function cursorPropsToState(props, state) {
    const rootId = TextLinesConstants.id;
    const rootRect = document.getElementById(rootId)?.getBoundingClientRect();
    if (!props.coordinate || !rootRect)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(props.coordinate);
    if (!elementCursorOn)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const [cursorTop] = position;
    if (cursorTop - rootRect.top < 0) {
        elementCursorOn.scrollIntoView(true);
        return state;
    }
    else if (cursorTop + cursorSize > rootRect.bottom) {
        elementCursorOn.scrollIntoView(false);
        return state;
    }
    return { ...state, position, cursorSize };
}
export function handleOnEditorScroll(props, state) {
    const rootId = TextLinesConstants.id;
    const rootRect = document.getElementById(rootId)?.getBoundingClientRect();
    if (!props.coordinate || !rootRect)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(props.coordinate);
    if (!elementCursorOn)
        return { ...state, position: [0, 0], cursorSize: 0 };
    return { ...state, position, cursorSize };
}
export function cursorIn(position, cursorSize) {
    const rootId = TextLinesConstants.id;
    const rootRect = document.getElementById(rootId)?.getBoundingClientRect();
    if (!rootRect)
        return false;
    const [cursorTop] = position;
    return rootRect.top <= cursorTop && cursorTop + cursorSize <= rootRect.bottom;
}
function coordinateToCursorDrawInfo(coordinate) {
    const { lineIndex, charIndex } = coordinate;
    const charId = TextLinesConstants.char.id(lineIndex, charIndex - 1);
    const charElement = document.getElementById(charId);
    const lineId = TextLinesConstants.line.id(lineIndex);
    const lineElement = document.getElementById(lineId);
    if (charElement) {
        const charRect = charElement.getBoundingClientRect();
        return {
            position: [charRect.top, charRect.right],
            cursorSize: charRect.height,
            elementCursorOn: charElement,
        };
    }
    else if (lineElement) {
        const nextCharId = TextLinesConstants.char.id(lineIndex, charIndex);
        const nextCharElement = document.getElementById(nextCharId);
        const element = nextCharElement?.textContent ? nextCharElement : lineElement;
        const rect = element.getBoundingClientRect();
        return { position: [rect.top, rect.left], cursorSize: rect.height, elementCursorOn: element };
    }
    return { position: [0, 0], cursorSize: 0, elementCursorOn: null };
}
