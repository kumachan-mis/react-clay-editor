import { ContentFormulaNode } from '../../../../parser/content/types';
import { Char } from '../../../atoms/text/Char';
import { CharGroup } from '../../../atoms/text/CharGroup';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type ContentFormulaProps = TextNodeComponentProps<ContentFormulaNode>;

export const ContentFormulaConstants = {
  styleId: (displayMode: boolean) => (displayMode ? 'display-formula' : 'inline-formula'),
};

const ContentFormulaComponent: React.FC<ContentFormulaProps> = ({ node, getEditMode, formulaVisual }) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const editMode = getEditMode(node);
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

function contentFormulaNodeEquals(a: ContentFormulaNode, b: ContentFormulaNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.formula === b.formula &&
    a.trailingMeta === b.trailingMeta
  );
}

export const ContentFormula = React.memo(
  ContentFormulaComponent,
  (prev, next) =>
    contentFormulaNodeEquals(prev.node, next.node) &&
    prev.getEditMode === next.getEditMode &&
    prev.formulaVisual === next.formulaVisual
);
