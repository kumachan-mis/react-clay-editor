import { TextLinesConstants } from './constants';
import {
  TextDecoration,
  TaggedLinkPropsMap,
  DecorationStyle,
  Node,
  ItemizationNode,
  InlineCodeNode,
  BlockFormulaNode,
  InlineFormulaNode,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashTagNode,
  NormalNode,
  ParsingOption,
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
  const lines = text.split('\n');
  const taggedLinkRegexes = Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
    TextLinesConstants.regexes.taggedLink(tagName, linkProps.linkNameRegex)
  );

  return ([] as Node[]).concat(
    ...lines.map((line, index) => {
      const option = { lineIndex: index, offset: 0, nested: false, line: true, taggedLinkRegexes };
      return parseToNodes(line, option);
    })
  );
}

function parseToNodes(text: string, option: ParsingOption): Node[] {
  const {
    itemization,
    inlineCode,
    blockFormula,
    inlineFormula,
    decoration,
    bracketLink,
    hashTag,
    normal,
  } = TextLinesConstants.regexes;
  const taggedLink = option.taggedLinkRegexes.find((regex) => regex.test(text));

  if (option.line && itemization.test(text)) {
    return parseItemization(text, option);
  } else if (inlineCode.test(text)) {
    return parseInlineCode(text, option);
  } else if (blockFormula.test(text)) {
    return parseBlockFormula(text, option);
  } else if (inlineFormula.test(text)) {
    return parseInlineFormula(text, option);
  } else if (decoration.test(text)) {
    return parseDecoration(text, option);
  } else if (taggedLink) {
    return parseTaggedLink(text, option, taggedLink);
  } else if (bracketLink.test(text)) {
    return parseBracketLink(text, option);
  } else if (hashTag.test(text)) {
    return parseHashTag(text, option);
  } else if (normal.test(text)) {
    return parseNormal(text, option);
  } else {
    return [];
  }
}

function parseItemization(line: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.itemization;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset, option.offset + line.length];

  const node: ItemizationNode = {
    type: 'itemization',
    lineIndex: option.lineIndex,
    range: [from, to],
    indent,
    children: parseToNodes(content, { ...option, offset: from + indent.length, line: false }),
  };

  return [node];
}

function parseInlineCode(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.inlineCode;
  const { left, code, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: InlineCodeNode = {
    type: 'inlineCode',
    lineIndex: option.lineIndex,
    range: [from, to],
    facingMeta: '`',
    code,
    trailingMeta: '`',
  };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}
function parseBlockFormula(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.blockFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: BlockFormulaNode = {
    type: 'blockFormula',
    lineIndex: option.lineIndex,
    range: [from, to],
    facingMeta: '$$',
    formula,
    trailingMeta: '$$',
  };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseInlineFormula(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.inlineFormula;
  const { left, formula, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: InlineFormulaNode = {
    type: 'inlineFormula',
    lineIndex: option.lineIndex,
    range: [from, to],
    facingMeta: '$',
    formula,
    trailingMeta: '$',
  };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseDecoration(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: DecorationNode | BracketLinkNode = !option.nested
    ? {
        type: 'decoration',
        lineIndex: option.lineIndex,
        range: [from, to],
        facingMeta: `[${decoration} `,
        children: parseToNodes(body, {
          ...option,
          offset: from + decoration.length + 2,
          nested: true,
        }),
        trailingMeta: ']',
      }
    : {
        type: 'bracketLink',
        lineIndex: option.lineIndex,
        range: [from, to],
        facingMeta: '[',
        linkName: `${decoration} ${body}`,
        trailingMeta: ']',
      };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseTaggedLink(text: string, option: ParsingOption, regex: RegExp): Node[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    lineIndex: option.lineIndex,
    range: [from, to],
    facingMeta: '[',
    tag,
    linkName,
    trailingMeta: ']',
  };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseBracketLink(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: BracketLinkNode = {
    type: 'bracketLink',
    lineIndex: option.lineIndex,
    range: [from, to],
    facingMeta: '[',
    linkName,
    trailingMeta: ']',
  };

  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseHashTag(text: string, option: ParsingOption): Node[] {
  const regex = TextLinesConstants.regexes.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];
  const node: HashTagNode = {
    type: 'hashTag',
    lineIndex: option.lineIndex,
    range: [from, to],
    hashTag,
  };
  return [...parseToNodes(left, option), node, ...parseToNodes(right, { ...option, offset: to })];
}

function parseNormal(text: string, option: ParsingOption): Node[] {
  const [from, to] = [option.offset, option.offset + text.length];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: option.lineIndex,
    text,
    range: [from, to],
  };

  return [node];
}
