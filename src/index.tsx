import './style.global.css';

export { Editor } from './Editor';
export { TextLines as Viewer } from './TextLines';
export { defaultLinkNameRegex } from './TextLines/constants';

export type {
  Props as EditorProps,
  TextProps,
  BracketLinkProps,
  HashTagProps,
  TaggedLinkProps,
  CodeProps,
  FormulaProps,
} from './Editor/types';
export type { Props as ViewerProps } from './TextLines/types';
