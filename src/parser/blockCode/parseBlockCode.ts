import { ParsingContext } from '../common/types';

import { createBlockCodeLineRegex, parseBlockCodeLine } from './parseBlockCodeLine';
import { parseBlockCodeMeta, blockCodeMetaRegex } from './parseBlockCodeMeta';
import { BlockCodeNode } from './types';

export function parseBlockCode(lines: string[], context: ParsingContext): BlockCodeNode {
  const originalLineIndex = context.lineIndex;
  const facingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
  const blockCodeLineRegex = createBlockCodeLineRegex(facingMeta.indentDepth);

  context.lineIndex++;

  const node: BlockCodeNode = {
    type: 'blockCode',
    range: [originalLineIndex, context.lineIndex],
    facingMeta,
    children: [],
  };

  while (context.lineIndex < lines.length) {
    if (blockCodeMetaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth === facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node.range[1] = context.lineIndex - 1;
      return node;
    }

    if (!blockCodeLineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockCodeLine(lines[context.lineIndex], context, blockCodeLineRegex));
    context.lineIndex++;
  }

  node.range[1] = context.lineIndex - 1;
  return node;
}
