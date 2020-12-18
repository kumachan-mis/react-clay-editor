import { unittest } from '../utils/unit';
import { BaseTestCaseGroup, BaseTestCase } from '../utils/unit/types';

import { getDecorationStyle } from '../../src/TextLines/parser';
import { TextDecoration } from '../../src/TextLines/types';
import { DecorationStyle } from '../../src/TextLines/parser/types';

interface TestCaseGroup extends BaseTestCaseGroup<TestCase> {
  groupName: string;
  setting: TextDecoration;
  testCases: TestCase[];
}

interface TestCase extends BaseTestCase {
  testName: string;
  inputDecoration: string;
  expectedDecorationStyle: DecorationStyle;
}

unittest<TestCase, TestCaseGroup>(
  'function',
  'TextLines',
  'getDecorationStyle',
  (group, testCase) => {
    const actualDecorationStyle = getDecorationStyle(`${testCase.inputDecoration} `, group.setting);
    expect(actualDecorationStyle).toEqual(testCase.expectedDecorationStyle);
  }
);
