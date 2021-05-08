import { parseBlockCode, parseBlockFormula, parseQuotation, parseItemization } from './parseLine';
import { LineNode, ParsingContext, ParsingOptions } from './types';
import { TextLinesConstants } from '../constants';

export function parseText(text: string, options: ParsingOptions): LineNode[] {
  const { blockCodeMeta, blockFormulaMeta, quotation, itemization } = TextLinesConstants.regexes;

  const lines = text.split('\n');
  const nodes: LineNode[] = [];
  const context: ParsingContext = { lineIndex: 0, charIndex: 0, nested: false };

  while (context.lineIndex < lines.length) {
    const line = lines[context.lineIndex];
    if (!options.disabledMap.code && blockCodeMeta.test(line)) {
      nodes.push(parseBlockCode(lines, context));
    } else if (!options.disabledMap.formula && blockFormulaMeta.test(line)) {
      nodes.push(parseBlockFormula(lines, context));
    } else if (quotation.test(line)) {
      nodes.push(parseQuotation(line, context, options));
    } else if (itemization.test(line)) {
      nodes.push(parseItemization(line, context, options));
    }
  }

  return nodes;
}
