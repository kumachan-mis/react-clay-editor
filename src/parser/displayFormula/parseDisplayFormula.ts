import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { CONTENT_LIMIT, parseContent } from '../content/parseContent';
import { parseNormal } from '../normal/parseNormal';

import { DisplayFormulaNode } from './displayFormulaNode';

export const displayFormulaRegex = /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/;

export function parseDisplayFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  if (text.length > CONTENT_LIMIT) {
    return parseNormal(text, context);
  }

  const { left, formula, right } = displayFormulaRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DisplayFormulaNode = {
    type: 'displayFormula',
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
