import { TextStyle, TextWithFont, LineWithIndent } from "./types";
export declare function analyzeLine(line: string): LineWithIndent;
export declare function analyzeFontOfContent(content: string, textStyle: TextStyle): TextWithFont[];
