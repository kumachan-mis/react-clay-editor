import {
  DisplayFormulaNode,
  displayFormulaNodeEquals,
  displayFormulaNodeToString,
} from '../displayFormula/displayFormulaNode';
import {
  InlineFormulaNode,
  inlineFormulaNodeEquals,
  inlineFormulaNodeToString,
} from '../inlineFormula/inlineFormulaNode';
import { TextNode } from '../text/textNode';

export type ContentFormulaNode = DisplayFormulaNode | InlineFormulaNode;

export function isContentFormulaNode(node: TextNode): node is ContentFormulaNode {
  return ['displayFormula', 'inlineFormula'].includes(node.type);
}

export function contentFormulaNodeEquals(a: ContentFormulaNode, b: ContentFormulaNode): boolean {
  if (a.type === 'inlineFormula' && b.type === 'inlineFormula') {
    return inlineFormulaNodeEquals(a, b);
  } else if (a.type === 'displayFormula' && b.type === 'displayFormula') {
    return displayFormulaNodeEquals(a, b);
  }
  return false;
}

export function contentFormulaNodeToString(node: ContentFormulaNode): string {
  switch (node.type) {
    case 'inlineFormula':
      return inlineFormulaNodeToString(node);
    case 'displayFormula':
      return displayFormulaNodeToString(node);
  }
}
