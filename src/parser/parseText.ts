import { parserConstants } from './constants';
import {
  parseBlockCode,
  parseBlockFormula,
  parseHeading,
  parseQuotation,
  parseBracketItemization,
  parseMarkdownItemization,
  parseNormalLine,
} from './parseLine';
import { BlockNode, LineNode, ParsingContext, ParsingOptions } from './types';

export function parseText(text: string, options: ParsingOptions): (BlockNode | LineNode)[] {
  const { blockCodeMeta, blockFormulaMeta, quotation } = parserConstants.common;
  const lines = text.split('\n');
  const nodes: (BlockNode | LineNode)[] = [];
  const context: ParsingContext = {
    lineIndex: 0,
    charIndex: 0,
    nested: false,
    decoration: { size: 'normal', bold: false, italic: false, underline: false },
  };

  if (!options.syntax || options.syntax === 'bracket') {
    // bracket syntax
    const { itemization } = parserConstants.bracketSyntax;
    while (context.lineIndex < lines.length) {
      const line = lines[context.lineIndex];
      if (!options.codeDisabled && blockCodeMeta.test(line)) {
        nodes.push(parseBlockCode(lines, context));
      } else if (!options.formulaDisabled && blockFormulaMeta.test(line)) {
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
    const { heading, itemization } = parserConstants.markdownSyntax;
    while (context.lineIndex < lines.length) {
      const line = lines[context.lineIndex];
      if (!options.codeDisabled && blockCodeMeta.test(line)) {
        nodes.push(parseBlockCode(lines, context));
      } else if (!options.formulaDisabled && blockFormulaMeta.test(line)) {
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
