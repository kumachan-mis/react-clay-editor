import { DecorationConfig } from '../decoration/decorationConfig';

export type ParsingContext = {
  lineIndex: number;
  charIndex: number;
  nested: boolean;
  decorationConfig: DecorationConfig;
};
