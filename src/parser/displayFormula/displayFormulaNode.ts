export type DisplayFormulaNode = {
  type: 'displayFormula';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};

export function displayFormulaNodeEquals(a: DisplayFormulaNode, b: DisplayFormulaNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.formula === b.formula &&
    a.trailingMeta === b.trailingMeta
  );
}
