export type NormalNode = {
  type: 'normal';
  range: [number, number];
  text: string;
};

export function normalNodeEquals(a: NormalNode, b: NormalNode): boolean {
  return a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.text === b.text;
}

export function normalNodeToString(node: NormalNode): string {
  return node.text;
}
