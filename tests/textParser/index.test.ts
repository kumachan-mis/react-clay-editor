import { resolve } from 'path';
import { readFileSync } from 'fs';

import { isEqualNodesWithoutRange } from './utils';
import { TestFixtures } from './types';

import { parseText } from '../../src/TextLines/utils';
import { ParsingOptions } from '../../src/TextLines/types';

describe('text parser test', () => {
  const fixturesFilePath = resolve(__dirname, '..', '..', 'test-fixtures', 'textParser.json');
  const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixtures;

  fixtures.testCaseGroups.forEach((group) => {
    describe(group.groupName, () => {
      const options: ParsingOptions = {
        disabledMap: group.options.disabledMap,
        taggedLinkRegexes: group.options.taggedLinkPatterns.map((pattern) => RegExp(pattern)),
      };

      group.testCases.forEach((testCase) => {
        it(testCase.testName, () => {
          const actualNodes = parseText(testCase.inputLines.join('\n'), options);
          expect(isEqualNodesWithoutRange(testCase.expectedNodes, actualNodes)).toBe(true);
        });
      });
    });
  });
});
