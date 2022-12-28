import { parseText } from '../src/parser';

import { branketTestCases, commonTestCases, markdownTestCases, TestCase } from './parseText.testcase';

import { expect, describe, test } from '@jest/globals';

describe('function parseText (bracket syntax)', () => {
  test.each<[string, TestCase]>(commonTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = parseText(testCase.text, { syntax: 'bracket', ...testCase.parsingOptions });
    expect(actual).toMatchObject(testCase.expected);
  });
  test.each<[string, TestCase]>(branketTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = parseText(testCase.text, { syntax: 'bracket', ...testCase.parsingOptions });
    expect(actual).toMatchObject(testCase.expected);
  });
});

describe('function parseText (markdown syntax)', () => {
  test.each<[string, TestCase]>(commonTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = parseText(testCase.text, { syntax: 'markdown', ...testCase.parsingOptions });
    expect(actual).toMatchObject(testCase.expected);
  });
  test.each<[string, TestCase]>(markdownTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actual = parseText(testCase.text, { syntax: 'markdown', ...testCase.parsingOptions });
    expect(actual).toMatchObject(testCase.expected);
  });
});
