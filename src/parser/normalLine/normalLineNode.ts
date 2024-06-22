import { ContentNode, contentNodesEquals } from '../content/contentNode';

export type NormalLineNode = {
  type: 'normalLine';
  lineIndex: number;
  contentLength: number;
  children: ContentNode[];
};

export function normalLineNodeEquals(a: NormalLineNode, b: NormalLineNode): boolean {
  return (
    a.lineIndex === b.lineIndex && a.contentLength === b.contentLength && contentNodesEquals(a.children, b.children)
  );
}
