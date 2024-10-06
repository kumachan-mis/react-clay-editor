import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';
import { DecorationConfig } from '../decoration/decorationConfig';

import { HeadingNode } from './headingNode';

export const bracketHeadingRegex = /^\[(?<heading>\*+) (?<body>(?:\[[^[\]]*\]|[^[\]])*)\]$/;

export function parseBracketHeading(line: string, context: ParsingContext, options: ParsingOptions): HeadingNode {
  const { heading, body } = bracketHeadingRegex.exec(line)?.groups as Record<string, string>;
  const level = stringToLevel(heading);
  const decorationConfig: DecorationConfig = { bold: true, italic: false, underline: false, size: level };

  const node: HeadingNode = {
    type: 'heading',
    lineId: context.lineIds[context.lineIndex],
    contentLength: line.length,
    facingMeta: `[${heading} `,
    children: parseContent(
      body,
      { ...context, charIndex: heading.length + 2, nested: true, decorationConfig },
      options
    ),
    trailingMeta: ']',
    level,
    _lineIndex: context.lineIndex,
  };

  context.lineIndex++;

  return node;
}

function stringToLevel(heading: string): 'normal' | 'largest' | 'larger' {
  switch (heading) {
    case '*':
      return 'normal';
    case '**':
      return 'larger';
    default:
      return 'largest';
  }
}
