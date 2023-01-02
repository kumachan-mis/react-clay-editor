import { getSelectionText } from '../src/components/molecules/selection/Selection/utils';

import { TestCase, testCases } from './getSelectionText.testcase';

import { expect, describe, test } from '@jest/globals';

describe('function getSelectionText', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = getSelectionText(testCase.text, testCase.cursorSelection);
    expect(actual).toEqual(testCase.expected);
  });
});
