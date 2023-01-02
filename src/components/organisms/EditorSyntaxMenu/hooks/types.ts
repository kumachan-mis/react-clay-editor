import { EditorState } from '../../../../contexts/EditorStateContext';

export type CommonMenuProps = {
  text: string;
  state: EditorState;
  setText: (text: string) => void;
  setState: (state: EditorState) => void;
  syntax?: 'bracket' | 'markdown';
};
