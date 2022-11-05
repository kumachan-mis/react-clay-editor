import { BlockNode, LineNode } from '../../../../parser/types';
import { State } from '../../../organisms/Editor/types';
import { BlockPosition, ContentPosition } from '../hooks/types';

export interface ContentMenuProps {
  lineNodes: LineNode[];
  contentPosition: ContentPosition | undefined;
}

export interface LineMenuProps {
  lineNodes: LineNode[];
}

export interface BlockMenuProps {
  nodes: (LineNode | BlockNode)[];
  blockPosition: BlockPosition | undefined;
}

export interface CommonMenuProps {
  text: string;
  state: State;
  setTextAndState: (text: string, state: State) => void;
  syntax?: 'bracket' | 'markdown';
}
