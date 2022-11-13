export type HashtagNode = {
  type: 'hashtag';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  linkName: string;
  trailingMeta: string;
};
