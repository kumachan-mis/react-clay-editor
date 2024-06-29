import { ContentNode, contentNodeToString, contentNodesEquals } from '../content/contentNode';

export type QuotationNode = {
  type: 'quotation';
  lineId: string;
  indent: string;
  meta: string;
  contentLength: number;
  children: ContentNode[];
  _lineIndex: number;
};

export function quotationNodeEquals(a: QuotationNode, b: QuotationNode): boolean {
  return (
    a.lineId === b.lineId &&
    a.indent === b.indent &&
    a.meta === b.meta &&
    a.contentLength === b.contentLength &&
    contentNodesEquals(a.children, b.children)
  );
}

export function quotationNodeToString(node: QuotationNode): string {
  return node.indent + node.meta + node.children.map(contentNodeToString).join('');
}
