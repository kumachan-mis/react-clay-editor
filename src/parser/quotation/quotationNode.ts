import { ContentNode, contentNodesEquals } from '../content/contentNode';

export type QuotationNode = {
  type: 'quotation';
  lineIndex: number;
  indentDepth: number;
  contentLength: number;
  meta: string;
  children: ContentNode[];
};

export function quotationNodeEquals(a: QuotationNode, b: QuotationNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.indentDepth === b.indentDepth &&
    a.contentLength === b.contentLength &&
    a.meta === b.meta &&
    contentNodesEquals(a.children, b.children)
  );
}
