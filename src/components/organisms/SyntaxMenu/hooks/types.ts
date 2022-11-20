import { State } from '../../Editor/types';

export type CommonMenuProps = {
  text: string;
  state: State;
  setTextAndState: (text: string, state: State) => void;
  syntax?: 'bracket' | 'markdown';
};
