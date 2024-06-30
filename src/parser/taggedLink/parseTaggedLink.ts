import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { TaggedLinkNode } from './taggedLinkNode';

export function createTaggedLinkRegex(tagName: string, linkNameRegex = /[^[\]]+/): RegExp {
  const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const linkName = linkNameRegex.source;
  return RegExp(`^(?<left>.*?)\\[(?<tag>${tag}:) (?<linkName>${linkName})\\](?<right>.*)$`);
}

export function parseTaggedLink(
  text: string,
  context: ParsingContext,
  options: ParsingOptions,
  regex: RegExp
): ContentNode[] {
  const { left, tag, linkName, right } = text.match(regex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: TaggedLinkNode = {
    type: 'taggedLink',
    range: [first, last],
    facingMeta: `[${tag} `,
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}
