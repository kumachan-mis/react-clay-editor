import { BracketLinkProps, HashTagProps, TaggedLinkProps } from "../Editor/types";
import { CursorCoordinate } from "../Cursor/types";

export interface TextDecoration {
  fontSizes: Record<"level1" | "level2" | "level3", number>;
}

export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };

export interface Props {
  text: string;
  textDecoration: TextDecoration;
  bracketLinkProps: BracketLinkProps;
  hashTagProps: HashTagProps;
  taggedLinkPropsMap: TaggedLinkPropsMap;
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

export type Node = DecorationNode | TaggedLinkNode | BracketLinkNode | HashTagNode | NormalNode;

export interface DecorationNode {
  type: "decoration";
  range: [number, number];
  facingMeta: string;
  children: Node[];
  trailingMeta: string;
}

export interface TaggedLinkNode {
  type: "taggedLink";
  range: [number, number];
  facingMeta: string;
  tag: string;
  linkName: string;
  trailingMeta: string;
}

export interface BracketLinkNode {
  type: "bracketLink";
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
  taggedLinkRegexes: RegExp[];
}
