export type Node = LineNode | ContentNode;

export type LineNode =
  | BlockCodeNode
  | BlockFormulaNode
  | BlockCodeMetaNode
  | BlockCodeLineNode
  | BlockFormulaMetaNode
  | BlockFormulaLineNode
  | QuotationNode
  | ItemizationNode;

export interface BlockCodeNode {
  type: 'blockCode';
  facingMeta: BlockCodeMetaNode;
  children: BlockCodeLineNode[];
  trailingMeta?: BlockCodeMetaNode;
}

export interface BlockFormulaNode {
  type: 'blockFormula';
  facingMeta: BlockFormulaMetaNode;
  children: BlockFormulaLineNode[];
  trailingMeta?: BlockFormulaMetaNode;
}

export interface BlockCodeMetaNode {
  type: 'blockCodeMeta';
  lineIndex: number;
  indentDepth: number;
  codeMeta: string;
}

export interface BlockCodeLineNode {
  type: 'blockCodeLine';
  lineIndex: number;
  indentDepth: number;
  codeLine: string;
}

export interface BlockFormulaMetaNode {
  type: 'blockFormulaMeta';
  lineIndex: number;
  indentDepth: number;
  formulaMeta: string;
}

export interface BlockFormulaLineNode {
  type: 'blockFormulaLine';
  lineIndex: number;
  indentDepth: number;
  formulaLine: string;
}

export interface QuotationNode {
  type: 'quotation';
  lineIndex: number;
  indentDepth: number;
  contentLength: number;
  meta: string;
  children: ContentNode[];
}

export interface ItemizationNode {
  type: 'itemization';
  lineIndex: number;
  indentDepth: number;
  contentLength: number;
  children: ContentNode[];
}

export type ContentNode =
  | InlineCodeNode
  | DisplayFormulaNode
  | InlineFormulaNode
  | DecorationNode
  | TaggedLinkNode
  | BracketLinkNode
  | HashTagNode
  | NormalNode;

export interface InlineCodeNode {
  type: 'inlineCode';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  code: string;
  trailingMeta: string;
}

export interface DisplayFormulaNode {
  type: 'displayFormula';
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
  decoration: string;
  children: ContentNode[];
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
