import { BlockCodeMetaNode } from '../../../../parser/blockCode/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type BlockCodeMetaProps = TextNodeComponentProps<BlockCodeMetaNode>;

export const BlockCodeMeta: React.FC<BlockCodeMetaProps> = ({ node, textVisual, codeVisual }) => {
  const { lineIndex, indentDepth, codeMeta } = node;
  const lineLength = indentDepth + codeMeta.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeMeta);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent indentDepth={indentDepth} lineIndex={lineIndex} />
      <MonospaceLineContent indentDepth={indentDepth} lineIndex={lineIndex} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeMeta].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index} lineIndex={lineIndex}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};
