import { runFixtureTests, BaseTestCase } from '../fixture';

import { parseText } from '../../src/TextLines/parser';
import { Node } from '../../src/TextLines/parser/types';
import { TextLinesConstants } from '../../src/TextLines/constants';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedNodes: Node[];
}

interface Common {
  disabledMap?: {
    bracketLink?: boolean;
    hashTag?: boolean;
    code?: boolean;
    formula?: boolean;
  };
  taggedLinks?: {
    tagName: string;
    linkNamePattern?: string;
  }[];
}

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    const disabledMap = {
      bracketLink: false,
      hashTag: false,
      code: false,
      formula: false,
      ...common?.disabledMap,
    };
    const taggedLinkRegexes = (common?.taggedLinks || []).map((link) =>
      link.linkNamePattern
        ? TextLinesConstants.regexes.common.taggedLink(link.tagName, new RegExp(link.linkNamePattern))
        : TextLinesConstants.regexes.common.taggedLink(link.tagName)
    );
    const actualNodes = parseText(testCase.inputLines.join('\n'), { syntax, disabledMap, taggedLinkRegexes });
    expect(actualNodes).toMatchObject(testCase.expectedNodes);
  };
}

const bracketTest = createTest('bracket');
describe('function parseText in TextLines (bracket syntax)', () => {
  for (const fixtureName of ['parseCommonText', 'parseBracketText']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, bracketTest);
  }
});

const markdownTest = createTest('markdown');
describe('function parseText in TextLines (markdown syntax)', () => {
  for (const fixtureName of ['parseCommonText', 'parseMarkdownText']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, markdownTest);
  }
});
