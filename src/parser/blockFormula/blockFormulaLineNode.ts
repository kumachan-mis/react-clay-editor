export type BlockFormulaLineNode = {
  type: 'blockFormulaLine';
  lineId: string;
  indent: string;
  formulaLine: string;
  _lineIndex: number;
};

export function blockFormulaLineNodeEquals(a: BlockFormulaLineNode, b: BlockFormulaLineNode): boolean {
  return a.lineId === b.lineId && a.indent === b.indent && a.formulaLine === b.formulaLine;
}

export function blockFormulaLineNodeToString(node: BlockFormulaLineNode): string {
  return node.indent + node.formulaLine;
}

export function blockFormulaLineNodesEquals(a: BlockFormulaLineNode[], b: BlockFormulaLineNode[]): boolean {
  return a.length === b.length && a.every((node, index) => blockFormulaLineNodeEquals(node, b[index]));
}
