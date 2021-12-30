import { CursorCoordinate } from '../Cursor/types';
import { BracketLinkProps, HashtagProps, TaggedLinkProps, CodeProps, FormulaProps } from '../Editor/types';

import { Node } from './parser/types';

export interface Props {
  text: string;
  syntax?: 'bracket' | 'markdown';
  cursorCoordinate?: CursorCoordinate;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  className?: string;
  style?: React.CSSProperties;
}

export interface NodeProps {
  node: Node;
  bracketLinkProps: BracketLinkProps;
  hashtagProps: HashtagProps;
  taggedLinkPropsMap: TaggedLinkPropsMap;
  codeProps: CodeProps;
  formulaProps: FormulaProps;
  cursorLineIndex: number | undefined;
}

export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };
