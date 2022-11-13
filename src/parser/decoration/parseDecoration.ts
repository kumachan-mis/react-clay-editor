import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { Decoration, DecorationNode } from './types';

export const decorationRegex = /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/;

export function parseDecoration(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, decoration: decoString, body, right } = text.match(decorationRegex)?.groups as Record<string, string>;
  const decoration = stringToDecoration(decoString);
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: `[${decoString} `,
    children: parseContent(
      body,
      { ...context, charIndex: first + decoString.length + 2, nested: true, decoration: decoration },
      options
    ),
    trailingMeta: ']',
    decoration: decoration,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function stringToDecoration(decoString: string): Decoration {
  const decoration: Decoration = { bold: false, italic: false, underline: false, size: 'normal' };

  for (let i = 0; i < decoString.length; i++) {
    switch (decoString[i]) {
      case '*':
        if (!decoration.bold) {
          decoration.bold = true;
        } else if (decoration.size === 'normal') {
          decoration.size = 'larger';
        } else if (decoration.size === 'larger') {
          decoration.size = 'largest';
        }
        break;
      case '/':
        decoration.italic = true;
        break;
      case '_':
        decoration.underline = true;
        break;
    }
  }

  return decoration;
}
