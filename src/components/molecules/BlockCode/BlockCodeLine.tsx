import React from 'react';

import { BlockCodeLineNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { Line } from '../../atoms/Line';
import { LineIndent } from '../../atoms/LineIndent';
import { Monospace } from '../../atoms/Monospace';
import { TextNodeComponentProps } from '../_common/types';

import { BlockCodeContent } from './BlockCodeContent';

export type BlockCodeLineProps = TextNodeComponentProps<BlockCodeLineNode>;

export const BlockCodeLine: React.FC<BlockCodeLineProps> = ({ node, textVisual, codeVisual }) => {
  const { codeLine, lineIndex, indentDepth } = node;

  const lineLength = indentDepth + codeLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <BlockCodeContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeLine].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </BlockCodeContent>
    </Line>
  );
};
