import { ContentNode, contentNodeToString, contentNodesEquals } from '../content/contentNode';

export type NormalLineNode = {
  type: 'normalLine';
  lineId: string;
  contentLength: number;
  children: ContentNode[];
  _lineIndex: number;
};

export function normalLineNodeEquals(a: NormalLineNode, b: NormalLineNode): boolean {
  return a.lineId === b.lineId && a.contentLength === b.contentLength && contentNodesEquals(a.children, b.children);
}

export function normalLineNodeToString(node: NormalLineNode): string {
  return node.children.map(contentNodeToString).join('');
}
