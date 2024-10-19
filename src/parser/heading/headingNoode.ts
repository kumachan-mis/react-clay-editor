import { DecorationNode, decorationNodeEquals, decorationNodeToString } from '../decoration/decorationNode';

export type HeadingNode = {
  type: 'heading';
  lineId: string;
  contentLength: number;
  children: [DecorationNode];
  _lineIndex: number;
};

export function headingNodeEquals(a: HeadingNode, b: HeadingNode): boolean {
  return (
    a.lineId === b.lineId && a.contentLength === b.contentLength && decorationNodeEquals(a.children[0], b.children[0])
  );
}

export function headingNodeToString(node: HeadingNode): string {
  return decorationNodeToString(node.children[0]);
}
