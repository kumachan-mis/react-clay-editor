import {
  ContentNode,
  InlineCodeNode,
  DisplayFormulaNode,
  InlineFormulaNode,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashTagNode,
  NormalNode,
  ParsingContext,
  ParsingOptions,
  Decoration,
} from './types';
import { TextLinesConstants } from '../constants';

export function parseContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { inlineCode, displayFormula, inlineFormula, bracketLink, hashTag, normal } = TextLinesConstants.regexes.common;
  const taggedLink = options.taggedLinkRegexes.find((regex) => regex.test(text));

  if (options.syntax == 'bracket') {
    // bracket syntax
    const { decoration } = TextLinesConstants.regexes.bracketSyntax;
    if (!options.disabledMap.code && inlineCode.test(text)) {
      return parseInlineCode(text, context, options);
    } else if (!options.disabledMap.formula && displayFormula.test(text)) {
      return parseDisplayFormula(text, context, options);
    } else if (!options.disabledMap.formula && inlineFormula.test(text)) {
      return parseInlineFormula(text, context, options);
    } else if (!context.nested && decoration.test(text)) {
      return parseDecoration(text, context, options);
    } else if (taggedLink) {
      return parseTaggedLink(text, context, options, taggedLink);
    } else if (!options.disabledMap.bracketLink && bracketLink.test(text)) {
      return parseBracketLink(text, context, options);
    } else if (!options.disabledMap.hashTag && hashTag.test(text)) {
      return parseHashTag(text, context, options);
    } else if (normal.test(text)) {
      return parseNormal(text, context);
    }
    return [];
  } else {
    // markdown syntax
    const { bold, italic } = TextLinesConstants.regexes.markdownSyntax;
    if (!options.disabledMap.code && inlineCode.test(text)) {
      return parseInlineCode(text, context, options);
    } else if (!options.disabledMap.formula && displayFormula.test(text)) {
      return parseDisplayFormula(text, context, options);
    } else if (!options.disabledMap.formula && inlineFormula.test(text)) {
      return parseInlineFormula(text, context, options);
    } else if (!context.nested && bold.test(text)) {
      return parseBold(text, context, options);
    } else if (!context.nested && italic.test(text)) {
      return parseItalic(text, context, options);
    } else if (taggedLink) {
      return parseTaggedLink(text, context, options, taggedLink);
    } else if (!options.disabledMap.bracketLink && bracketLink.test(text)) {
      return parseBracketLink(text, context, options);
    } else if (!options.disabledMap.hashTag && hashTag.test(text)) {
      return parseHashTag(text, context, options);
    } else if (normal.test(text)) {
      return parseNormal(text, context);
    }
    return [];
  }
}

function parseInlineCode(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}
function parseDisplayFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.displayFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseInlineFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseDecoration(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.bracketSyntax.decoration;
  const { left, decoration: decostring, body, right } = text.match(regex)?.groups as Record<string, string>;
  const decoration = stringToDecoration(decostring);
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function stringToDecoration(decostring: string): Decoration {
  const decoration: Decoration = { bold: false, italic: false, underline: false, fontlevel: 'normal' };

  for (let i = 0; i < decostring.length; i++) {
    switch (decostring[i]) {
      case '*':
        if (!decoration.bold) {
          decoration.bold = true;
        } else if (decoration.fontlevel == 'normal') {
          decoration.fontlevel = 'larger';
        } else if (decoration.fontlevel == 'larger') {
          decoration.fontlevel = 'largest';
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
  const regex = TextLinesConstants.regexes.markdownSyntax.bold;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.markdownSyntax.italic;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseTaggedLink(text: string, context: ParsingContext, options: ParsingOptions, regex: RegExp): ContentNode[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '[',
    tag,
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseBracketLink(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

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
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseHashTag(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: HashTagNode = {
    type: 'hashTag',
    lineIndex: context.lineIndex,
    range: [first, last],
    hashTag,
  };
  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last }, options),
  ];
}

function parseNormal(text: string, context: ParsingContext): ContentNode[] {
  const [first, last] = [context.charIndex, context.charIndex + text.length];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: context.lineIndex,
    text,
    range: [first, last],
  };

  return [node];
}
