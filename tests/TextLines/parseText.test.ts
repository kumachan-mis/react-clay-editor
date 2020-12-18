import { unittest } from '../utils/unit';
import { BaseTestCaseGroup, BaseTestCase } from '../utils/unit/types';

import { parseText } from '../../src/TextLines/parser';
import { Node, ParsingOptions } from '../../src/TextLines/parser/types';

interface TestCaseGroup extends BaseTestCaseGroup<TestCase> {
  groupName: string;
  options: {
    taggedLinkPatterns: string[];
    disabledMap: { [key in 'bracketLink' | 'hashTag' | 'code' | 'formula']: boolean };
  };
  testCases: TestCase[];
}

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  expectedNodes: Node[];
}

unittest<TestCase, TestCaseGroup>('function', 'TextLines', 'parseText', (group, testCase) => {
  const options: ParsingOptions = {
    disabledMap: group.options.disabledMap,
    taggedLinkRegexes: group.options.taggedLinkPatterns.map((pattern) => RegExp(pattern)),
  };
  const actualNodes = parseText(testCase.inputLines.join('\n'), options);
  expect(actualNodes).toEqual(testCase.expectedNodes);
});
