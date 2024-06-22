import { ParsingContext } from '../common/parsingContext';
import { ContentNode } from '../content/contentNode';

import { NormalNode } from './normalNode';

export const normalRegex = /^(?<text>.+)$/;

export function parseNormal(text: string, context: ParsingContext): ContentNode[] {
  const [first, last] = [context.charIndex, context.charIndex + text.length - 1];

  const node: NormalNode = {
    type: 'normal',
    lineIndex: context.lineIndex,
    text,
    range: [first, last],
  };

  return [node];
}
