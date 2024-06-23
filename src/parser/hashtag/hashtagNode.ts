export type HashtagNode = {
  type: 'hashtag';
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};

export function hashtagNodeEquals(a: HashtagNode, b: HashtagNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}

export function getHashtagName(hashtagNode: HashtagNode): string {
  return hashtagNode.linkName.replaceAll('_', ' ');
}
