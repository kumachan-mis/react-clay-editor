import { Decoration } from '../decoration/types';

export type ParsingContext = {
  lineIndex: number;
  charIndex: number;
  nested: boolean;
  decoration: Decoration;
};

export type ParsingOptions = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkDisabled?: boolean;
  hashtagDisabled?: boolean;
  codeDisabled?: boolean;
  formulaDisabled?: boolean;
  taggedLinkRegexes?: RegExp[];
};
