import { ParsingContext } from '../common/types';

import { BlockCodeMetaNode } from './types';

export const blockCodeMetaRegex = /^(?<indent>\s*)(?<codeMeta>```)$/;

export function parseBlockCodeMeta(line: string, context: ParsingContext): BlockCodeMetaNode {
  const { indent, codeMeta } = line.match(blockCodeMetaRegex)?.groups as Record<string, string>;

  const node: BlockCodeMetaNode = {
    type: 'blockCodeMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeMeta,
  };

  return node;
}
