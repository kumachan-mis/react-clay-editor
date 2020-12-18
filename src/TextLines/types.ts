import { Node } from './parser/types';
import {
  BracketLinkProps,
  HashTagProps,
  TaggedLinkProps,
  CodeProps,
  FormulaProps,
} from '../Editor/types';
import { CursorCoordinate } from '../Cursor/types';

export interface Props {
  text: string;
  textDecoration?: TextDecoration;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  cursorCoordinate: CursorCoordinate | undefined;
}

export interface NodeProps {
  node: Node;
  textDecoration: TextDecoration;
  bracketLinkProps: BracketLinkProps;
  hashTagProps: HashTagProps;
  taggedLinkPropsMap: TaggedLinkPropsMap;
  codeProps: CodeProps;
  formulaProps: FormulaProps;
  curcorLineIndex: number | undefined;
}

export interface TextDecoration {
  fontSizes: Record<'level1' | 'level2' | 'level3', number>;
}

export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };
