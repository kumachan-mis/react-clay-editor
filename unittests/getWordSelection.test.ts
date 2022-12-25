import { getWordSelection } from 'src/components/molecules/selection/Selection/utils';

import { TestCase, testCases } from './getWordSelection.testcase';

import { expect, describe, test } from '@jest/globals';

describe('function getWordSelection', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = getWordSelection(testCase.text, testCase.cursorCoordinate);
    expect(actual).toEqual(testCase.expected);
  });
});
