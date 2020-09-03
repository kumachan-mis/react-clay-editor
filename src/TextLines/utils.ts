import { TextLinesConstants } from "./constants";
import { TextStyle, TextWithFont, LineWithIndent } from "./types";

import { EditorConstants } from "../Editor/constants";

export function analyzeLine(line: string): LineWithIndent {
  const regex = TextLinesConstants.syntaxRegex.indent;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  return { indent, content };
}

export function analyzeFontOfContent(content: string, textStyle: TextStyle): TextWithFont[] {
  const regex = TextLinesConstants.syntaxRegex.bracket;
  let match: RegExpExecArray | null = null;
  let offset = 0;
  const textsWithFont: TextWithFont[] = [];
  while ((match = regex.exec(content))) {
    if (match.index - offset > 0) {
      const text = content.substring(offset, match.index);
      textsWithFont.push({ text, offset, section: [0, text.length] });
      offset = match.index;
    }

    const text = match[0];
    const option = match.groups?.option || "";
    if (option == "") {
      textsWithFont.push({ text: text, offset, section: [0, text.length] });
      offset = regex.lastIndex;
      continue;
    }

    const { level1, level2, level3 } = textStyle.fontSizes;
    const section: [number, number] = [option.length + 1, text.length - 1];
    const style = { bold: false, italic: false, underline: false, fontSize: level1 };
    for (let i = 0; i < option.length; i++) {
      switch (option[i]) {
        case "*":
          if (!style.bold) {
            style.bold = true;
          } else if (style.fontSize == level1) {
            style.fontSize = level2;
          } else {
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
    textsWithFont.push({ text: text, offset, section, ...style });
    offset = regex.lastIndex;
  }

  if (content.length - offset > 0) {
    const subText = content.substring(offset, content.length);
    textsWithFont.push({ text: subText, offset, section: [0, subText.length] });
  }
  return textsWithFont;
}

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  const rootElement = element.closest(`.${EditorConstants.root.className}`);
  if (rootElement == null) return null;
  return rootElement.querySelector(`.${TextLinesConstants.line.className(lineIndex)}`);
}

export function getTextCharElementAt(
  lineIndex: number,
  charIndex: number,
  element: HTMLElement
): HTMLElement | null {
  const rootElement = element.closest(`.${EditorConstants.root.className}`);
  if (rootElement == null) return null;
  return rootElement.querySelector(`.${TextLinesConstants.char.className(lineIndex, charIndex)}`);
}
