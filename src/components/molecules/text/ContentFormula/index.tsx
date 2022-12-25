import React from 'react';

import { ContentFormulaNode } from '../../../../parser/content/types';
import { Char } from '../../../atoms/text/Char';
import { CharGroup } from '../../../atoms/text/CharGroup';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

export type ContentFormulaProps = TextNodeComponentProps<ContentFormulaNode>;

export const ContentFormulaConstants = {
  styleId: (displayMode: boolean) => (displayMode ? 'display-formula' : 'inline-formula'),
};

export const ContentFormula: React.FC<ContentFormulaProps> = ({ node, getEditMode, formulaVisual }) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const codeElementProps = formulaVisual?.codeProps?.(formula);

  return (
    <CharGroup
      lineIndex={lineIndex}
      firstCharIndex={first + facingMeta.length}
      lastCharIndex={last - trailingMeta.length}
      data-styleid={ContentFormulaConstants.styleId(displayMode)}
    >
      {!editMode ? (
        <KaTeX options={{ throwOnError: false, displayMode }}>{formula}</KaTeX>
      ) : (
        <Monospace {...codeElementProps}>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      )}
    </CharGroup>
  );
};
