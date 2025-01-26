import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';
import { DecorationConfig } from '../decoration/decorationConfig';
import { DecorationNode } from '../decoration/decorationNode';

import { HeadingNode } from './headingNoode';

export const markdownHeadingRegex = /^(?<facingMeta>(?<heading>#+) )(?<body>.+)(?<trailingMeta>)$/;

export function parseMarkdownHeading(line: string, context: ParsingContext, options: ParsingOptions): HeadingNode {
  const { heading, body } = markdownHeadingRegex.exec(line)?.groups as Record<string, string>;
  const config = stringToConfig(heading);

  const childNode: DecorationNode = {
    type: 'decoration',
    range: [0, line.length - 1],
    facingMeta: `${heading} `,
    children: parseContent(
      body,
      { ...context, charIndex: heading.length + 1, nested: true, decorationConfig: config },
      options,
    ),
    trailingMeta: '',
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
  let size: 'normal' | 'largest' | 'larger' = 'normal';

  switch (heading) {
    case '#':
      size = 'largest';
      break;
    case '##':
      size = 'larger';
      break;
  }

  return { bold: true, italic: false, underline: false, size };
}
