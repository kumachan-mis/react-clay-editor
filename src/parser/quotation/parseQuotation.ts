import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';

import { QuotationNode } from './quotationNode';

export const quotationRegex = /^(?<indent>\s*)(?<meta>> )(?<content>.*)$/;

export function parseQuotation(line: string, context: ParsingContext, options: ParsingOptions): QuotationNode {
  const { indent, meta, content } = line.match(quotationRegex)?.groups as Record<string, string>;

  const node: QuotationNode = {
    type: 'quotation',
    lineId: context.lineIds[context.lineIndex],
    indent,
    meta,
    contentLength: content.length,
    children: parseContent(content, { ...context, charIndex: indent.length + meta.length }, options),
    _lineIndex: context.lineIndex,
  };

  context.lineIndex++;

  return node;
}
