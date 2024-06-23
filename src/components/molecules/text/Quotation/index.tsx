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

const QuotationComponent: React.FC<QuotationProps> = ({ node, editMode, textVisual, ...rest }) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={QuotationConstants.styleId}>
      <LineIndent indentDepth={indentDepth} />
      <QuotationLineContent indentDepth={indentDepth} lineLength={lineLength}>
        {[...meta].map((char, index) => (
          <Char charIndex={indentDepth + index} key={indentDepth + index}>
            {editMode ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <TextNode editMode={editMode} key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </QuotationLineContent>
    </Line>
  );
};

export const Quotation: React.FC<QuotationProps> = React.memo(
  QuotationComponent,
  createTextNodePropsEquals(quotationNodeEquals)
);
