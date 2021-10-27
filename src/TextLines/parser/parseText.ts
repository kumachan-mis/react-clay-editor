import { TextLinesConstants } from '../constants';

import {
  parseBlockCode,
  parseBlockFormula,
  parseHeading,
  parseQuotation,
  parseBracketItemization,
  parseMarkdownItemization,
  parseNormalLine,
} from './parseLine';
import { LineNode, ParsingContext, ParsingOptions } from './types';

export function parseText(text: string, options: ParsingOptions): LineNode[] {
  const { blockCodeMeta, blockFormulaMeta, quotation } = TextLinesConstants.regexes.common;
  const lines = text.split('\n');
  const nodes: LineNode[] = [];
  const context: ParsingContext = {
    lineIndex: 0,
    charIndex: 0,
    nested: false,
    decoration: { fontlevel: 'normal', bold: false, italic: false, underline: false },
  };

  if (options.syntax === 'bracket') {
    // bracket syntax
    const { itemization } = TextLinesConstants.regexes.bracketSyntax;
    while (context.lineIndex < lines.length) {
      const line = lines[context.lineIndex];
      if (!options.disabledMap.code && blockCodeMeta.test(line)) {
        nodes.push(parseBlockCode(lines, context));
      } else if (!options.disabledMap.formula && blockFormulaMeta.test(line)) {
        nodes.push(parseBlockFormula(lines, context));
      } else if (quotation.test(line)) {
        nodes.push(parseQuotation(line, context, options));
      } else if (itemization.test(line)) {
        nodes.push(parseBracketItemization(line, context, options));
      } else {
        nodes.push(parseNormalLine(line, context, options));
      }
    }
  } else {
    // markdown syntax
    const { heading, itemization } = TextLinesConstants.regexes.markdownSyntax;
    while (context.lineIndex < lines.length) {
      const line = lines[context.lineIndex];
      if (!options.disabledMap.code && blockCodeMeta.test(line)) {
        nodes.push(parseBlockCode(lines, context));
      } else if (!options.disabledMap.formula && blockFormulaMeta.test(line)) {
        nodes.push(parseBlockFormula(lines, context));
      } else if (heading.test(line)) {
        nodes.push(parseHeading(line, context, options));
      } else if (quotation.test(line)) {
        nodes.push(parseQuotation(line, context, options));
      } else if (itemization.test(line)) {
        nodes.push(parseMarkdownItemization(line, context, options));
      } else {
        nodes.push(parseNormalLine(line, context, options));
      }
    }
  }

  return nodes;
}
