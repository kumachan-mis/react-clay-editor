import './style.global.css';

export { Editor } from './Editor';
export type {
  Props as EditorProps,
  TextProps,
  BracketLinkProps,
  HashTagProps,
  TaggedLinkProps,
  CodeProps,
  FormulaProps,
} from './Editor/types';
export { TextLines as Viewer } from './TextLines';
export type { Props as ViewerProps } from './TextLines/types';
export { defaultLinkNameRegex } from './TextLines/constants';
