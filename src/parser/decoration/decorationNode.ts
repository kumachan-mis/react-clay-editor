import { ContentNode, contentNodeToString, contentNodesEquals } from '../content/contentNode';

import { DecorationConfig, decorationConfigEquals } from './decorationConfig';

export type DecorationNode = {
  type: 'decoration';
  range: [number, number];
  facingMeta: string;
  children: ContentNode[];
  trailingMeta: string;
  config: DecorationConfig;
};

export function decorationNodeEquals(a: DecorationNode, b: DecorationNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    contentNodesEquals(a.children, b.children) &&
    a.trailingMeta === b.trailingMeta &&
    decorationConfigEquals(a.config, b.config)
  );
}

export function decorationNodeToString(node: DecorationNode): string {
  return node.facingMeta + node.children.map(contentNodeToString).join('') + node.trailingMeta;
}
