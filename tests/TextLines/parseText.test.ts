import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { defaultDecorationSettings } from '../../src/TextLines/constants';
import { parseText } from '../../src/TextLines/parser';
import { Node, ParsingOptions } from '../../src/TextLines/parser/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
}

fixtureTest<TestCase>('parseText', 'TextLines', 'parseText', (testCase) => {
  const options: ParsingOptions = {
    decorationSettings: defaultDecorationSettings,
    disabledMap: { bracketLink: false, hashTag: false, code: false, formula: false },
    taggedLinkRegexes: [],
    syntax: 'bracket',
  };
  const actualNodes = parseText(testCase.inputLines.join('\n'), options);
  expect(actualNodes).toMatchObject(testCase.expectedNodes);
});
