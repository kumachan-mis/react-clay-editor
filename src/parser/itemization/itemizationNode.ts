import { ContentNode, contentNodesEquals } from '../content/contentNode';

export type ItemizationNode = {
  type: 'itemization';
  lineIndex: number;
  bullet: string;
  indentDepth: number;
  contentLength: number;
  children: ContentNode[];
};

export function itemizationNodeEquals(a: ItemizationNode, b: ItemizationNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.bullet === b.bullet &&
    a.indentDepth === b.indentDepth &&
    a.contentLength === b.contentLength &&
    contentNodesEquals(a.children, b.children)
  );
}
