import { TextLinesConstants } from "./constants";
import {
  DecorationSetting,
  TaggedLinkPropsMap,
  ContentWithIndent,
  DecorationStyle,
  Node,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashTagNode,
  NormalNode,
  ParseOption,
} from "./types";

import { classNameToSelector } from "../common";
import { EditorConstants } from "../Editor/constants";

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

export function parseLine(line: string): ContentWithIndent {
  const regex = TextLinesConstants.regexes.indent;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  return { indent, content };
}

export function parseContent(
  content: string,
  taggedLinkPropsMap: TaggedLinkPropsMap,
  indentDepth: number
): Node[] {
  const taggedLinkRegexes = Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
    TextLinesConstants.regexes.taggedLink(tagName, linkProps.linkNameRegex)
  );
  return parseText(content, { offset: indentDepth, nested: false, taggedLinkRegexes });
}

export function getDecorationStyle(
  facingMeta: string,
  trailingMeta: string,
  setting: DecorationSetting
): DecorationStyle {
  const { level1, level2, level3 } = setting.fontSizes;
  const style = { bold: false, italic: false, underline: false, fontSize: level1 };
  for (let i = 1; i < facingMeta.length - 1; i++) {
    switch (facingMeta[i]) {
      case "*":
        if (!style.bold) {
          style.bold = true;
        } else if (style.fontSize == level1) {
          style.fontSize = level2;
        } else if (style.fontSize == level2) {
          style.fontSize = level3;
        }
        break;
      case "/":
        style.italic = true;
        break;
      case "_":
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

function parseText(text: string, option: ParseOption): Node[] {
  const { decoration, bracketLink, hashTag, normal } = TextLinesConstants.regexes;
  const taggedLink = option.taggedLinkRegexes.find((regex) => regex.test(text));

  if (decoration.test(text)) {
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

function parseDecoration(text: string, option: ParseOption): Node[] {
  const regex = TextLinesConstants.regexes.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: DecorationNode | BracketLinkNode = !option.nested
    ? {
        type: "decoration",
        range: [from, to],
        facingMeta: `[${decoration} `,
        children: parseText(body, {
          ...option,
          offset: from + decoration.length + 2,
          nested: true,
        }),
        trailingMeta: "]",
      }
    : {
        type: "bracketLink",
        range: [from, to],
        facingMeta: "[",
        linkName: `${decoration} ${body}`,
        trailingMeta: "]",
      };

  return [...parseText(left, option), node, ...parseText(right, { ...option, offset: to })];
}

function parseTaggedLink(text: string, option: ParseOption, regex: RegExp): Node[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: TaggedLinkNode = {
    type: "taggedLink",
    range: [from, to],
    facingMeta: "[",
    tag,
    linkName,
    trailingMeta: "]",
  };

  return [...parseText(left, option), node, ...parseText(right, { ...option, offset: to })];
}

function parseBracketLink(text: string, option: ParseOption): Node[] {
  const regex = TextLinesConstants.regexes.bracketLink;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: BracketLinkNode = {
    type: "bracketLink",
    range: [from, to],
    facingMeta: "[",
    linkName,
    trailingMeta: "]",
  };

  return [...parseText(left, option), node, ...parseText(right, { ...option, offset: to })];
}

function parseHashTag(text: string, option: ParseOption): Node[] {
  const regex = TextLinesConstants.regexes.hashTag;
  const { left, hashTag, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];
  const node: HashTagNode = { type: "hashTag", range: [from, to], hashTag };
  return [...parseText(left, option), node, ...parseText(right, { ...option, offset: to })];
}

function parseNormal(text: string, option: ParseOption): Node[] {
  const [from, to] = [option.offset, option.offset + text.length];
  const node: NormalNode = { type: "normal", text, range: [from, to] };
  return [node];
}
