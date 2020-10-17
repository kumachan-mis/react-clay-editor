import { BracketLinkProps, HashTagProps, TaggedLinkProps, FormulaProps } from "../Editor/types";
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
  formulaProps: FormulaProps;
  cursorCoordinate: CursorCoordinate | undefined;
}

export interface IndentProps extends Props {
  indent: string;
  content: string;
  lineIndex: number;
}

export interface ContentProps extends Props {
  indent: string;
  content: string;
  lineIndex: number;
}

export interface NodeProps extends Props {
  node: Node;
  lineIndex: number;
}

export interface CharProps {
  lineIndex: number;
  charIndex: number;
  char: string;
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

export type Node =
  | DecorationNode
  | TaggedLinkNode
  | BracketLinkNode
  | DisplayFormulaNode
  | InlineFormulaNode
  | HashTagNode
  | NormalNode;

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

export interface DisplayFormulaNode {
  type: "displayFormula";
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
}

export interface InlineFormulaNode {
  type: "inlineFormula";
  range: [number, number];
  facingMeta: string;
  formula: string;
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
