export type BlockCodeMetaNode = {
  type: 'blockCodeMeta';
  lineIndex: number;
  indentDepth: number;
  codeMeta: string;
};

export function optinalBlockCodeMetaNodeEquals(
  a: BlockCodeMetaNode | undefined,
  b: BlockCodeMetaNode | undefined
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  return blockCodeMetaNodeEquals(a, b);
}

export function blockCodeMetaNodeEquals(a: BlockCodeMetaNode, b: BlockCodeMetaNode): boolean {
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.codeMeta === b.codeMeta;
}
