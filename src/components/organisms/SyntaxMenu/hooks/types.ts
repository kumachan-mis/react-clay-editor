import { State } from '../../Editor/types';

export type CommonMenuProps = {
  text: string;
  state: State;
  onChangeText: (text: string) => void;
  setState: (state: State) => void;
  syntax?: 'bracket' | 'markdown';
};
