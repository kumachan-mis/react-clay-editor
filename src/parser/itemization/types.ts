import { ContentNode } from '../content/types';

export type ItemizationNode = {
  type: 'itemization';
  lineIndex: number;
  bullet: string;
  indentDepth: number;
  contentLength: number;
  children: ContentNode[];
};
