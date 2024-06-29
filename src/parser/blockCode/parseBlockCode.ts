import { ParsingContext } from '../common/parsingContext';

import { BlockCodeNode } from './blockCodeNode';
import { createBlockCodeLineRegex, parseBlockCodeLine } from './parseBlockCodeLine';
import { blockCodeMetaRegex, parseBlockCodeMeta } from './parseBlockCodeMeta';

export function parseBlockCode(lines: string[], context: ParsingContext): BlockCodeNode {
  const facingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
  const blockCodeLineRegex = createBlockCodeLineRegex(facingMeta.indent.length);

  context.lineIndex++;

  const node: BlockCodeNode = {
    type: 'blockCode',
    facingMeta,
    children: [],
    _lineRange: [context.lineIndex - 1, context.lineIndex - 1],
  };

  while (context.lineIndex < lines.length) {
    if (blockCodeMetaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indent.length === facingMeta.indent.length) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node._lineRange[1] = context.lineIndex - 1;
      return node;
    }

    if (!blockCodeLineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockCodeLine(lines[context.lineIndex], context, blockCodeLineRegex));
    context.lineIndex++;
  }

  node._lineRange[1] = context.lineIndex - 1;
  return node;
}
