import { bracketLinkRegex, parseBracketLink } from '../bracketLink/parseBracketLink';
import { ParsingContext, ParsingOptions } from '../common/types';
import { boldRegex, parseBold } from '../decoration/parseBold';
import { boldItalicRegex, parseBoldItalic } from '../decoration/parseBoldItalic';
import { decorationRegex, parseDecoration } from '../decoration/parseDecoration';
import { italicRegex, parseItalic } from '../decoration/parseItalic';
import { italicBoldRegex, parseItalicBold } from '../decoration/parseItalicBold';
import { displayFormulaRegex, parseDisplayFormula } from '../displayFormula/parseDisplayFormula';
import { hashtagRegex, parseHashtag } from '../hashtag/parseHashtag';
import { inlineCodeRegex, parseInlineCode } from '../inlineCode/parseInlineCode';
import { inlineFormulaRegex, parseInlineFormula } from '../inlineFormula/parseInlineFormula';
import { normalRegex, parseNormal } from '../normal/parseNormal';
import { parseTaggedLink } from '../taggedLink/parseTaggedLink';
import { parseUrl, urlRegex } from '../url/parseUrl';

import { ContentNode } from './types';

export function parseContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  if (!options.syntax || options.syntax === 'bracket') {
    // Bracket syntax
    return parseBracketContent(text, context, options);
  } else {
    // Markdown syntax
    return parseMarkdownContent(text, context, options);
  }
}

function parseBracketContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const taggedLink = options.taggedLinkRegexes?.find((regex) => regex.test(text));

  if (!options.codeDisabled && inlineCodeRegex.test(text)) {
    return parseInlineCode(text, context, options);
  } else if (!options.formulaDisabled && displayFormulaRegex.test(text)) {
    return parseDisplayFormula(text, context, options);
  } else if (!options.formulaDisabled && inlineFormulaRegex.test(text)) {
    return parseInlineFormula(text, context, options);
  } else if (!context.nested && decorationRegex.test(text)) {
    return parseDecoration(text, context, options);
  } else if (taggedLink) {
    return parseTaggedLink(text, context, options, taggedLink);
  } else if (!options.bracketLinkDisabled && bracketLinkRegex.test(text)) {
    return parseBracketLink(text, context, options);
  } else if (!options.hashtagDisabled && hashtagRegex.test(text)) {
    return parseHashtag(text, context, options);
  } else if (urlRegex.test(text)) {
    return parseUrl(text, context, options);
  } else if (normalRegex.test(text)) {
    return parseNormal(text, context);
  }
  return [];
}

function parseMarkdownContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const taggedLink = options.taggedLinkRegexes?.find((regex) => regex.test(text));

  if (!options.codeDisabled && inlineCodeRegex.test(text)) {
    return parseInlineCode(text, context, options);
  } else if (!options.formulaDisabled && displayFormulaRegex.test(text)) {
    return parseDisplayFormula(text, context, options);
  } else if (!options.formulaDisabled && inlineFormulaRegex.test(text)) {
    return parseInlineFormula(text, context, options);
  } else if (!context.nested && boldItalicRegex.test(text)) {
    return parseBoldItalic(text, context, options);
  } else if (!context.nested && italicBoldRegex.test(text)) {
    return parseItalicBold(text, context, options);
  } else if (!context.nested && boldRegex.test(text)) {
    return parseBold(text, context, options);
  } else if (!context.nested && italicRegex.test(text)) {
    return parseItalic(text, context, options);
  } else if (taggedLink) {
    return parseTaggedLink(text, context, options, taggedLink);
  } else if (!options.bracketLinkDisabled && bracketLinkRegex.test(text)) {
    return parseBracketLink(text, context, options);
  } else if (!options.hashtagDisabled && hashtagRegex.test(text)) {
    return parseHashtag(text, context, options);
  } else if (urlRegex.test(text)) {
    return parseUrl(text, context, options);
  } else if (normalRegex.test(text)) {
    return parseNormal(text, context);
  }
  return [];
}
