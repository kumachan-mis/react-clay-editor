import styled from '@emotion/styled';
import React from 'react';

import { TextNode } from '../../../../parser';
import { QuotationNode } from '../../../../parser/quotation/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { TextNodeComponentProps } from '../common/types';

export type QuotationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<QuotationNode>;

export const Quotation: React.FC<QuotationProps> = ({ node, getEditMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const editMode = getEditMode(node);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
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

const QuotationLineContent = styled(LineContent)`
  background-color: rgba(125, 128, 128, 0.1);
  border-left: solid 4px #a0a0a0;
  padding-left: 4px;
  font-style: italic;
`;
