import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { bracketHeadingRegex, parseBracketHeading } from '../heading/parseBracketHeading';
import { markdownHeadingRegex, parseMarkdownHeading } from '../heading/parseMarkdownHeading';
import { bracketItemizationRegex, parseBracketItemization } from '../itemization/parseBracketItemization';
import { markdownItemizationRegex, parseMarkdownItemization } from '../itemization/parseMarkdownItemization';
import { parseNormalLine } from '../normalLine/parseNormalLine';
import { parseQuotation, quotationRegex } from '../quotation/parseQuotation';

import { PureLineNode } from './pureLineNode';

export function parseLine(line: string, options: ParsingOptions, context: ParsingContext): PureLineNode {
  if (!options.syntax || options.syntax === 'bracket') {
    // Bracket syntax
    return parseBracketLine(line, context, options);
  } else {
    // Markdown syntax
    return parseMarkdownLine(line, context, options);
  }
}

function parseBracketLine(line: string, context: ParsingContext, options: ParsingOptions): PureLineNode {
  if (bracketHeadingRegex.test(line)) {
    return parseBracketHeading(line, context, options);
  } else if (quotationRegex.test(line)) {
    return parseQuotation(line, context, options);
  } else if (bracketItemizationRegex.test(line)) {
    return parseBracketItemization(line, context, options);
  } else {
    return parseNormalLine(line, context, options);
  }
}

function parseMarkdownLine(line: string, context: ParsingContext, options: ParsingOptions): PureLineNode {
  if (markdownHeadingRegex.test(line)) {
    return parseMarkdownHeading(line, context, options);
  } else if (quotationRegex.test(line)) {
    return parseQuotation(line, context, options);
  } else if (markdownItemizationRegex.test(line)) {
    return parseMarkdownItemization(line, context, options);
  } else {
    return parseNormalLine(line, context, options);
  }
}
