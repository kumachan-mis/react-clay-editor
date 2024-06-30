import { ContentNode, contentNodeToString, contentNodesEquals } from '../content/contentNode';

export type ItemizationNode = {
  type: 'itemization';
  lineId: string;
  indent: string;
  bullet: string;
  contentLength: number;
  children: ContentNode[];
  _lineIndex: number;
};

export function itemizationNodeEquals(a: ItemizationNode, b: ItemizationNode): boolean {
  return (
    a.lineId === b.lineId &&
    a.indent === b.indent &&
    a.bullet === b.bullet &&
    a.contentLength === b.contentLength &&
    contentNodesEquals(a.children, b.children)
  );
}

export function itemizationNodeToString(node: ItemizationNode): string {
  return node.indent + node.bullet + node.children.map(contentNodeToString).join('');
}
