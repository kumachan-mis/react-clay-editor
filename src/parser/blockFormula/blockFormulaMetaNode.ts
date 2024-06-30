export type BlockFormulaMetaNode = {
  type: 'blockFormulaMeta';
  lineId: string;
  indent: string;
  formulaMeta: string;
  _lineIndex: number;
};

export function optinalBlockFormulaMetaNodeEquals(
  a: BlockFormulaMetaNode | undefined,
  b: BlockFormulaMetaNode | undefined
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  return blockFormulaMetaNodeEquals(a, b);
}

export function blockFormulaMetaNodeToString(node: BlockFormulaMetaNode): string {
  return node.indent + node.formulaMeta;
}

export function blockFormulaMetaNodeEquals(a: BlockFormulaMetaNode, b: BlockFormulaMetaNode): boolean {
  return a.lineId === b.lineId && a.indent === b.indent && a.formulaMeta === b.formulaMeta;
}
