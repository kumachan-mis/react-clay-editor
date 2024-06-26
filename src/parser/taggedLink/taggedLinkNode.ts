export type TaggedLinkNode = {
  type: 'taggedLink';
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export function taggedLinkNodeEquals(a: TaggedLinkNode, b: TaggedLinkNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}

export function taggedLinkNodeToString(node: TaggedLinkNode): string {
  return node.facingMeta + node.linkName + node.trailingMeta;
}

export function splitTag(taggedLinkNode: TaggedLinkNode): [string, string] {
  return [taggedLinkNode.facingMeta.substring(0, 1), taggedLinkNode.facingMeta.substring(1)];
}

export function getTagName(taggedLinkNode: TaggedLinkNode): string {
  return taggedLinkNode.facingMeta.substring(1, taggedLinkNode.facingMeta.length - 2);
}
