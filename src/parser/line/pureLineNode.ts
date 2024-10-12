import { HeadingNode, headingNodeEquals, headingNodeToString } from '../heading/headingNoode';
import { ItemizationNode, itemizationNodeEquals, itemizationNodeToString } from '../itemization/itemizationNode';
import { NormalLineNode, normalLineNodeEquals, normalLineNodeToString } from '../normalLine/normalLineNode';
import { QuotationNode, quotationNodeEquals, quotationNodeToString } from '../quotation/quotationNode';
import { TextNode } from '../text/textNode';

export type PureLineNode = HeadingNode | QuotationNode | ItemizationNode | NormalLineNode;

export function isPureLineNode(node: TextNode): node is PureLineNode {
  return ['heading', 'quotation', 'itemization', 'normalLine'].includes(node.type);
}

export function pureLineNodeEquals(a: PureLineNode, b: PureLineNode): boolean {
  if (a.type === 'heading' && b.type === 'heading') {
    return headingNodeEquals(a, b);
  } else if (a.type === 'quotation' && b.type === 'quotation') {
    return quotationNodeEquals(a, b);
  } else if (a.type === 'itemization' && b.type === 'itemization') {
    return itemizationNodeEquals(a, b);
  } else if (a.type === 'normalLine' && b.type === 'normalLine') {
    return normalLineNodeEquals(a, b);
  }
  return false;
}

export function pureLineNodeToString(node: PureLineNode): string {
  switch (node.type) {
    case 'heading':
      return headingNodeToString(node);
    case 'quotation':
      return quotationNodeToString(node);
    case 'itemization':
      return itemizationNodeToString(node);
    case 'normalLine':
      return normalLineNodeToString(node);
  }
}
