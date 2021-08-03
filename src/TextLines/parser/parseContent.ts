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
  DecorationStyle,
} from './types';
import { DecorationSettings } from '../types';
import { TextLinesConstants } from '../constants';

export function parseContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { inlineCode, displayFormula, inlineFormula, bracketLink, hashTag, normal } = TextLinesConstants.regexes.common;
  const taggedLink = options.taggedLinkRegexes.find((regex) => regex.test(text));

  if (options.syntax == 'bracket') {
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
  } else if (options.syntax == 'markdown') {
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
  } else {
    if (normal.test(text)) {
      return parseNormal(text, context);
    }
    return [];
  }
}

function parseInlineCode(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: InlineCodeNode = {
    type: 'inlineCode',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '`',
    code,
    trailingMeta: '`',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}
function parseDisplayFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.displayFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: DisplayFormulaNode = {
    type: 'displayFormula',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '$$',
    formula,
    trailingMeta: '$$',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseInlineFormula(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: InlineFormulaNode = {
    type: 'inlineFormula',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '$',
    formula,
    trailingMeta: '$',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseDecoration(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.bracketSyntax.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const decorationStyle = getDecorationStyle(decoration, options.decorationSettings);
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: DecorationNode = {
    type: 'text',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: `[${decoration} `,
    children: parseContent(
      body,
      { ...context, charIndex: from + decoration.length + 2, nested: true, decoration: decorationStyle },
      options
    ),
    trailingMeta: ']',
    decoration: decorationStyle,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function getDecorationStyle(decoration: string, setting: DecorationSettings): DecorationStyle {
  const { normal, larger, largest } = setting.fontSizes;
  const style = { bold: false, italic: false, underline: false, fontSize: normal };

  for (let i = 0; i < decoration.length; i++) {
    switch (decoration[i]) {
      case '*':
        if (!style.bold) {
          style.bold = true;
        } else if (style.fontSize == normal) {
          style.fontSize = larger;
        } else if (style.fontSize == larger) {
          style.fontSize = largest;
        }
        break;
      case '/':
        style.italic = true;
        break;
      case '_':
        style.underline = true;
        break;
    }
  }

  return style;
}

function parseBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.markdownSyntax.bold;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: DecorationNode = {
    type: 'text',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '*',
    children: parseContent(body, { ...context, charIndex: from + 1, nested: true }, options),
    trailingMeta: '*',
    decoration: { ...context.decoration, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.markdownSyntax.italic;
  const { left, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: DecorationNode = {
    type: 'text',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '_',
    children: parseContent(body, { ...context, charIndex: from + 1, nested: true }, options),
    trailingMeta: '_',
    decoration: { ...context.decoration, italic: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseTaggedLink(text: string, context: ParsingContext, options: ParsingOptions, regex: RegExp): ContentNode[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '[',
    tag,
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseBracketLink(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: BracketLinkNode = {
    type: 'bracketLink',
    lineIndex: context.lineIndex,
    range: [from, to],
    facingMeta: '[',
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseHashTag(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const regex = TextLinesConstants.regexes.common.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: HashTagNode = {
    type: 'hashTag',
    lineIndex: context.lineIndex,
    range: [from, to],
    hashTag,
  };
  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: to }, options),
  ];
}

function parseNormal(text: string, context: ParsingContext): ContentNode[] {
  const [from, to] = [context.charIndex, context.charIndex + text.length];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: context.lineIndex,
    text,
    range: [from, to],
  };

  return [node];
}
