export type InlineFormulaNode = {
  type: 'inlineFormula';
  range: [number, number];
  facingMeta: string;
  formula: string;
  trailingMeta: string;
};

export function inlineFormulaNodeEquals(a: InlineFormulaNode, b: InlineFormulaNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.formula === b.formula &&
    a.trailingMeta === b.trailingMeta
  );
}

export function inlineFormulaNodeToString(node: InlineFormulaNode): string {
  return node.facingMeta + node.formula + node.trailingMeta;
}
