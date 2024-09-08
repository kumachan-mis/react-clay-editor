import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { InlineFormulaNode } from './inlineFormulaNode';

export const inlineFormulaRegex = /^(?<left>.*?)\$(?<formula>[^$]+)\$(?<right>.*)$/;

export function parseInlineFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, formula, right } = inlineFormulaRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: InlineFormulaNode = {
    type: 'inlineFormula',
    range: [first, last],
    facingMeta: '$',
    formula,
    trailingMeta: '$',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
