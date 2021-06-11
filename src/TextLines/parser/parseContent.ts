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
} from './types';
import { TextLinesConstants } from '../constants';

export function parseContent(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { inlineCode, displayFormula, inlineFormula, bracketLink, hashTag, normal } = TextLinesConstants.regexes.common;
  const { decoration } = TextLinesConstants.regexes.bracketSyntax;
  const taggedLink = options.taggedLinkRegexes.find((regex) => regex.test(text));

  if (!options.disabledMap.code && inlineCode.test(text)) {
    return parseInlineCode(text, context, options);
  } else if (!options.disabledMap.formula && displayFormula.test(text)) {
    return parseDisplayFormula(text, context, options);
  } else if (!options.disabledMap.formula && inlineFormula.test(text)) {
    return parseInlineFormula(text, context, options);
  } else if (decoration.test(text)) {
    return parseDecoration(text, context, options);
  } else if (taggedLink) {
    return parseTaggedLink(text, context, options, taggedLink);
  } else if (!options.disabledMap.bracketLink && bracketLink.test(text)) {
    return parseBracketLink(text, context, options);
  } else if (!options.disabledMap.hashTag && hashTag.test(text)) {
    return parseHashTag(text, context, options);
  } else if (normal.test(text)) {
    return parseNormal(text, context);
  } else {
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
  const [from, to] = [context.charIndex + left.length, context.charIndex + text.length - right.length];

  const node: DecorationNode | BracketLinkNode = !context.nested
    ? {
        type: 'decoration',
        lineIndex: context.lineIndex,
        range: [from, to],
        facingMeta: '[',
        decoration: `${decoration} `,
        children: parseContent(body, { ...context, charIndex: from + decoration.length + 2, nested: true }, options),
        trailingMeta: ']',
      }
    : {
        type: 'bracketLink',
        lineIndex: context.lineIndex,
        range: [from, to],
        facingMeta: '[',
        linkName: `${decoration} ${body}`,
        trailingMeta: ']',
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
