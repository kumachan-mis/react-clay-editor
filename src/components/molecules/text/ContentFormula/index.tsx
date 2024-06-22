import { ContentFormulaNode, contentFormulaNodeEquals } from '../../../../parser/content/contentFormulaNode';
import { Char } from '../../../atoms/text/Char';
import { CharGroup } from '../../../atoms/text/CharGroup';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type ContentFormulaProps = TextNodeProps<ContentFormulaNode>;

export const ContentFormulaConstants = {
  styleId: (displayMode: boolean) => (displayMode ? 'display-formula' : 'inline-formula'),
};

const ContentFormulaComponent: React.FC<ContentFormulaProps> = ({ node, editMode, formulaVisual }) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const codeElementProps = formulaVisual?.codeProps?.(formula);

  return (
    <CharGroup
      data-styleid={ContentFormulaConstants.styleId(displayMode)}
      firstCharIndex={first + facingMeta.length}
      lastCharIndex={last - trailingMeta.length}
      lineIndex={lineIndex}
    >
      {!editMode ? (
        <KaTeX displayMode={displayMode}>{formula}</KaTeX>
      ) : (
        <Monospace {...codeElementProps}>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
              {char}
            </Char>
          ))}
        </Monospace>
      )}
    </CharGroup>
  );
};

export const ContentFormula = React.memo(
  ContentFormulaComponent,
  (prev, next) =>
    contentFormulaNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.formulaVisual === next.formulaVisual
);
