import { ContentNode } from '../content/types';

export type DecorationConfig = {
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
  config: DecorationConfig;
};
