import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { Line } from 'src/components/atoms/text/Line';
import { LineIndent } from 'src/components/atoms/text/LineIndent';
import { Monospace } from 'src/components/atoms/text/Monospace';
import { BlockCodeLineNode } from 'src/parser/blockCode/types';

import { BlockCodeContent } from './BlockCodeContent';

import React from 'react';

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
