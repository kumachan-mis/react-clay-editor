import { ContentNode } from '../content/types';

export type QuotationNode = {
  type: 'quotation';
  lineIndex: number;
  indentDepth: number;
  contentLength: number;
  meta: string;
  children: ContentNode[];
};
