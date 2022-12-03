import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';

import { QuotationNode } from './types';

export const quotationRegex = /^(?<indent>\s*)(?<meta>> )(?<content>.*)$/;

export function parseQuotation(line: string, context: ParsingContext, options: ParsingOptions): QuotationNode {
  const { indent, meta, content } = line.match(quotationRegex)?.groups as Record<string, string>;

  const node: QuotationNode = {
    type: 'quotation',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    contentLength: content.length,
    meta,
    children: parseContent(content, { ...context, charIndex: indent.length + meta.length }, options),
  };

  context.lineIndex++;

  return node;
}
