import React from 'react';

import { BlockFormulaMetaNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { Line } from '../../atoms/Line';
import { LineContent } from '../../atoms/LineContent';
import { LineIndent } from '../../atoms/LineIndent';
import { Monospace } from '../../atoms/Monospace';
import { SyntaxNodeComponentProps } from '../_common/types';

export type BlockFormulaMetaProps = SyntaxNodeComponentProps<BlockFormulaMetaNode>;

export const BlockFormulaMeta: React.FC<BlockFormulaMetaProps> = ({ node, textVisual, formulaVisual }) => {
  const { formulaMeta, lineIndex, indentDepth } = node;
  const lineLength = indentDepth + formulaMeta.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = formulaVisual?.codeProps?.(formulaMeta);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...formulaMeta].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </LineContent>
    </Line>
  );
};
