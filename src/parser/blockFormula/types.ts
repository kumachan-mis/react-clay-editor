export type BlockFormulaNode = {
  type: 'blockFormula';
  range: [number, number];
  facingMeta: BlockFormulaMetaNode;
  children: BlockFormulaLineNode[];
  trailingMeta?: BlockFormulaMetaNode;
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
