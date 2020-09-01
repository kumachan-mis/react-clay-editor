import { TextLinesConstants } from "../TextLines/constants";
export function cursorPropsToState(props, state) {
    const rootId = TextLinesConstants.id;
    const rootRect = document.getElementById(rootId)?.getBoundingClientRect();
    if (!props.coordinate || !rootRect)
        return { ...state, position: [0, 0], cursorSize: 0 };
    const { lineIndex, charIndex } = props.coordinate;
    const charId = TextLinesConstants.char.id(lineIndex, charIndex - 1);
    const charElement = document.getElementById(charId);
    const lineId = TextLinesConstants.line.id(lineIndex);
    const lineElement = document.getElementById(lineId);
    if (charElement) {
        let charRect = charElement.getBoundingClientRect();
        if (charRect.top - rootRect.top < 0)
            charElement.scrollIntoView(true);
        else if (charRect.bottom - rootRect.top > rootRect.height)
            charElement.scrollIntoView(false);
        charRect = charElement.getBoundingClientRect();
        return { ...state, position: [charRect.top, charRect.right], cursorSize: charRect.height };
    }
    else if (lineElement) {
        const nextCharId = TextLinesConstants.char.id(lineIndex, charIndex);
        const nextCharElement = document.getElementById(nextCharId);
        const element = nextCharElement?.textContent ? nextCharElement : lineElement;
        let rect = element.getBoundingClientRect();
        if (rect.top - rootRect.top < 0)
            element.scrollIntoView(true);
        else if (rect.bottom - rootRect.top > rootRect.height)
            element.scrollIntoView(false);
        rect = element.getBoundingClientRect();
        return { ...state, position: [rect.top, rect.left], cursorSize: rect.height };
    }
    else {
        return { ...state, position: [0, 0], cursorSize: 0 };
    }
}
