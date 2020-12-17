import { unittest } from '../utils/unit';
import { BaseTestCaseGroup, BaseTestCase } from '../utils/unit/types';

import { getDecorationStyle } from '../../src/TextLines/utils';
import { TextDecoration, DecorationStyle } from '../../src/TextLines/types';

interface TestCaseGroup extends BaseTestCaseGroup<TestCase> {
  groupName: string;
  setting: TextDecoration;
  testCases: TestCase[];
}

interface TestCase extends BaseTestCase {
  testName: string;
  inputDecorationMeta: string;
  expectedDecorationStyle: DecorationStyle;
}

unittest<TestCase, TestCaseGroup>(
  'function',
  'TextLines',
  'getDecorationStyle',
  (group, testCase) => {
    const actualDecorationStyle = getDecorationStyle(
      `[${testCase.inputDecorationMeta} `,
      ']',
      group.setting
    );
    expect(actualDecorationStyle).toEqual(testCase.expectedDecorationStyle);
  }
);
