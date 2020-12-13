import { resolve } from 'path';
import { readFileSync } from 'fs';

import { TestFixtures, BaseTestCaseGroup, BaseTestCase } from './types';

export function unittest<
  TestCase extends BaseTestCase = BaseTestCase,
  TestCaseGroup extends BaseTestCaseGroup<TestCase> = BaseTestCaseGroup<TestCase>
>(
  targetType: string,
  componentName: string,
  targetName: string,
  test: (group: TestCaseGroup, testCase: TestCase) => void
): void {
  type Fixtures = TestFixtures<TestCase, TestCaseGroup>;

  describe(`Unit test of ${targetType} in ${componentName}: ${targetName}`, () => {
    const fixturesDirPath = resolve(__dirname, '..', '..', 'test-fixtures');
    const fixturesFilePath = resolve(fixturesDirPath, componentName, `${targetName}.json`);
    const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as Fixtures;

    fixtures.testCaseGroups.forEach((group) => {
      describe(group.groupName, () => {
        group.testCases.forEach((testCase) => {
          it(testCase.testName, () => test(group, testCase));
        });
      });
    });

    // End of Unit test
  });
}
