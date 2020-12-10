import {
  BracketLinkProps,
  HashTagProps,
  TaggedLinkProps,
  CodeProps,
  FormulaProps,
} from '../Editor/types';
import { CursorCoordinate } from '../Cursor/types';

export interface TextDecoration {
  fontSizes: Record<'level1' | 'level2' | 'level3', number>;
}

export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };

export interface Props {
  text: string;
  textDecoration?: TextDecoration;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  cursorCoordinate: CursorCoordinate | undefined;
}

export interface NodeProps {
  node: Node;
  textDecoration: TextDecoration;
  bracketLinkProps: BracketLinkProps;
  hashTagProps: HashTagProps;
  taggedLinkPropsMap: TaggedLinkPropsMap;
  codeProps: CodeProps;
  formulaProps: FormulaProps;
  cursorOn: boolean;
}

export interface CharProps {
  char: string;
  lineIndex: number;
  charIndex: number;
}

export interface DecorationStyle {
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export type Node =
  | ItemizationNode
  | BlockCodeMetaNode
  | BlockCodeLineNode
  | InlineCodeNode
  | BlockFormulaNode
  | InlineFormulaNode
  | DecorationNode
  | TaggedLinkNode
  | BracketLinkNode
  | HashTagNode
  | NormalNode;

export interface ItemizationNode {
  type: 'itemization';
  lineIndex: number;
  range: [number, number];
  indentDepth: number;
  children: Node[];
}

export interface BlockCodeMetaNode {
  type: 'blockCodeMeta';
  lineIndex: number;
  range: [number, number];
  indentDepth: number;
  meta: string;
}

export interface BlockCodeLineNode {
  type: 'blockCodeLine';
  lineIndex: number;
  range: [number, number];
  indentDepth: number;
  codeLine: string;
}

export interface InlineCodeNode {
  type: 'inlineCode';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  code: string;
  trailingMeta: string;
}

export interface BlockFormulaNode {
  type: 'blockFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
}

export interface InlineFormulaNode {
  type: 'inlineFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
}

export interface DecorationNode {
  type: 'decoration';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  children: Node[];
  trailingMeta: string;
}

export interface TaggedLinkNode {
  type: 'taggedLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  tag: string;
  linkName: string;
  trailingMeta: string;
}

export interface BracketLinkNode {
  type: 'bracketLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
}

export interface HashTagNode {
  type: 'hashTag';
  lineIndex: number;
  range: [number, number];
  hashTag: string;
}

export interface NormalNode {
  type: 'normal';
  lineIndex: number;
  range: [number, number];
  text: string;
}

export interface MultiLineContext {
  blockCodeDepth: number | undefined;
}

export interface SingleLineContext {
  lineIndex: number;
  offset: number;
  nested: boolean;
  line: boolean;
  taggedLinkRegexes: RegExp[];
}
