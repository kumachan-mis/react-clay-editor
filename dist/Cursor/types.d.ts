export interface CursorCoordinate {
    lineIndex: number;
    charIndex: number;
}
export interface Props {
    coordinate: CursorCoordinate | undefined;
    onTextCompositionStart: () => void;
    onTextCompositionEnd: (dataText: string) => void;
}
export interface State {
    position: [number, number];
    cursorSize: number;
    textAreaValue: string;
}
