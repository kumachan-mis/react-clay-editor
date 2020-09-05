import { CursorCoordinate } from "../Cursor/types";

export interface DecorationSetting {
  fontSizes: Record<"level1" | "level2" | "level3", number>;
}

export interface Props {
  text: string;
  decoration: DecorationSetting;
  cursorCoordinate: CursorCoordinate | undefined;
}

export interface IndentProps {
  indent: string;
  content: string;
  lineIndex: number;
}

export interface ContentProps {
  indent: string;
  content: string;
  lineIndex: number;
  cursorOn: boolean;
}

export interface NodeProps {
  node: Node;
  lineIndex: number;
  cursorOn: boolean;
}

export interface ContentWithIndent {
  indent: string;
  content: string;
}

export interface DecorationStyle {
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export type Node = DecorationNode | HashTagNode | LinkNode | NormalNode;

export interface DecorationNode {
  type: "decoration";
  decoration: string;
  children: Node[];
  range: [number, number];
}

export interface LinkNode {
  type: "link";
  linkName: string;
  range: [number, number];
}

export interface HashTagNode {
  type: "hashTag";
  hashTagName: string;
  range: [number, number];
}

export interface NormalNode {
  type: "normal";
  text: string;
  range: [number, number];
}

export interface ParseOption {
  offset: number;
  nested: boolean;
}
