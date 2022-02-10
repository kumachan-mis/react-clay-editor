import { CursorCoordinate } from '../Cursor/types';
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

export interface BracketLinkProps {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
}

export interface HashtagProps {
  anchorProps?: (hashtagName: string) => React.ComponentProps<'a'>;
}

export interface TaggedLinkProps {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
  tagHidden?: boolean;
}
export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };

export interface CodeProps {
  codeProps?: (code: string) => React.ComponentProps<'code'>;
}

export interface FormulaProps {
  spanProps?: (formula: string) => React.ComponentProps<'span'>;
}
