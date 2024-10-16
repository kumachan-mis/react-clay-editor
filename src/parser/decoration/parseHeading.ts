import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';
import { NormalLineNode } from '../normalLine/normalLineNode';

import { DecorationConfig } from './decorationConfig';
import { DecorationNode } from './decorationNode';

export const headingRegex = /^(?<facingMeta>(?<heading>#+) )(?<body>.+)(?<trailingMeta>)$/;

export function parseHeading(line: string, context: ParsingContext, options: ParsingOptions): NormalLineNode {
  const { heading, body } = headingRegex.exec(line)?.groups as Record<string, string>;
  const config = stringToConfig(heading);

  const childNode: DecorationNode = {
    type: 'decoration',
    range: [0, line.length - 1],
    facingMeta: `${heading} `,
    children: parseContent(
      body,
      { ...context, charIndex: heading.length + 1, nested: true, decorationConfig: config },
      options
    ),
    trailingMeta: '',
    config,
  };

  const node: NormalLineNode = {
    type: 'normalLine',
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
