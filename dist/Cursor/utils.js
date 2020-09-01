import { getTextLinesRoot, getTextLineElementAt, getTextCharElementAt } from "../TextLines/utils";
export function cursorPropsToState(props, state, element) {
    const rootRect = getTextLinesRoot(element)?.getBoundingClientRect();
    if (!props.coordinate || !rootRect)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(props.coordinate, element);
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
export function handleOnEditorScroll(props, state, element) {
    const rootRect = getTextLinesRoot(element)?.getBoundingClientRect();
    if (!props.coordinate || !rootRect)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const { position, cursorSize, elementCursorOn } = coordinateToCursorDrawInfo(props.coordinate, element);
    if (!elementCursorOn)
        return { ...state, position: [0, 0], cursorSize: 0 };
    return { ...state, position, cursorSize };
}
export function cursorIn(position, cursorSize, element) {
    const rootRect = getTextLinesRoot(element)?.getBoundingClientRect();
    if (!rootRect)
        return false;
    const [cursorTop] = position;
    return rootRect.top <= cursorTop && cursorTop + cursorSize <= rootRect.bottom;
}
function coordinateToCursorDrawInfo(coordinate, element) {
    const { lineIndex, charIndex } = coordinate;
    const charElement = getTextCharElementAt(lineIndex, charIndex - 1, element);
    const lineElement = getTextLineElementAt(lineIndex, element);
    if (charElement) {
        const charRect = charElement.getBoundingClientRect();
        return {
            position: [charRect.top, charRect.right],
            cursorSize: charRect.height,
            elementCursorOn: charElement,
        };
    }
    else if (lineElement) {
        const nextCharElement = getTextCharElementAt(lineIndex, charIndex, element);
        const elementCursorOn = nextCharElement?.textContent ? nextCharElement : lineElement;
        const rect = elementCursorOn.getBoundingClientRect();
        return { position: [rect.top, rect.left], cursorSize: rect.height, elementCursorOn };
    }
    return { position: [0, 0], cursorSize: 0, elementCursorOn: null };
}
