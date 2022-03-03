import { parserConstants } from './constants';
import {
  ContentNode,
  InlineCodeNode,
  DisplayFormulaNode,
  InlineFormulaNode,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashtagNode,
  UrlNode,
  NormalNode,
  ParsingContext,
  ParsingOptions,
  Decoration,
} from './types';

export function parseContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { inlineCode, displayFormula, inlineFormula, bracketLink, hashtag, url } = parserConstants.common;
  const taggedLink = options.taggedLinkRegexes?.find((regex) => regex.test(text));

  if (!options.syntax || options.syntax === 'bracket') {
    // bracket syntax
    const { decoration } = parserConstants.bracketSyntax;
    if (!options.codeDisabled && inlineCode.test(text)) {
      return parseInlineCode(text, context, options);
    } else if (!options.formulaDisabled && displayFormula.test(text)) {
      return parseDisplayFormula(text, context, options);
    } else if (!options.formulaDisabled && inlineFormula.test(text)) {
      return parseInlineFormula(text, context, options);
    } else if (!context.nested && decoration.test(text)) {
      return parseDecoration(text, context, options);
    } else if (taggedLink) {
      return parseTaggedLink(text, context, options, taggedLink);
    } else if (!options.bracketLinkDisabled && bracketLink.test(text)) {
      return parseBracketLink(text, context, options);
    } else if (!options.hashtagDisabled && hashtag.test(text)) {
      return parseHashtag(text, context, options);
    } else if (url.test(text)) {
      return parseUrl(text, context, options);
    } else {
      return parseNormal(text, context);
    }
  } else {
    // markdown syntax
    const { bold, italic } = parserConstants.markdownSyntax;
    if (!options.codeDisabled && inlineCode.test(text)) {
      return parseInlineCode(text, context, options);
    } else if (!options.formulaDisabled && displayFormula.test(text)) {
      return parseDisplayFormula(text, context, options);
    } else if (!options.formulaDisabled && inlineFormula.test(text)) {
      return parseInlineFormula(text, context, options);
    } else if (!context.nested && bold.test(text)) {
      return parseBold(text, context, options);
    } else if (!context.nested && italic.test(text)) {
      return parseItalic(text, context, options);
    } else if (taggedLink) {
      return parseTaggedLink(text, context, options, taggedLink);
    } else if (!options.bracketLinkDisabled && bracketLink.test(text)) {
      return parseBracketLink(text, context, options);
    } else if (!options.hashtagDisabled && hashtag.test(text)) {
      return parseHashtag(text, context, options);
    } else if (url.test(text)) {
      return parseUrl(text, context, options);
    } else {
      return parseNormal(text, context);
    }
  }
}

function parseInlineCode(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: InlineCodeNode = {
    type: 'inlineCode',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '`',
    code,
    trailingMeta: '`',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
function parseDisplayFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.displayFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
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

function parseInlineFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
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

function parseDecoration(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.bracketSyntax.decoration;
  const { left, decoration: decostring, body, right } = text.match(regex)?.groups as Record<string, string>;
  const decoration = stringToDecoration(decostring);
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: `[${decostring} `,
    children: parseContent(
      body,
      { ...context, charIndex: first + decostring.length + 2, nested: true, decoration: decoration },
      options
    ),
    trailingMeta: ']',
    decoration: decoration,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function stringToDecoration(decostring: string): Decoration {
  const decoration: Decoration = { bold: false, italic: false, underline: false, size: 'normal' };

  for (let i = 0; i < decostring.length; i++) {
    switch (decostring[i]) {
      case '*':
        if (!decoration.bold) {
          decoration.bold = true;
        } else if (decoration.size === 'normal') {
          decoration.size = 'larger';
        } else if (decoration.size === 'larger') {
          decoration.size = 'largest';
        }
        break;
      case '/':
        decoration.italic = true;
        break;
      case '_':
        decoration.underline = true;
        break;
    }
  }

  return decoration;
}

function parseBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.markdownSyntax.bold;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '*',
    children: parseContent(body, { ...context, charIndex: first + 1, nested: true }, options),
    trailingMeta: '*',
    decoration: { ...context.decoration, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.markdownSyntax.italic;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '_',
    children: parseContent(body, { ...context, charIndex: first + 1, nested: true }, options),
    trailingMeta: '_',
    decoration: { ...context.decoration, italic: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseTaggedLink(text: string, context: ParsingContext, options: ParsingOptions, regex: RegExp): ContentNode[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: `[${tag} `,
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseBracketLink(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: BracketLinkNode = {
    type: 'bracketLink',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '[',
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseHashtag(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.hashtag;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: HashtagNode = {
    type: 'hashtag',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '#',
    linkName,
    trailingMeta: '',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseUrl(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = parserConstants.common.url;
  const { left, url, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: UrlNode = {
    type: 'url',
    lineIndex: context.lineIndex,
    range: [first, last],
    url,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function parseNormal(text: string, context: ParsingContext): ContentNode[] {
  const [first, last] = [context.charIndex, context.charIndex + text.length - 1];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: context.lineIndex,
    text,
    range: [first, last],
  };

  return [node];
}
