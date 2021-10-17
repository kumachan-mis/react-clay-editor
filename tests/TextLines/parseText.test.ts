import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { parseText } from '../../src/TextLines/parser';
import { Node, ParsingOptions } from '../../src/TextLines/parser/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
  options?: Omit<ParsingOptions, 'syntax'>;
}

interface Common {
  options?: Omit<ParsingOptions, 'syntax'>;
}

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common?: Common) => void {
  return (testCase, common) => {
    const options: ParsingOptions = {
      disabledMap: { bracketLink: false, hashTag: false, code: false, formula: false },
      taggedLinkRegexes: [],
      syntax,
      ...common?.options,
      ...testCase.options,
    };
    const actualNodes = parseText(testCase.inputLines.join('\n'), options);
    expect(actualNodes).toMatchObject(testCase.expectedNodes);
  };
}

fixtureTest<TestCase, Common | undefined>(
  'parseText',
  'TextLines',
  ['parseCommonText', 'parseBracketText'],
  createTest('bracket')
);
fixtureTest<TestCase, Common | undefined>(
  'parseText',
  'TextLines',
  ['parseCommonText', 'parseMarkdownText'],
  createTest('markdown')
);
