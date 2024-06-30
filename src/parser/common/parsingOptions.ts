export type ParsingOptions = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkDisabled?: boolean;
  hashtagDisabled?: boolean;
  codeDisabled?: boolean;
  formulaDisabled?: boolean;
  taggedLinkRegexes?: RegExp[];
};
