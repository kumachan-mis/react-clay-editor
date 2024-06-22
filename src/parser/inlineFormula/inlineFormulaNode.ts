export type InlineFormulaNode = {
  type: 'inlineFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};

export function inlineFormulaNodeEquals(a: InlineFormulaNode, b: InlineFormulaNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.formula === b.formula &&
    a.trailingMeta === b.trailingMeta
  );
}
