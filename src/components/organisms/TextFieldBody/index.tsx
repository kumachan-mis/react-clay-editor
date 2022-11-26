import React from 'react';

import { TextFieldBody as Atom } from '../../atoms/editor/TextFieldBody';
import { Cursor } from '../../molecules/cursor/Cursor';
import { Selection } from '../../molecules/selection/Selection';
import { Text } from '../../molecules/text/Text';

import { useCursor, useSelection, useText, useTextFieldBody } from './hooks';

export const TextFieldBody: React.FC = () => {
  const { ref, onMouseDown, onClick } = useTextFieldBody();
  const selectionProps = useSelection();
  const cursorProps = useCursor();
  const textProps = useText();

  return (
    <Atom ref={ref} onMouseDown={onMouseDown} onClick={onClick}>
      <Selection {...selectionProps} />
      <Cursor {...cursorProps} />
      <Text {...textProps} />
    </Atom>
  );
};
