export type ParsingContext = {
  lineIndex: number;
  charIndex: number;
  nested: boolean;
  decoration: Decoration;
};

export type ParsingOptions = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkDisabled?: boolean;
  hashtagDisabled?: boolean;
  codeDisabled?: boolean;
  formulaDisabled?: boolean;
  taggedLinkRegexes?: RegExp[];
};

export type Decoration = {
  size: 'normal' | 'larger' | 'largest';
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type TextNode = BlockNode | LineNode | ContentNode;

export type BlockNode = BlockCodeNode | BlockFormulaNode;

export type BlockCodeNode = {
  type: 'blockCode';
  range: [number, number];
  facingMeta: BlockCodeMetaNode;
  children: BlockCodeLineNode[];
  trailingMeta?: BlockCodeMetaNode;
};

export type BlockFormulaNode = {
  type: 'blockFormula';
  range: [number, number];
  facingMeta: BlockFormulaMetaNode;
  children: BlockFormulaLineNode[];
  trailingMeta?: BlockFormulaMetaNode;
};

export type LineNode = BlockLineNode | PureLineNode;

export type BlockLineNode = BlockCodeMetaNode | BlockCodeLineNode | BlockFormulaMetaNode | BlockFormulaLineNode;

export type BlockCodeMetaNode = {
  type: 'blockCodeMeta';
  lineIndex: number;
  indentDepth: number;
  codeMeta: string;
};

export type BlockCodeLineNode = {
  type: 'blockCodeLine';
  lineIndex: number;
  indentDepth: number;
  codeLine: string;
};

export type BlockFormulaMetaNode = {
  type: 'blockFormulaMeta';
  lineIndex: number;
  indentDepth: number;
  formulaMeta: string;
};

export type BlockFormulaLineNode = {
  type: 'blockFormulaLine';
  lineIndex: number;
  indentDepth: number;
  formulaLine: string;
};

export type PureLineNode = QuotationNode | ItemizationNode | NormalLineNode;

export type QuotationNode = {
  type: 'quotation';
  lineIndex: number;
  indentDepth: number;
  contentLength: number;
  meta: string;
  children: ContentNode[];
};

export type ItemizationNode = {
  type: 'itemization';
  lineIndex: number;
  bullet: string;
  indentDepth: number;
  contentLength: number;
  children: ContentNode[];
};

export type NormalLineNode = {
  type: 'normalLine';
  lineIndex: number;
  contentLength: number;
  children: ContentNode[];
};

export type ContentNode = InlineCodeNode | ContentFormulaNode | DecorationNode | StyledLinkNode | TextLikeNode;

export type ContentFormulaNode = DisplayFormulaNode | InlineFormulaNode;

export type StyledLinkNode = TaggedLinkNode | BracketLinkNode | HashtagNode;

export type TextLikeNode = UrlNode | NormalNode;

export type InlineCodeNode = {
  type: 'inlineCode';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  code: string;
  trailingMeta: string;
};

export type DisplayFormulaNode = {
  type: 'displayFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};

export type InlineFormulaNode = {
  type: 'inlineFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};

export type DecorationNode = {
  type: 'decoration';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  children: ContentNode[];
  trailingMeta: string;
  decoration: Decoration;
};

export type TaggedLinkNode = {
  type: 'taggedLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export type BracketLinkNode = {
  type: 'bracketLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export type HashtagNode = {
  type: 'hashtag';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export type UrlNode = {
  type: 'url';
  lineIndex: number;
  range: [number, number];
  url: string;
};

export type NormalNode = {
  type: 'normal';
  lineIndex: number;
  range: [number, number];
  text: string;
};
