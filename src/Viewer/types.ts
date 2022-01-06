import { BracketLinkProps, HashtagProps, TaggedLinkPropsMap, CodeProps, FormulaProps } from '../common/types';

export interface Props {
  text: string;
  syntax?: 'bracket' | 'markdown';
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  className?: string;
  style?: React.CSSProperties;
}
