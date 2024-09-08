import { ParsingContext } from '../common/parsingContext';

import { BlockCodeMetaNode } from './blockCodeMetaNode';

export const blockCodeMetaRegex = /^(?<indent>\s*)(?<codeMeta>```)$/;

export function parseBlockCodeMeta(line: string, context: ParsingContext): BlockCodeMetaNode {
  const { indent, codeMeta } = blockCodeMetaRegex.exec(line)?.groups as Record<string, string>;

  const node: BlockCodeMetaNode = {
    type: 'blockCodeMeta',
    lineId: context.lineIds[context.lineIndex],
    indent,
    codeMeta,
    _lineIndex: context.lineIndex,
  };

  return node;
}
