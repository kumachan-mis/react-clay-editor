import { TextLinesConstants } from '../../src/TextLines/constants';
import { parseText } from '../../src/TextLines/parser';
import { Node } from '../../src/TextLines/parser/types';
import { runFixtureTests, BaseTestCase } from '../fixture';

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

describe('function parseText in TextLines (bracket syntax)', () => {
  const testfn = createTest('bracket');
  for (const fixtureName of ['parseCommonText', 'parseBracketText']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, testfn);
  }
});

describe('function parseText in TextLines (markdown syntax)', () => {
  const testfn = createTest('markdown');
  for (const fixtureName of ['parseCommonText', 'parseMarkdownText']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, testfn);
  }
});

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
