import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

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
      TextLinesConstants.regexes.common.taggedLink(
        link.tagName,
        link.linkNamePattern ? new RegExp(link.linkNamePattern) : undefined
      )
    );
    const actualNodes = parseText(testCase.inputLines.join('\n'), { syntax, disabledMap, taggedLinkRegexes });
    expect(actualNodes).toMatchObject(testCase.expectedNodes);
  };
}

const bracketTest = createTest('bracket');
for (const fixtureName of ['parseCommonText', 'parseBracketText']) {
  fixtureTest<TestCase, Common | undefined>('parseText (bracket syntax)', 'TextLines', fixtureName, bracketTest);
}

const markdownTest = createTest('markdown');
for (const fixtureName of ['parseCommonText', 'parseMarkdownText']) {
  fixtureTest<TestCase, Common | undefined>('parseText (markdown syntax)', 'TextLines', fixtureName, markdownTest);
}
