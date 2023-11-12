import { DecorationConfig } from '../decoration/types';

export type ParsingContext = {
  lineIndex: number;
  charIndex: number;
  nested: boolean;
  decorationConfig: DecorationConfig;
};

export type ParsingOptions = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkDisabled?: boolean;
  hashtagDisabled?: boolean;
  codeDisabled?: boolean;
  formulaDisabled?: boolean;
  taggedLinkRegexes?: RegExp[];
};
