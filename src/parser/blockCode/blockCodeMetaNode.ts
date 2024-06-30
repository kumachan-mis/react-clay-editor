export type BlockCodeMetaNode = {
  type: 'blockCodeMeta';
  lineId: string;
  indent: string;
  codeMeta: string;
  _lineIndex: number;
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
  return a.lineId === b.lineId && a.indent === b.indent && a.codeMeta === b.codeMeta;
}

export function blockCodeMetaNodeToString(node: BlockCodeMetaNode): string {
  return node.indent + node.codeMeta;
}
