import React from 'react';

import { BlockCodeMetaNode } from '../../../../parser/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../_common/types';

import { BlockCodeContent } from './BlockCodeContent';

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
