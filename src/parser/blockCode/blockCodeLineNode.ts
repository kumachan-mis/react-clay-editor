export type BlockCodeLineNode = {
  type: 'blockCodeLine';
  lineIndex: number;
  indentDepth: number;
  codeLine: string;
};

export function blockCodeLineNodeEquals(a: BlockCodeLineNode, b: BlockCodeLineNode): boolean {
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.codeLine === b.codeLine;
}

export function blockCodeLineNodesEquals(a: BlockCodeLineNode[], b: BlockCodeLineNode[]): boolean {
  return a.length === b.length && a.every((node, index) => blockCodeLineNodeEquals(node, b[index]));
}
