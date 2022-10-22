import { moveCursor } from '../src/Cursor/utils';

import { TestCase, testCases } from './moveCursor.testcase';

describe('function moveCursor', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = moveCursor(testCase.text, testCase.cursorCoordinate, testCase.amount);
    expect(actual).toEqual(testCase.expected);
  });
});
