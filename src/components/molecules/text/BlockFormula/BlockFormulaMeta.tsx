import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { Line } from 'src/components/atoms/text/Line';
import { LineContent } from 'src/components/atoms/text/LineContent';
import { LineIndent } from 'src/components/atoms/text/LineIndent';
import { Monospace } from 'src/components/atoms/text/Monospace';
import { BlockFormulaMetaNode } from 'src/parser/blockFormula/types';

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
