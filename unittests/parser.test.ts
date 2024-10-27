import { parseText, textNodeToString } from '../src/parser';

import { branketTestCases, commonTestCases, markdownTestCases, TestCase } from './parser.testcase';

import { expect, describe, test } from '@jest/globals';

describe('function parseText and textNodeToString (bracket syntax)', () => {
  test.each<[string, TestCase]>(commonTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actualNodes = parseText(testCase.text, { syntax: 'bracket', ...testCase.parsingOptions });
    expect(actualNodes).toMatchObject(testCase.expected);

    const actualText = actualNodes.map(textNodeToString).join('\n');
    expect(actualText).toBe(testCase.text);
  });

  test.each<[string, TestCase]>(branketTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actualNodes = parseText(testCase.text, { syntax: 'bracket', ...testCase.parsingOptions });
    expect(actualNodes).toMatchObject(testCase.expected);

    const actualText = actualNodes.map(textNodeToString).join('\n');
    expect(actualText).toBe(testCase.text);
  });
});

describe('function parseText and textNodeToString (markdown syntax)', () => {
  test.each<[string, TestCase]>(commonTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actualNodes = parseText(testCase.text, { syntax: 'markdown', ...testCase.parsingOptions });
    expect(actualNodes).toMatchObject(testCase.expected);

    const actualText = actualNodes.map(textNodeToString).join('\n');
    expect(actualText).toBe(testCase.text);
  });

  test.each<[string, TestCase]>(markdownTestCases.map((testCase) => [testCase.name, testCase]))('%s', (_, testCase) => {
    const actualNodes = parseText(testCase.text, { syntax: 'markdown', ...testCase.parsingOptions });
    expect(actualNodes).toMatchObject(testCase.expected);

    const actualText = actualNodes.map(textNodeToString).join('\n');
    expect(actualText).toBe(testCase.text);
  });
});
