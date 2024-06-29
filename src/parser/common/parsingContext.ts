import { DecorationConfig } from '../decoration/decorationConfig';

export type ParsingContext = {
  lineIds: string[];
  lineIndex: number;
  charIndex: number;
  nested: boolean;
  decorationConfig: DecorationConfig;
};
