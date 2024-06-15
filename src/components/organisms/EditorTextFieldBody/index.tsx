import { Cursor } from '../../molecules/cursor/Cursor';
import { Selection } from '../../molecules/selection/Selection';
import { Text } from '../../molecules/text/Text';

import { useCursor, useSelection, useText } from './hooks';

export const EditorTextFieldBody: React.FC = () => (
  <>
    <EditorTextFieldSelection />
    <EditorTextFieldCursor />
    <EditorTextFieldText />
  </>
);

const EditorTextFieldSelection: React.FC = () => {
  const selectionProps = useSelection();
  return <Selection {...selectionProps} />;
};

const EditorTextFieldCursor: React.FC = () => {
  const cursorProps = useCursor();
  return <Cursor {...cursorProps} />;
};

const EditorTextFieldText: React.FC = () => {
  const textProps = useText();
  return <Text {...textProps} />;
};
