import { BlockFormulaMetaNode } from '../../../../parser/blockFormula/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type BlockFormulaMetaProps = TextNodeComponentProps<BlockFormulaMetaNode>;

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
