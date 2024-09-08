import { ParsingContext } from '../common/parsingContext';
import { ContentNode } from '../content/contentNode';

import { NormalNode } from './normalNode';

export function parseNormal(text: string, context: ParsingContext): ContentNode[] {
  const [first, last] = [context.charIndex, context.charIndex + text.length - 1];

  const node: NormalNode = {
    type: 'normal',
    text,
    range: [first, last],
  };

  return [node];
}
