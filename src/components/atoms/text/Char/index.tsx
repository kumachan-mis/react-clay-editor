import React from 'react';

export type CharProps = {
  readonly charIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const CharConstants = {
  selectId: (charIndex: number): string => `char-C${charIndex}`,
  selectIdRegex: RegExp('char-C(?<charIndex>\\d+)'),
};

const CharComponent: React.FC<CharProps> = ({ charIndex, ...rest }) => (
  <span {...rest} data-selectid={CharConstants.selectId(charIndex)} />
);

export const Char = React.memo(CharComponent);
