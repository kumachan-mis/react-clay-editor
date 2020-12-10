import { TextLinesConstants } from './constants';
import {
  TextDecoration,
  TaggedLinkPropsMap,
  DecorationStyle,
  Node,
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

export function parseText(text: string, taggedLinkPropsMap: TaggedLinkPropsMap): Node[] {
  const taggedLinkRegexes = Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
    TextLinesConstants.regexes.taggedLink(tagName, linkProps.linkNameRegex)
  );

  const lines = text.split('\n');
  const nodes: Node[] = [];
  const multi: MultiLineContext = {
    blockCodeDepth: undefined,
    taggedLinkRegexes,
  };
  for (const [index, line] of lines.entries()) {
    const single: SingleLineContext = {
      lineIndex: index,
      offset: 0,
      nested: false,
      line: true,
    };
    nodes.push(...parseToNodes(line, single, multi));
  }
  return nodes;
}

function parseToNodes(text: string, single: SingleLineContext, multi: MultiLineContext): Node[] {
  const {
    itemization,
    blockCodeMeta,
    blockCodeLine,
    inlineCode,
    blockFormula,
    inlineFormula,
    decoration,
    bracketLink,
    hashTag,
    normal,
  } = TextLinesConstants.regexes;
  const taggedLink = multi.taggedLinkRegexes.find((regex) => regex.test(text));

  if (single.line && blockCodeMeta.test(text)) {
    return parseBlockCodeMeta(text, single, multi);
  } else if (
    single.line &&
    multi.blockCodeDepth !== undefined &&
    blockCodeLine(multi.blockCodeDepth).test(text)
  ) {
    return parseBlockCodeLine(text, single, multi);
  } else if (single.line && itemization.test(text)) {
    return parseItemization(text, single, multi);
  } else if (inlineCode.test(text)) {
    return parseInlineCode(text, single, multi);
  } else if (blockFormula.test(text)) {
    return parseBlockFormula(text, single, multi);
  } else if (inlineFormula.test(text)) {
    return parseInlineFormula(text, single, multi);
  } else if (decoration.test(text)) {
    return parseDecoration(text, single, multi);
  } else if (taggedLink) {
    return parseTaggedLink(text, single, multi, taggedLink);
  } else if (bracketLink.test(text)) {
    return parseBracketLink(text, single, multi);
  } else if (hashTag.test(text)) {
    return parseHashTag(text, single, multi);
  } else if (normal.test(text)) {
    return parseNormal(text, single);
  } else {
    return [];
  }
}

function parseBlockCodeMeta(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext
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
  multi: MultiLineContext
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

function parseItemization(
  line: string,
  single: SingleLineContext,
  multi: MultiLineContext
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
      multi
    ),
  };

  multi.blockCodeDepth = undefined;

  return [node];
}

function parseInlineCode(text: string, single: SingleLineContext, multi: MultiLineContext): Node[] {
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}
function parseBlockFormula(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseInlineFormula(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseDecoration(text: string, single: SingleLineContext, multi: MultiLineContext): Node[] {
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
          multi
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseTaggedLink(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext,
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseBracketLink(
  text: string,
  single: SingleLineContext,
  multi: MultiLineContext
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseHashTag(text: string, single: SingleLineContext, multi: MultiLineContext): Node[] {
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
    ...parseToNodes(left, single, multi),
    node,
    ...parseToNodes(right, { ...single, offset: to }, multi),
  ];
}

function parseNormal(text: string, single: SingleLineContext): Node[] {
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
