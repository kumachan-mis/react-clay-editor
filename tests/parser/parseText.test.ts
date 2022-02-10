import { parseText } from '../../src/parser';
import { parserConstants } from '../../src/parser/constants';
import { Node } from '../../src/parser/types';
import { runFixtureTests, BaseTestCase } from '../fixture';

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
  const testfn = createTest('bracket');
  for (const fixtureName of ['parseCommonText', 'parseBracketText']) {
    runFixtureTests<TestCase, Common | undefined>('parser', fixtureName, testfn);
  }
});

describe('function parseText (markdown syntax)', () => {
  const testfn = createTest('markdown');
  for (const fixtureName of ['parseCommonText', 'parseMarkdownText']) {
    runFixtureTests<TestCase, Common | undefined>('parser', fixtureName, testfn);
  }
});

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    const { taggedLinks, ...disables } = common || {};
    const taggedLinkRegexes = (taggedLinks || []).map((link) =>
      link.linkNamePattern
        ? parserConstants.common.taggedLink(link.tagName, new RegExp(link.linkNamePattern))
        : parserConstants.common.taggedLink(link.tagName)
    );
    const actualNodes = parseText(testCase.inputLines.join('\n'), { syntax, ...disables, taggedLinkRegexes });
    expect(actualNodes).toMatchObject(testCase.expectedNodes);
  };
}
