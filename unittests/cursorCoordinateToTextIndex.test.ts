import { cursorCoordinateToTextIndex } from '../src/Cursor/utils';

import { TestCase, testCases } from './cursorCoordinateToTextIndex.testcase';

describe('function cursorCoordinateToTextIndex', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = cursorCoordinateToTextIndex(testCase.text, testCase.cursorCoordinate);
    expect(actual).toEqual(testCase.expected);
  });
});
