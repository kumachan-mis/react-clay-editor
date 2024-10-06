import { ContentNode, contentNodesEquals, contentNodeToString } from '../content/contentNode';

export type HeadingNode = {
  type: 'heading';
  lineId: string;
  contentLength: number;
  facingMeta: string;
  children: ContentNode[];
  trailingMeta: string;
  level: 'normal' | 'larger' | 'largest';
  _lineIndex: number;
};

export function headingNodeEquals(a: HeadingNode, b: HeadingNode): boolean {
  return (
    a.lineId === b.lineId &&
    a.contentLength === b.contentLength &&
    a.facingMeta === b.facingMeta &&
    contentNodesEquals(a.children, b.children) &&
    a.trailingMeta === b.trailingMeta &&
    a.level === b.level
  );
}

export function headingNodeToString(node: HeadingNode): string {
  return node.facingMeta + node.children.map(contentNodeToString).join('') + node.trailingMeta;
}
