import { ItemizationNode, itemizationNodeEquals } from '../itemization/itemizationNode';
import { NormalLineNode, normalLineNodeEquals } from '../normalLine/normalLineNode';
import { QuotationNode, quotationNodeEquals } from '../quotation/quotationNode';
import { TextNode } from '../text/textNode';

export type PureLineNode = QuotationNode | ItemizationNode | NormalLineNode;

export function isPureLineNode(node: TextNode): node is PureLineNode {
  return ['quotation', 'itemization', 'normalLine'].includes(node.type);
}

export function pureLineNodeEquals(a: PureLineNode, b: PureLineNode): boolean {
  if (a.type === 'quotation' && b.type === 'quotation') {
    return quotationNodeEquals(a, b);
  } else if (a.type === 'itemization' && b.type === 'itemization') {
    return itemizationNodeEquals(a, b);
  } else if (a.type === 'normalLine' && b.type === 'normalLine') {
    return normalLineNodeEquals(a, b);
  }
  return false;
}
