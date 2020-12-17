import { TextLinesConstants } from './constants';
import {
  TextDecoration,
  DecorationStyle,
  Node,
  QuotationNode,
  ItemizationNode,
  BlockCodeMetaNode,
  BlockCodeLineNode,
  InlineCodeNode,
  BlockFormulaNode,
  InlineFormulaNode,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashTagNode,
  NormalNode,
  SingleLineContext,
  MultiLineContext,
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

export function getDecorationStyle(
  facingMeta: string,
  trailingMeta: string,
  setting: TextDecoration
): DecorationStyle {
  const { level1, level2, level3 } = setting.fontSizes;
  const style = { bold: false, italic: false, underline: false, fontSize: level1 };
  for (let i = 1; i < facingMeta.length - 1; i++) {
    switch (facingMeta[i]) {
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

export function parseText(text: string, options: ParsingOptions): Node[] {
  const lines = text.split('\n');
  const nodes: Node[] = [];
  const multi: MultiLineContext = {
    blockCodeDepth: undefined,
  };
  for (const [index, line] of lines.entries()) {
    const single: SingleLineContext = {
      lineIndex: index,
      offset: 0,
      nested: false,
      line: true,
    };
    nodes.push(...parseToNodes(line, single, multi, options));
  }
  return nodes;
}

function parseToNodes(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  const {
    quotation,
    itemization,
    blockCodeMeta,
    inlineCode,
    blockFormula,
    inlineFormula,
    decoration,
    bracketLink,
    hashTag,
    normal,
  } = TextLinesConstants.regexes;
  const blockCodeLine =
    multi.blockCodeDepth !== undefined
      ? TextLinesConstants.regexes.blockCodeLine(multi.blockCodeDepth)
      : undefined;
  const taggedLink = options.taggedLinkRegexes.find((regex) => regex.test(text));

  if (!options.disabledMap.code && single.line && blockCodeMeta.test(text)) {
    return parseBlockCodeMeta(text, single, multi, options);
  } else if (!options.disabledMap.code && single.line && blockCodeLine?.test(text)) {
    return parseBlockCodeLine(text, single, multi, options);
  } else if (single.line && quotation.test(text)) {
    return parseQuotation(text, single, multi, options);
  } else if (single.line && itemization.test(text)) {
    return parseItemization(text, single, multi, options);
  } else if (!options.disabledMap.code && inlineCode.test(text)) {
    return parseInlineCode(text, single, multi, options);
  } else if (!options.disabledMap.formula && blockFormula.test(text)) {
    return parseBlockFormula(text, single, multi, options);
  } else if (!options.disabledMap.formula && inlineFormula.test(text)) {
    return parseInlineFormula(text, single, multi, options);
  } else if (decoration.test(text)) {
    return parseDecoration(text, single, multi, options);
  } else if (taggedLink) {
    return parseTaggedLink(text, single, multi, options, taggedLink);
  } else if (!options.disabledMap.bracketLink && bracketLink.test(text)) {
    return parseBracketLink(text, single, multi, options);
  } else if (!options.disabledMap.hashTag && hashTag.test(text)) {
    return parseHashTag(text, single, multi, options);
  } else if (normal.test(text)) {
    return parseNormal(text, single, multi, options);
  } else {
    return [];
  }
}

function parseBlockCodeMeta(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: ParsingOptions
): Node[] {
  if (!single.line) return [];

  const regex = TextLinesConstants.regexes.blockCodeMeta;
  const { indent, meta } = line.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset, single.offset + line.length];

  const node: BlockCodeMetaNode = {
    type: 'blockCodeMeta',
    lineIndex: single.lineIndex,
    range: [from, to],
    indentDepth: indent.length,
    meta,
  };

  if (indent.length == multi.blockCodeDepth) {
    multi.blockCodeDepth = undefined;
  } else {
    multi.blockCodeDepth = indent.length;
  }

  return [node];
}

function parseBlockCodeLine(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: ParsingOptions
): Node[] {
  if (!single.line || multi.blockCodeDepth === undefined) return [];

  const regex = TextLinesConstants.regexes.blockCodeLine(multi.blockCodeDepth);
  const { indent, codeLine } = line.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset, single.offset + line.length];

  const node: BlockCodeLineNode = {
    type: 'blockCodeLine',
    lineIndex: single.lineIndex,
    range: [from, to],
    indentDepth: indent.length,
    codeLine,
  };

  return [node];
}

function parseQuotation(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (!single.line) return [];

  const regex = TextLinesConstants.regexes.quotation;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset, single.offset + line.length];

  const node: QuotationNode = {
    type: 'quotation',
    lineIndex: single.lineIndex,
    range: [from, to],
    indentDepth: indent.length,
    meta: '>',
    children: parseToNodes(
      content,
      { ...single, offset: from + indent.length + 1, line: false },
      multi,
      options
    ),
  };

  multi.blockCodeDepth = undefined;

  return [node];
}

function parseItemization(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (!single.line) return [];

  const regex = TextLinesConstants.regexes.itemization;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset, single.offset + line.length];

  const node: ItemizationNode = {
    type: 'itemization',
    lineIndex: single.lineIndex,
    range: [from, to],
    indentDepth: indent.length,
    children: parseToNodes(
      content,
      { ...single, offset: from + indent.length, line: false },
      multi,
      options
    ),
  };

  multi.blockCodeDepth = undefined;

  return [node];
}

function parseInlineCode(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const regex = TextLinesConstants.regexes.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: InlineCodeNode = {
    type: 'inlineCode',
    lineIndex: single.lineIndex,
    range: [from, to],
    facingMeta: '`',
    code,
    trailingMeta: '`',
  };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}
function parseBlockFormula(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  const regex = TextLinesConstants.regexes.blockFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: BlockFormulaNode = {
    type: 'blockFormula',
    lineIndex: single.lineIndex,
    range: [from, to],
    facingMeta: '$$',
    formula,
    trailingMeta: '$$',
  };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseInlineFormula(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const regex = TextLinesConstants.regexes.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: InlineFormulaNode = {
    type: 'inlineFormula',
    lineIndex: single.lineIndex,
    range: [from, to],
    facingMeta: '$',
    formula,
    trailingMeta: '$',
  };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseDecoration(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const regex = TextLinesConstants.regexes.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: DecorationNode | BracketLinkNode = !single.nested
    ? {
        type: 'decoration',
        lineIndex: single.lineIndex,
        range: [from, to],
        facingMeta: `[${decoration} `,
        children: parseToNodes(
          body,
          { ...single, offset: from + decoration.length + 2, nested: true },
          multi,
          options
        ),
        trailingMeta: ']',
      }
    : {
        type: 'bracketLink',
        lineIndex: single.lineIndex,
        range: [from, to],
        facingMeta: '[',
        linkName: `${decoration} ${body}`,
        trailingMeta: ']',
      };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseTaggedLink(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions,
  regex: RegExp
): Node[] {
  if (single.line) return [];

  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    lineIndex: single.lineIndex,
    range: [from, to],
    facingMeta: '[',
    tag,
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseBracketLink(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const regex = TextLinesConstants.regexes.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];

  const node: BracketLinkNode = {
    type: 'bracketLink',
    lineIndex: single.lineIndex,
    range: [from, to],
    facingMeta: '[',
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseHashTag(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const regex = TextLinesConstants.regexes.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [single.offset + left.length, single.offset + text.length - right.length];
  const node: HashTagNode = {
    type: 'hashTag',
    lineIndex: single.lineIndex,
    range: [from, to],
    hashTag,
  };
  return [
    ...parseToNodes(left, single, multi, options),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi, options),
  ];
}

function parseNormal(
  text: string,
  single: SingleLineContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  multi: MultiLineContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: ParsingOptions
): Node[] {
  if (single.line) return [];

  const [from, to] = [single.offset, single.offset + text.length];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: single.lineIndex,
    text,
    range: [from, to],
  };

  return [node];
}
