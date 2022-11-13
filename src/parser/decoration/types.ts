import { ContentNode } from '../content/types';

export type Decoration = {
  size: 'normal' | 'larger' | 'largest';
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type DecorationNode = {
  type: 'decoration';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  children: ContentNode[];
  trailingMeta: string;
  decoration: Decoration;
};
