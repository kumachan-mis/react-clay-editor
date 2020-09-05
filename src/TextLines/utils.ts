import { TextLinesConstants } from "./constants";
import {
  DecorationSetting,
  ContentWithIndent,
  DecorationStyle,
  Node,
  DecorationNode,
  LinkNode,
  HashTagNode,
  NormalNode,
  ParseOption,
} from "./types";

import { EditorConstants } from "../Editor/constants";

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  const rootElement = element.closest(`.${EditorConstants.editor.className}`);
  if (rootElement == null) return null;
  return rootElement.querySelector(`.${TextLinesConstants.line.className(lineIndex)}`);
}

export function getTextCharElementAt(
  lineIndex: number,
  charIndex: number,
  element: HTMLElement
): HTMLElement | null {
  const rootElement = element.closest(`.${EditorConstants.editor.className}`);
  if (rootElement == null) return null;
  return rootElement.querySelector(`.${TextLinesConstants.char.className(lineIndex, charIndex)}`);
}

export function parseLine(line: string): ContentWithIndent {
  const regex = TextLinesConstants.regexes.indent;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  return { indent, content };
}

export function parseContent(content: string): Node[] {
  return parseText(content, { offset: 0, nested: false });
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

function parseText(text: string, option: ParseOption): Node[] {
  const { regexes } = TextLinesConstants;
  if (regexes.decoration.test(text)) return parseDecoration(text, option);
  else if (regexes.link.test(text)) return parseLink(text, option);
  else if (regexes.hashTag.test(text)) return parseHashTag(text, option);
  else if (regexes.normal.test(text)) return parseNormal(text, option);
  else return [];
}

function parseDecoration(text: string, option: ParseOption): Node[] {
  const regex = TextLinesConstants.regexes.decoration;
  const { left, decoration, body, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: DecorationNode | LinkNode = !option.nested
    ? {
        type: "decoration",
        range: [from, to],
        facingMeta: `[${decoration} `,
        children: parseText(body, { offset: from + decoration.length + 2, nested: true }),
        trailingMeta: "]",
      }
    : {
        type: "link",
        range: [from, to],
        facingMeta: "[",
        linkName: `${decoration} ${body}`,
        trailingMeta: "]",
      };

  return [...parseText(left, option), node, ...parseText(right, { ...option, offset: to })];
}

function parseLink(text: string, option: ParseOption): Node[] {
  const regex = TextLinesConstants.regexes.link;
  const { left, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [from, to] = [option.offset + left.length, option.offset + text.length - right.length];

  const node: LinkNode = {
    type: "link",
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
