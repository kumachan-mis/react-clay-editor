import { TextNode } from '../../../../parser';

import { TextNodeVisuals, textNodeVisualsEquals } from './textNodeVisuals';

export type TextNodeProps<TTextNode extends TextNode = TextNode> = {
  node: TTextNode;
  editMode: boolean;
  linkForceClickable: boolean;
} & TextNodeVisuals;

export function createTextNodePropsEquals<TTextNode extends TextNode>(
  nodeEquals: (prevNode: TTextNode, nextNode: TTextNode) => boolean
): (prev: TextNodeProps<TTextNode>, next: TextNodeProps<TTextNode>) => boolean {
  return (prev, next) =>
    nodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    textNodeVisualsEquals(prev, next);
}
