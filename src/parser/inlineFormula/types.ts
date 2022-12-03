export type InlineFormulaNode = {
  type: 'inlineFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};
