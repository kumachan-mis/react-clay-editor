import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { parseText } from '../../src/TextLines/parser';
import { Node, ParsingOptions } from '../../src/TextLines/parser/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
}

fixtureTest<TestCase>('parseText', 'TextLines', ['parseCommonText', 'parseBracketText'], (testCase) => {
  const options: ParsingOptions = {
    disabledMap: { bracketLink: false, hashTag: false, code: false, formula: false },
    taggedLinkRegexes: [],
    syntax: 'bracket',
  };
  const actualNodes = parseText(testCase.inputLines.join('\n'), options);
  expect(actualNodes).toMatchObject(testCase.expectedNodes);
});

fixtureTest<TestCase>('parseText', 'TextLines', ['parseCommonText', 'parseMarkdownText'], (testCase) => {
  const options: ParsingOptions = {
    disabledMap: { bracketLink: false, hashTag: false, code: false, formula: false },
    taggedLinkRegexes: [],
    syntax: 'markdown',
  };
  const actualNodes = parseText(testCase.inputLines.join('\n'), options);
  expect(actualNodes).toMatchObject(testCase.expectedNodes);
});
