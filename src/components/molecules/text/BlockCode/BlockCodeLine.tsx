import { BlockCodeLineNode } from '../../../../parser/blockCode/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type BlockCodeLineProps = TextNodeComponentProps<BlockCodeLineNode>;

export const BlockCodeLine: React.FC<BlockCodeLineProps> = ({ node, textVisual, codeVisual }) => {
  const { codeLine, lineIndex, indentDepth } = node;

  const lineLength = indentDepth + codeLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent indentDepth={indentDepth} lineIndex={lineIndex} />
      <MonospaceLineContent indentDepth={indentDepth} lineIndex={lineIndex} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeLine].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index} lineIndex={lineIndex}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};
