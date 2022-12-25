import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { Line } from 'src/components/atoms/text/Line';
import { LineIndent } from 'src/components/atoms/text/LineIndent';
import { Monospace } from 'src/components/atoms/text/Monospace';
import { BlockCodeMetaNode } from 'src/parser/blockCode/types';

import { BlockCodeContent } from './BlockCodeContent';

import React from 'react';

export type BlockCodeMetaProps = TextNodeComponentProps<BlockCodeMetaNode>;

export const BlockCodeMeta: React.FC<BlockCodeMetaProps> = ({ node, textVisual, codeVisual }) => {
  const { lineIndex, indentDepth, codeMeta } = node;
  const lineLength = indentDepth + codeMeta.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeMeta);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <BlockCodeContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeMeta].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </BlockCodeContent>
    </Line>
  );
};
