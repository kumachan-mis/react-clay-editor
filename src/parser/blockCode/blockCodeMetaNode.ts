export type BlockCodeMetaNode = {
  type: 'blockCodeMeta';
  lineIndex: number;
  indentDepth: number;
  codeMeta: string;
};

export function blockCodeMetaNodeEquals(a: BlockCodeMetaNode | undefined, b: BlockCodeMetaNode | undefined): boolean {
  if (a === undefined || b === undefined) {
    return a === undefined && b === undefined;
  }
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.codeMeta === b.codeMeta;
}
