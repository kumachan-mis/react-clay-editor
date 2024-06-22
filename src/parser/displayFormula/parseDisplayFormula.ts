import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { DisplayFormulaNode } from './displayFormulaNode';

export const displayFormulaRegex = /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/;

export function parseDisplayFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, formula, right } = text.match(displayFormulaRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DisplayFormulaNode = {
    type: 'displayFormula',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '$$',
    formula,
    trailingMeta: '$$',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
