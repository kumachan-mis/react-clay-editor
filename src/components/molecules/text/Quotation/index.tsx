import { TextNode } from '../../../../parser';
import { QuotationNode } from '../../../../parser/quotation/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { QuotationLineContent } from '../../../atoms/text/QuotationLineContent';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type QuotationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<QuotationNode>;

export const QuotationConstants = {
  styleId: 'quotation',
};

export const Quotation: React.FC<QuotationProps> = ({ node, getEditMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const editMode = getEditMode(node);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={QuotationConstants.styleId}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <QuotationLineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        {[...meta].map((char, index) => (
          <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
            {editMode ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <ChildComponent key={index} node={child} getEditMode={getEditMode} textVisual={textVisual} {...rest} />
        ))}
      </QuotationLineContent>
    </Line>
  );
};
