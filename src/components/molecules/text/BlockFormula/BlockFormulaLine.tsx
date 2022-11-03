import React from 'react';

import { BlockFormulaLineNode } from '../../../../parser/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../_common/types';

export type BlockFormulaLineProps = TextNodeComponentProps<BlockFormulaLineNode>;

export const BlockFormulaLine: React.FC<BlockFormulaLineProps> = ({ node, textVisual, formulaVisual }) => {
  const { formulaLine, lineIndex, indentDepth } = node;
  const lineLength = indentDepth + formulaLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = formulaVisual?.codeProps?.(formulaLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...formulaLine].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </LineContent>
    </Line>
  );
};
