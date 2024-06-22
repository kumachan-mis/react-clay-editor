import { DecorationNode, decorationNodeEquals } from '../decoration/decorationNode';
import { InlineCodeNode, inlineCodeNodeEquals } from '../inlineCode/inlineCodeNode';
import { TextNode } from '../text/textNode';

import { ContentFormulaNode, contentFormulaNodeEquals, isContentFormulaNode } from './contentFormulaNode';
import { StyledLinkNode, isStyledLinkNode, styledLinkNodeEquals } from './styledLinkNode';
import { TextLikeNode, isTextLikeNode, textLikeNodeEquals } from './textLikeNode';

export type ContentNode = InlineCodeNode | ContentFormulaNode | DecorationNode | StyledLinkNode | TextLikeNode;

export function isContentNode(node: TextNode): node is ContentNode {
  return (
    node.type === 'inlineCode' ||
    isContentFormulaNode(node) ||
    node.type === 'decoration' ||
    isStyledLinkNode(node) ||
    isTextLikeNode(node)
  );
}

export function contentNodeEquals(a: ContentNode, b: ContentNode): boolean {
  if (a.type === 'inlineCode' && b.type === 'inlineCode') {
    return inlineCodeNodeEquals(a, b);
  } else if (isContentFormulaNode(a) && isContentFormulaNode(b)) {
    return contentFormulaNodeEquals(a, b);
  } else if (a.type === 'decoration' && b.type === 'decoration') {
    return decorationNodeEquals(a, b);
  } else if (isStyledLinkNode(a) && isStyledLinkNode(b)) {
    return styledLinkNodeEquals(a, b);
  } else if (isTextLikeNode(a) && isTextLikeNode(b)) {
    return textLikeNodeEquals(a, b);
  }
  return false;
}

export function contentNodesEquals(a: ContentNode[], b: ContentNode[]): boolean {
  return a.length === b.length && a.every((node, index) => contentNodeEquals(node, b[index]));
}
