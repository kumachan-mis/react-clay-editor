import styled from '@emotion/styled';
import React from 'react';

import { Header } from '../../../atoms/header/Header';

import { TextNodeComponent } from './TextNodeComponent';
import { useTextNodeComponent } from './TextNodeComponent.hooks';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({ nodes, cursorCoordinate, textSelection, className, ...visuals }) => {
  const { editMode, linkForceClickable } = useTextNodeComponent(cursorCoordinate, textSelection);

  return (
    <StyledText className={className}>
      {visuals.textVisual?.header && (
        <Header size={visuals.textVisual?.headerSize}>{visuals.textVisual?.header}</Header>
      )}
      {nodes.map((node, index) => (
        <TextNodeComponent
          key={index}
          node={node}
          editMode={editMode}
          linkForceClickable={linkForceClickable}
          {...visuals}
        />
      ))}
    </StyledText>
  );
};

const StyledText = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
`;
