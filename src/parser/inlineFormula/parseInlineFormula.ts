import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { InlineFormulaNode } from './types';

export const inlineFormulaRegex = /^(?<left>.*?)\$(?<formula>[^$]+)\$(?<right>.*)$/;

export function parseInlineFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, formula, right } = text.match(inlineFormulaRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: InlineFormulaNode = {
    type: 'inlineFormula',
    lineIndex: context.lineIndex,
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
