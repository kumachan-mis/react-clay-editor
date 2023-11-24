import { ParsingOptions, ParsingContext } from '../common/types';
import { headingRegex, parseHeading } from '../decoration/parseHeading';
import { bracketItemizationRegex, parseBracketItemization } from '../itemization/parseBracketItemization';
import { markdownItemizationRegex, parseMarkdownItemization } from '../itemization/parseMarkdownItemization';
import { parseNormalLine } from '../normalLine/parseNormalLine';
import { parseQuotation, quotationRegex } from '../quotation/parseQuotation';

import { LineNode } from './types';

export function parseLine(line: string, options: ParsingOptions, context: ParsingContext): LineNode {
  if (!options.syntax || options.syntax === 'bracket') {
    // Bracket syntax
    return parseBracketLine(line, context, options);
  } else {
    // Markdown syntax
    return parseMarkdownLine(line, context, options);
  }
}

function parseBracketLine(line: string, context: ParsingContext, options: ParsingOptions): LineNode {
  if (quotationRegex.test(line)) {
    return parseQuotation(line, context, options);
  } else if (bracketItemizationRegex.test(line)) {
    return parseBracketItemization(line, context, options);
  } else {
    return parseNormalLine(line, context, options);
  }
}

function parseMarkdownLine(line: string, context: ParsingContext, options: ParsingOptions): LineNode {
  if (headingRegex.test(line)) {
    return parseHeading(line, context, options);
  } else if (quotationRegex.test(line)) {
    return parseQuotation(line, context, options);
  } else if (markdownItemizationRegex.test(line)) {
    return parseMarkdownItemization(line, context, options);
  } else {
    return parseNormalLine(line, context, options);
  }
}
