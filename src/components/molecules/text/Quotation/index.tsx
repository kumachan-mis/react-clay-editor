import { QuotationNode, quotationNodeEquals } from '../../../../parser/quotation/quotationNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { QuotationLineContent } from '../../../atoms/text/QuotationLineContent';
import { TextNode } from '../Text/TextNode';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type QuotationProps = TextNodeProps<QuotationNode>;

export const QuotationConstants = {
  styleId: 'quotation',
};

const QuotationComponent: React.FC<QuotationProps> = ({ node, editMode, ...rest }) => {
  const { lineId, indent, meta, contentLength, children } = node;
  const lineLength = indent.length + meta.length + contentLength;

  return (
    <Line data-styleid={QuotationConstants.styleId} lineId={lineId}>
      <LineIndent indentDepth={indent.length} />
      <QuotationLineContent indentDepth={indent.length} lineLength={lineLength}>
        {[...meta].map((char, index) => (
          <Char charIndex={indent.length + index} key={indent.length + index}>
            {editMode ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <TextNode editMode={editMode} key={index} node={child} {...rest} />
        ))}
      </QuotationLineContent>
    </Line>
  );
};

export const Quotation: React.FC<QuotationProps> = React.memo(
  QuotationComponent,
  createTextNodePropsEquals(quotationNodeEquals)
);
