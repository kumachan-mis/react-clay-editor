import styled from '@emotion/styled';
import React from 'react';

import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../common/types';
import { Header } from '../components/atoms/Header';
import { CursorCoordinate } from '../components/molecules/Cursor/types';
import { TextSelection } from '../components/molecules/Selection/types';
import { SyntaxNode } from '../parser/types';

import { SyntaxNodeComponent } from './SyntaxNodeComponent';
import { useSyntaxNodeComponent } from './SyntaxNodeComponent.hooks';

export interface TextLinesProps {
  nodes: SyntaxNode[];
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

export const TextLines: React.FC<TextLinesProps> = ({
  nodes,
  cursorCoordinate,
  textSelection,
  className,
  ...visuals
}) => {
  const { editMode, linkForceClickable } = useSyntaxNodeComponent(cursorCoordinate, textSelection);

  return (
    <StyledTextLines className={className}>
      {visuals.textVisual?.header && (
        <Header size={visuals.textVisual?.headerSize}>{visuals.textVisual?.header}</Header>
      )}
      {nodes.map((node, index) => (
        <SyntaxNodeComponent
          key={index}
          node={node}
          editMode={editMode}
          linkForceClickable={linkForceClickable}
          {...visuals}
        />
      ))}
    </StyledTextLines>
  );
};

const StyledTextLines = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
`;
