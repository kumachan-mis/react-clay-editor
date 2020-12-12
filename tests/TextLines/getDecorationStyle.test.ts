import { unittest } from '../unittest';
import { BaseTestCaseGroup, BaseTestCase } from '../unittest/types';

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

unittest<TestCase, TestCaseGroup>('TextLines', 'getDecorationStyle', (group, testCase) => {
  const actualDecorationStyle = getDecorationStyle(
    `[${testCase.inputDecorationMeta}`,
    ']',
    group.setting
  );
  expect(actualDecorationStyle).toEqual(testCase.expectedDecorationStyle);
});
