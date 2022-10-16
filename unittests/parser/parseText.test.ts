import { parseText } from '../../src/parser';
import { parserConstants } from '../../src/parser/constants';
import { Node } from '../../src/parser/types';
import { runFixtureTests, BaseTestCase } from '../fixture';
import commonFixtutres from '../../unittest-fixtures/parser/parseCommonText.json';
import bracketFixtutres from '../../unittest-fixtures/parser/parseBracketText.json';
import markdownFixtutres from '../../unittest-fixtures/parser/parseMarkdownText.json';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
}

interface Common {
  bracketLinkDisabled?: boolean;
  hashtagDisabled?: boolean;
  codeDisabled?: boolean;
  formulaDisabled?: boolean;
  taggedLinks?: {
    tagName: string;
    linkNamePattern?: string;
  }[];
}

describe('function parseText (bracket syntax)', () => {
  for (const fixtures of [commonFixtutres, bracketFixtutres]) {
    // @ts-ignore hard to define appropriate type since Node has recursive data structure
    runFixtureTests<TestCase, Common>(fixtures, (testCase, common) => runTest('bracket', testCase, common));
  }
});

describe('function parseText (markdown syntax)', () => {
  for (const fixtures of [commonFixtutres, markdownFixtutres]) {
    // @ts-ignore hard to define appropriate type since Node has recursive data structure
    runFixtureTests<TestCase, Common>(fixtures, (testCase, common) => runTest('markdown', testCase, common));
  }
});

function runTest(syntax: 'bracket' | 'markdown', testCase: TestCase, common: Common): void {
  const { taggedLinks, ...disables } = common;
  const taggedLinkRegexes = (taggedLinks || []).map((link) =>
    link.linkNamePattern
      ? parserConstants.common.taggedLink(link.tagName, new RegExp(link.linkNamePattern))
      : parserConstants.common.taggedLink(link.tagName)
  );
  const actualNodes = parseText(testCase.inputLines.join('\n'), { syntax, ...disables, taggedLinkRegexes });
  expect(actualNodes).toMatchObject(testCase.expectedNodes);
}
