import styled from '@emotion/styled';
import React from 'react';

import { QuotationNode, TextNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { Line } from '../../atoms/Line';
import { LineContent } from '../../atoms/LineContent';
import { LineIndent } from '../../atoms/LineIndent';
import { TextNodeComponentProps } from '../_common/types';

export type QuotationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<QuotationNode>;

export const Quotation: React.FC<QuotationProps> = ({ node, editMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const editModeValue = editMode(node);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <QuotationLineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        {[...meta].map((char, index) => (
          <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
            {editModeValue ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <ChildComponent key={index} node={child} editMode={editMode} textVisual={textVisual} {...rest} />
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
