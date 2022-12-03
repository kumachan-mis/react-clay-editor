import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { NormalLineNode } from '../normalLine/types';

import { Decoration, DecorationNode } from './types';

export const headingRegex = /^(?<facingMeta>(?<heading>#+) )(?<body>.+)(?<trailingMeta>)$/;

export function parseHeading(line: string, context: ParsingContext, options: ParsingOptions): NormalLineNode {
  const { heading, body } = line.match(headingRegex)?.groups as Record<string, string>;
  const decoration = stringToDecoration(heading);

  const childNode: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [0, line.length - 1],
    facingMeta: `${heading} `,
    children: parseContent(body, { ...context, charIndex: heading.length + 1, nested: true, decoration }, options),
    trailingMeta: '',
    decoration: decoration,
  };

  const node: NormalLineNode = {
    type: 'normalLine',
    lineIndex: context.lineIndex,
    contentLength: line.length,
    children: [childNode],
  };

  context.lineIndex++;

  return node;
}

function stringToDecoration(heading: string): Decoration {
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
