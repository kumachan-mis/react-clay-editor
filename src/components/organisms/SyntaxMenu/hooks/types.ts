import { EditorState } from '../../Editor/types';

export type CommonMenuProps = {
  text: string;
  state: EditorState;
  onChangeText: (text: string) => void;
  setState: (state: EditorState) => void;
  syntax?: 'bracket' | 'markdown';
};
