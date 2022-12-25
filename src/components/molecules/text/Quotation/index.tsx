import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { Line } from 'src/components/atoms/text/Line';
import { LineContent } from 'src/components/atoms/text/LineContent';
import { LineIndent } from 'src/components/atoms/text/LineIndent';
import { TextNode } from 'src/parser';
import { QuotationNode } from 'src/parser/quotation/types';

import styled from '@emotion/styled';
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

const QuotationLineContent = styled(LineContent)`
  background-color: rgba(125, 128, 128, 0.1);
  border-left: solid 4px #a0a0a0;
  padding-left: 4px;
  font-style: italic;
`;
