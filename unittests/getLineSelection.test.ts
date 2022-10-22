import { getLineSelection } from '../src/Selection/utils';

import { TestCase, testCases } from './getLineSelection.testcase';

describe('function getLineSelection', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = getLineSelection(testCase.text, testCase.cursorCoordinate);
    expect(actual).toEqual(testCase.expected);
  });
});
