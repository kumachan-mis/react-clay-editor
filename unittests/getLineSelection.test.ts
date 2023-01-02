import { getLineSelection } from '../src/components/molecules/selection/Selection/utils';

import { TestCase, testCases } from './getLineSelection.testcase';

import { expect, describe, test } from '@jest/globals';

describe('function getLineSelection', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = getLineSelection(testCase.text, testCase.cursorCoordinate);
    expect(actual).toEqual(testCase.expected);
  });
});
