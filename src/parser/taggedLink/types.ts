export type TaggedLinkNode = {
  type: 'taggedLink';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};
