import { Cursor } from 'src/components/molecules/cursor/Cursor';
import { Selection } from 'src/components/molecules/selection/Selection';
import { Text } from 'src/components/molecules/text/Text';

import { useSelection, useCursor, useText } from './hooks';

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
