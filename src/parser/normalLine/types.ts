import { ContentNode } from '../content/types';

export type NormalLineNode = {
  type: 'normalLine';
  lineIndex: number;
  contentLength: number;
  children: ContentNode[];
};
