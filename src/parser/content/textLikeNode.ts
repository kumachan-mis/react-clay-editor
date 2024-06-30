import { NormalNode, normalNodeEquals, normalNodeToString } from '../normal/normalNode';
import { TextNode } from '../text/textNode';
import { UrlNode, urlNodeEquals, urlNodeToString } from '../url/urlNode';

export type TextLikeNode = UrlNode | NormalNode;

export function isTextLikeNode(node: TextNode): node is TextLikeNode {
  return ['url', 'normal'].includes(node.type);
}

export function textLikeNodeEquals(a: TextLikeNode, b: TextLikeNode): boolean {
  if (a.type === 'url' && b.type === 'url') {
    return urlNodeEquals(a, b);
  } else if (a.type === 'normal' && b.type === 'normal') {
    return normalNodeEquals(a, b);
  }
  return false;
}

export function textLikeNodeToString(node: TextLikeNode): string {
  switch (node.type) {
    case 'url':
      return urlNodeToString(node);
    case 'normal':
      return normalNodeToString(node);
  }
}
