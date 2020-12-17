import { TextLinesConstants } from './constants';
import {
  TextDecoration,
  DecorationStyle,
  LineNode,
  BlockCodeNode,
  BlockCodeMetaNode,
  BlockCodeLineNode,
  BlockFormulaNode,
  BlockFormulaMetaNode,
  BlockFormulaLineNode,
  QuotationNode,
  ItemizationNode,
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

import { classNameToSelector } from '../common';
import { EditorConstants } from '../Editor/constants';

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const rootElement = element.closest(rootSelector);
  if (rootElement == null) return null;
  const lineSelector = classNameToSelector(TextLinesConstants.line.className(lineIndex));
  return rootElement.querySelector(lineSelector);
}

export function getTextCharElementAt(
  lineIndex: number,
  charIndex: number,
  element: HTMLElement
): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const rootElement = element.closest(rootSelector);
  if (rootElement == null) return null;
  const charSelector = classNameToSelector(TextLinesConstants.char.className(lineIndex, charIndex));
  return rootElement.querySelector(charSelector);
}

export function getDecorationStyle(decoration: string, setting: TextDecoration): DecorationStyle {
  const { level1, level2, level3 } = setting.fontSizes;
  const style = { bold: false, italic: false, underline: false, fontSize: level1 };
  for (let i = 0; i < decoration.length; i++) {
    switch (decoration[i]) {
      case '*':
        if (!style.bold) {
          style.bold = true;
        } else if (style.fontSize == level1) {
          style.fontSize = level2;
        } else if (style.fontSize == level2) {
          style.fontSize = level3;
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

export function getTagName(tag: string): string {
  return tag.substring(0, tag.length - 2);
}

export function getHashTagName(hashTag: string): string {
  return hashTag.substring(1);
}

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

function parseBlockCode(lines: string[], context: ParsingContext): BlockCodeNode {
  const facingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
  const metaRegex = TextLinesConstants.regexes.blockCodeMeta;
  const lineRegex = TextLinesConstants.regexes.blockCodeLine(facingMeta.indentDepth);
  context.lineIndex++;

  const node: BlockCodeNode = { type: 'blockCode', facingMeta, children: [] };
  while (context.lineIndex < lines.length) {
    if (metaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth == facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      return node;
    }

    if (!lineRegex.test(lines[context.lineIndex])) break;

    node.children.push(parseBlockCodeLine(lines[context.lineIndex], context, lineRegex));
    context.lineIndex++;
  }
  return node;
}

function parseBlockCodeMeta(line: string, context: ParsingContext): BlockCodeMetaNode {
  const regex = TextLinesConstants.regexes.blockCodeMeta;
  const { indent, codeMeta } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeMetaNode = {
    type: 'blockCodeMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeMeta,
  };

  return node;
}

function parseBlockCodeLine(
  line: string,
  context: ParsingContext,
  regex: RegExp
): BlockCodeLineNode {
  const { indent, codeLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeLineNode = {
    type: 'blockCodeLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeLine,
  };

  return node;
}

function parseBlockFormula(lines: string[], context: ParsingContext): BlockFormulaNode {
  const facingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
  const metaRegex = TextLinesConstants.regexes.blockFormulaMeta;
  const lineRegex = TextLinesConstants.regexes.blockFormulaLine(facingMeta.indentDepth);
  context.lineIndex++;

  const node: BlockFormulaNode = { type: 'blockFormula', facingMeta, children: [] };
  while (context.lineIndex < lines.length) {
    if (metaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth == facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      return node;
    }

    if (!lineRegex.test(lines[context.lineIndex])) break;

    node.children.push(parseBlockFormulaLine(lines[context.lineIndex], context, lineRegex));
    context.lineIndex++;
  }
  return node;
}

function parseBlockFormulaMeta(line: string, context: ParsingContext): BlockFormulaMetaNode {
  const regex = TextLinesConstants.regexes.blockFormulaMeta;
  const { indent, formulaMeta } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaMetaNode = {
    type: 'blockFormulaMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaMeta,
  };

  return node;
}

function parseBlockFormulaLine(
  line: string,
  context: ParsingContext,
  regex: RegExp
): BlockFormulaLineNode {
  const { indent, formulaLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaLineNode = {
    type: 'blockFormulaLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaLine,
  };

  return node;
}

function parseQuotation(
  line: string,
  context: ParsingContext,
  options: ParsingOptions
): QuotationNode {
  const regex = TextLinesConstants.regexes.quotation;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;

  const node: QuotationNode = {
    type: 'quotation',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    contentLength: content.length,
    meta: '>',
    children: parseContent(content, { ...context, charIndex: indent.length + 1 }, options),
  };

  context.lineIndex++;

  return node;
}

function parseItemization(
  line: string,
  context: ParsingContext,
  options: ParsingOptions
): ItemizationNode {
  const regex = TextLinesConstants.regexes.itemization;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;

  const node: ItemizationNode = {
    type: 'itemization',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    contentLength: content.length,
    children: parseContent(content, { ...context, charIndex: indent.length }, options),
  };

  context.lineIndex++;

  return node;
}

function parseContent(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const {
    inlineCode,
    displayFormula,
    inlineFormula,
    decoration,
    bracketLink,
    hashTag,
    normal,
  } = TextLinesConstants.regexes;
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

function parseInlineCode(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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
function parseDisplayFormula(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.displayFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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

function parseInlineFormula(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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

function parseDecoration(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

  const node: DecorationNode | BracketLinkNode = !context.nested
    ? {
        type: 'decoration',
        lineIndex: context.lineIndex,
        range: [from, to],
        facingMeta: '[',
        decoration: `${decoration} `,
        children: parseContent(
          body,
          { ...context, charIndex: from + decoration.length + 2, nested: true },
          options
        ),
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

function parseTaggedLink(
  text: string,
  context: ParsingContext,
  options: ParsingOptions,
  regex: RegExp
): ContentNode[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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

function parseBracketLink(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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

function parseHashTag(
  text: string,
  context: ParsingContext,
  options: ParsingOptions
): ContentNode[] {
  const regex = TextLinesConstants.regexes.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [
    context.charIndex + left.length,
    context.charIndex + text.length - right.length,
  ];

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
