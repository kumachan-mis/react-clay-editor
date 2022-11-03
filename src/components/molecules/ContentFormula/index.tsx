import React from 'react';

import { ContentFormulaNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { CharGroup } from '../../atoms/CharGroup';
import { KaTeX } from '../../atoms/KaTeX';
import { Monospace } from '../../atoms/Monospace';
import { SyntaxNodeComponentProps } from '../_common/types';

export type ContentFormulaProps = SyntaxNodeComponentProps<ContentFormulaNode>;

export const ContentFormula: React.FC<ContentFormulaProps> = ({ node, editMode, formulaVisual }) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const editModeValue = editMode(node);
  const spanElementProps = formulaVisual?.codeProps?.(formula);

  return (
    <CharGroup
      lineIndex={lineIndex}
      firstCharIndex={first + facingMeta.length}
      lastCharIndex={last - trailingMeta.length}
      {...spanElementProps}
    >
      {!editModeValue ? (
        <KaTeX options={{ throwOnError: false, displayMode }}>{formula}</KaTeX>
      ) : (
        <Monospace>
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
