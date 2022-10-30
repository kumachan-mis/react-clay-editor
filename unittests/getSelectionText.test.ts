import { getSelectionText } from '../src/components/molecules/Selection/utils';

import { TestCase, testCases } from './getSelectionText.testcase';

describe('function getSelectionText', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = getSelectionText(testCase.text, testCase.textSelection);
    expect(actual).toEqual(testCase.expected);
  });
});
