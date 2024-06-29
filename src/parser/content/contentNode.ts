import { DecorationNode, decorationNodeEquals, decorationNodeToString } from '../decoration/decorationNode';
import { InlineCodeNode, inlineCodeNodeEquals, inlineCodeNodeToString } from '../inlineCode/inlineCodeNode';
import { TextNode } from '../text/textNode';

import {
  ContentFormulaNode,
  contentFormulaNodeEquals,
  contentFormulaNodeToString,
  isContentFormulaNode,
} from './contentFormulaNode';
import { StyledLinkNode, isStyledLinkNode, styledLinkNodeEquals, styledLinkNodeToString } from './styledLinkNode';
import { TextLikeNode, isTextLikeNode, textLikeNodeEquals, textLikeNodeToString } from './textLikeNode';

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

export function contentNodeToString(node: ContentNode): string {
  if (node.type === 'inlineCode') {
    return inlineCodeNodeToString(node);
  } else if (isContentFormulaNode(node)) {
    return contentFormulaNodeToString(node);
  } else if (node.type === 'decoration') {
    return decorationNodeToString(node);
  } else if (isStyledLinkNode(node)) {
    return styledLinkNodeToString(node);
  } else if (isTextLikeNode(node)) {
    return textLikeNodeToString(node);
  }
  return '';
}

export function contentNodesEquals(a: ContentNode[], b: ContentNode[]): boolean {
  return a.length === b.length && a.every((node, index) => contentNodeEquals(node, b[index]));
}
