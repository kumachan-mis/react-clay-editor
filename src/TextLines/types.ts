import { CursorCoordinate } from '../Cursor/types';
import { BracketLinkProps, HashtagProps, TaggedLinkPropsMap, CodeProps, FormulaProps } from '../common/types';
import { Node } from '../parser/types';

export interface Props {
  nodes: Node[];
  cursorCoordinate?: CursorCoordinate;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  className?: string;
  style?: React.CSSProperties;
}

export interface NodeProps<_Node extends Node = Node> {
  node: _Node;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  cursorLineIndex: number | undefined;
  linkForceActive: boolean;
}
