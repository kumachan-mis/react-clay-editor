import { TextLinesConstants } from "./constants";
import { TextStyle, TextWithStyle, LineWithIndent } from "./types";

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

export function analyzeLine(line: string): LineWithIndent {
  const regex = TextLinesConstants.syntaxRegex.indent;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;
  return { indent, content };
}

export function analyzeContentStyle(content: string, textStyle: TextStyle): TextWithStyle[] {
  const regex = TextLinesConstants.syntaxRegex.bracket;
  let match: RegExpExecArray | null = null;
  let offset = 0;
  const textsWithFont: TextWithStyle[] = [];
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
    } else {
      const section: [number, number] = [option.length + 1, text.length - 1];
      const style = analyzeBracketOption(option, textStyle);
      textsWithFont.push({ text: text, offset, section, ...style });
    }
    offset = regex.lastIndex;
  }

  if (content.length - offset > 0) {
    const subText = content.substring(offset, content.length);
    textsWithFont.push({ text: subText, offset, section: [0, subText.length] });
  }
  return textsWithFont;
}

function analyzeBracketOption(
  option: string,
  textStyle: TextStyle
): Required<Pick<TextWithStyle, "bold" | "italic" | "underline" | "fontSize">> {
  const { level1, level2, level3 } = textStyle.fontSizes;
  const style = { bold: false, italic: false, underline: false, fontSize: level1 };
  for (let i = 0; i < option.length - 1; i++) {
    switch (option[i]) {
      case "*":
        if (!style.bold) style.bold = true;
        else if (style.fontSize == level1) style.fontSize = level2;
        else if (style.fontSize == level2) style.fontSize = level3;
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
