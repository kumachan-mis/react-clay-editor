import { ContentNode, contentNodesEquals } from '../content/contentNode';

import { DecorationConfig } from './decorationConfig';

export type DecorationNode = {
  type: 'decoration';
  lineIndex: number;
  range: [number, number];
  facingMeta: string;
  children: ContentNode[];
  trailingMeta: string;
  config: DecorationConfig;
};

export function decorationNodeEquals(a: DecorationNode, b: DecorationNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    contentNodesEquals(a.children, b.children) &&
    a.trailingMeta === b.trailingMeta &&
    a.config === b.config
  );
}
