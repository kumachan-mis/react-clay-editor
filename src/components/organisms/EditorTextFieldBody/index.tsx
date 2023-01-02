import { Cursor } from '../../molecules/cursor/Cursor';
import { Selection } from '../../molecules/selection/Selection';
import { Text } from '../../molecules/text/Text';

import { useCursor, useSelection, useText } from './hooks';

import React from 'react';

export const EditorTextFieldBody: React.FC = () => {
  const selectionProps = useSelection();
  const cursorProps = useCursor();
  const textProps = useText();

  return (
    <>
      <Selection {...selectionProps} />
      <Cursor {...cursorProps} />
      <Text {...textProps} />
    </>
  );
};
