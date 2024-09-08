import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { UrlNode } from './urlNode';

export const urlRegex = /^(?<left>.*?)(?<url>https?:\/\/[\w/:%#$&?()~.=+-]+)(?<right>.*)$/;

export function parseUrl(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, url, right } = urlRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: UrlNode = {
    type: 'url',
    range: [first, last],
    url,
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
