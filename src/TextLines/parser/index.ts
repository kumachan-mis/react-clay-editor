import { parseBlockCode, parseBlockFormula, parseQuotation, parseItemization } from './lineParser';
import { LineNode } from './nodes';
import { ParsingContext, ParsingOptions, DecorationStyle } from './types';
import { TextLinesConstants } from '../constants';
import { TextDecoration } from '../types';

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
