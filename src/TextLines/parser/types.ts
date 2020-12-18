export interface ParsingContext {
  lineIndex: number;
  charIndex: number;
  nested: boolean;
}

export interface ParsingOptions {
  taggedLinkRegexes: RegExp[];
  disabledMap: { [key in 'bracketLink' | 'hashTag' | 'code' | 'formula']: boolean | undefined };
}

export interface DecorationStyle {
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export { Node } from './nodes';
