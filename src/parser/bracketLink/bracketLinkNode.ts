export type BracketLinkNode = {
  type: 'bracketLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export function bracketLinkNodeEquals(a: BracketLinkNode, b: BracketLinkNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}
