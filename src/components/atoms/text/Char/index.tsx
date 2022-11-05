import React from 'react';

import { createTestId } from '../../../../common/utils';

export type CharProps = {
  lineIndex: number;
  charIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const CharConstants = {
  selectId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
  selectIdRegex: RegExp('char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
  testId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, ...rest }) => (
  <span
    {...rest}
    data-selectid={CharConstants.selectId(lineIndex, charIndex)}
    data-testid={createTestId(CharConstants.testId(lineIndex, charIndex))}
  />
);
