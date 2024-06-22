export type BlockFormulaLineNode = {
  type: 'blockFormulaLine';
  lineIndex: number;
  indentDepth: number;
  formulaLine: string;
};

export function blockFormulaLineNodeEquals(a: BlockFormulaLineNode, b: BlockFormulaLineNode): boolean {
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.formulaLine === b.formulaLine;
}

export function blockFormulaLineNodesEquals(a: BlockFormulaLineNode[], b: BlockFormulaLineNode[]): boolean {
  return a.length === b.length && a.every((node, index) => blockFormulaLineNodeEquals(node, b[index]));
}
