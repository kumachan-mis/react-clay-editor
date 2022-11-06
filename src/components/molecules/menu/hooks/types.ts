export type ContentPosition =
  | ContentPositionEmpty
  | ContentPositionLeftEnd
  | ContentPositionRightEnd
  | ContentPositionBetween
  | ContentPositionInner
  | ContentPositionNested;

export type ContentPositionEndPoint =
  | ContentPositionEmpty
  | ContentPositionLeftEnd
  | ContentPositionRightEnd
  | ContentPositionBetween;

export type ContentPositionEmpty = {
  type: 'empty';
  lineIndex: number;
};

export type ContentPositionLeftEnd = {
  type: 'leftend';
  lineIndex: number;
  contentIndexes: [number];
};

export type ContentPositionRightEnd = {
  type: 'rightend';
  lineIndex: number;
  contentIndexes: [number];
};

export type ContentPositionBetween = {
  type: 'between';
  lineIndex: number;
  contentIndexes: [number, number];
};

export type ContentPositionInner = {
  type: 'inner';
  lineIndex: number;
  contentIndexes: [number];
};

export type ContentPositionNested = {
  type: 'nested';
  lineIndex: number;
  contentIndexes: [number];
  childPosition: Exclude<ContentPosition, ContentPositionEmpty | ContentPositionNested>;
};

export type BlockPosition = {
  blockIndex: number;
};
