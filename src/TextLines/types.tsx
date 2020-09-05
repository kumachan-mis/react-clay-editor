import { CursorCoordinate } from "../Cursor/types";

export interface DecorationSetting {
  fontSizes: Record<"level1" | "level2" | "level3", number>;
}

export interface Props {
  text: string;
  decoration: DecorationSetting;
  linkProps: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  hashTagProps: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
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
  range: [number, number];
  facingMeta: string;
  children: Node[];
  trailingMeta: string;
}

export interface LinkNode {
  type: "link";
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
}

export interface HashTagNode {
  type: "hashTag";
  range: [number, number];
  hashTag: string;
}

export interface NormalNode {
  type: "normal";
  range: [number, number];
  text: string;
}

export interface ParseOption {
  offset: number;
  nested: boolean;
}
