export type BlockFormulaMetaNode = {
  type: 'blockFormulaMeta';
  lineIndex: number;
  indentDepth: number;
  formulaMeta: string;
};

export function blockFormulaMetaNodeEquals(
  a: BlockFormulaMetaNode | undefined,
  b: BlockFormulaMetaNode | undefined
): boolean {
  if (a === undefined || b === undefined) {
    return a === undefined && b === undefined;
  }
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.formulaMeta === b.formulaMeta;
}
