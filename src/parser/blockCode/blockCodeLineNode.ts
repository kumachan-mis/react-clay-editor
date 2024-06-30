export type BlockCodeLineNode = {
  type: 'blockCodeLine';
  lineId: string;
  indent: string;
  codeLine: string;
  _lineIndex: number;
};

export function blockCodeLineNodeEquals(a: BlockCodeLineNode, b: BlockCodeLineNode): boolean {
  return a.lineId === b.lineId && a.indent === b.indent && a.codeLine === b.codeLine;
}

export function blockCodeLineNodeToString(node: BlockCodeLineNode): string {
  return node.indent + node.codeLine;
}

export function blockCodeLineNodesEquals(a: BlockCodeLineNode[], b: BlockCodeLineNode[]): boolean {
  return a.length === b.length && a.every((node, index) => blockCodeLineNodeEquals(node, b[index]));
}
