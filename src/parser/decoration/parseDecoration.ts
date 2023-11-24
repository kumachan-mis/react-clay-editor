import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { DecorationConfig, DecorationNode } from './types';

export const decorationRegex = /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/;

export function parseDecoration(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, decoration, body, right } = text.match(decorationRegex)?.groups as Record<string, string>;
  const config = stringToConfig(decoration);
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: `[${decoration} `,
    children: parseContent(
      body,
      { ...context, charIndex: first + decoration.length + 2, nested: true, decorationConfig: config },
      options
    ),
    trailingMeta: ']',
    config,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

function stringToConfig(decoration: string): DecorationConfig {
  const config: DecorationConfig = { bold: false, italic: false, underline: false, size: 'normal' };

  for (const decorationChar of decoration) {
    switch (decorationChar) {
      case '*':
        if (!config.bold) {
          config.bold = true;
        } else if (config.size === 'normal') {
          config.size = 'larger';
        } else if (config.size === 'larger') {
          config.size = 'largest';
        }
        break;
      case '/':
        config.italic = true;
        break;
      case '_':
        config.underline = true;
        break;
    }
  }

  return config;
}
