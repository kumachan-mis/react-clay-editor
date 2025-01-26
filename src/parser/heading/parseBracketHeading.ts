import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';
import { DecorationConfig } from '../decoration/decorationConfig';
import { DecorationNode } from '../decoration/decorationNode';

import { HeadingNode } from './headingNoode';

export const bracketHeadingRegex = /^\[(?<heading>[*]+) (?<body>(?:\[[^[\]]*\]|[^[\]])*)\]$/;

export function parseBracketHeading(line: string, context: ParsingContext, options: ParsingOptions): HeadingNode {
  const { heading, body } = bracketHeadingRegex.exec(line)?.groups as Record<string, string>;
  const config = stringToConfig(heading);
  const [first, last] = [context.charIndex, context.charIndex + line.length - 1];

  const childNode: DecorationNode = {
    type: 'decoration',
    range: [first, last],
    facingMeta: `[${heading} `,
    children: parseContent(
      body,
      { ...context, charIndex: first + heading.length + 2, nested: true, decorationConfig: config },
      options,
    ),
    trailingMeta: ']',
    config,
  };

  const node: HeadingNode = {
    type: 'heading',
    lineId: context.lineIds[context.lineIndex],
    contentLength: line.length,
    children: [childNode],
    _lineIndex: context.lineIndex,
  };

  context.lineIndex++;

  return node;
}

function stringToConfig(heading: string): DecorationConfig {
  let size: 'normal' | 'largest' | 'larger' = 'largest';

  switch (heading) {
    case '*':
      size = 'normal';
      break;
    case '**':
      size = 'larger';
      break;
  }

  return { bold: true, italic: false, underline: false, size };
}
