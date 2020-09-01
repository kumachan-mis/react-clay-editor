import { CursorCoordinate } from "../Cursor/types";

export interface TextStyle {
  fontSizes: Record<"level1" | "level2" | "level3", number>;
}

export interface Props {
  text: string;
  textStyle: TextStyle;
  cursorCoordinate: CursorCoordinate | undefined;
}

export interface TextLineProps {
  indent: string;
  content: string;
  lineIndex: number;
}

export interface LineWithIndent {
  indent: string;
  content: string;
}

export interface TextWithFont {
  text: string;
  offset: number;
  section: [number, number];
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
