import { headingContent } from '../src/parser';

import { TestCase, testCases } from './headingContent.testcase';

import { describe, expect, test } from '@jest/globals';

describe('function headingContent', () => {
  test.each<[string, TestCase]>(testCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = headingContent(testCase.headingNode);
    expect(actual).toBe(testCase.expected);
  });
});
