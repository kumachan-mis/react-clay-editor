import { BlockNode, LineNode } from '../../../../parser/types';
import { State } from '../../../organisms/Editor/types';
import { BlockPosition, ContentPosition } from '../hooks/types';

export type ContentMenuProps = {
  lineNodes: LineNode[];
  contentPosition: ContentPosition | undefined;
};

export type LineMenuProps = {
  lineNodes: LineNode[];
};

export type BlockMenuProps = {
  nodes: (LineNode | BlockNode)[];
  blockPosition: BlockPosition | undefined;
};

export type CommonMenuProps = {
  text: string;
  state: State;
  setTextAndState: (text: string, state: State) => void;
  syntax?: 'bracket' | 'markdown';
};
