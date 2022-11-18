import { BlockNode } from '../../../../parser/block/types';
import { LineNode } from '../../../../parser/line/types';
import { State } from '../../Editor/types';
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
