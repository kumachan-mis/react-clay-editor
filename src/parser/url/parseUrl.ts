import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { UrlNode } from './types';

export const urlRegex = /^(?<left>.*?)(?<url>https?:\/\/[\w/:%#$&?()~.=+-]+)(?<right>.*)$/;

export function parseUrl(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, url, right } = text.match(urlRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: UrlNode = {
    type: 'url',
    lineIndex: context.lineIndex,
    range: [first, last],
    url,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
