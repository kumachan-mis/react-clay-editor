import styled from '@emotion/styled';
import React from 'react';

import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../common/types';
import { TextNode } from '../../../parser/types';
import { Header } from '../../atoms/Header';
import { CursorCoordinate } from '../../molecules/Cursor/types';
import { TextSelection } from '../../molecules/Selection/types';

import { TextNodeComponent } from './TextNodeComponent';
import { useTextNodeComponent } from './TextNodeComponent.hooks';

export interface TextLinesProps {
  nodes: TextNode[];
  cursorCoordinate?: CursorCoordinate;
  textSelection?: TextSelection;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
  className?: string;
}

export const Text: React.FC<TextLinesProps> = ({ nodes, cursorCoordinate, textSelection, className, ...visuals }) => {
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
