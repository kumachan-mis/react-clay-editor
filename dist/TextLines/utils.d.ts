import { TextStyle, TextWithFont, LineWithIndent } from "./types";
export declare function analyzeLine(line: string): LineWithIndent;
export declare function analyzeFontOfContent(content: string, textStyle: TextStyle): TextWithFont[];
export declare function getTextLinesRoot(element: HTMLElement): HTMLElement | null;
export declare function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null;
export declare function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null;
