export type InlineCodeNode = {
  type: 'inlineCode';
  range: [number, number];
  facingMeta: string;
  code: string;
  trailingMeta: string;
};

export function inlineCodeNodeEquals(a: InlineCodeNode, b: InlineCodeNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.code === b.code &&
    a.trailingMeta === b.trailingMeta
  );
}

export function inlineCodeNodeToString(node: InlineCodeNode): string {
  return node.facingMeta + node.code + node.trailingMeta;
}
