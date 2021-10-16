import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { parseText } from '../../src/TextLines/parser';
import { Node, ParsingOptions } from '../../src/TextLines/parser/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
}

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase) => void {
  return (testCase) => {
    const options: ParsingOptions = {
      disabledMap: { bracketLink: false, hashTag: false, code: false, formula: false },
      taggedLinkRegexes: [],
      syntax,
    };
    const actualNodes = parseText(testCase.inputLines.join('\n'), options);
    expect(actualNodes).toMatchObject(testCase.expectedNodes);
  };
}

fixtureTest<TestCase>('parseText', 'TextLines', ['parseCommonText', 'parseBracketText'], createTest('bracket'));
fixtureTest<TestCase>('parseText', 'TextLines', ['parseCommonText', 'parseMarkdownText'], createTest('markdown'));
