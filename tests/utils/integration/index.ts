import { resolve } from 'path';
import { readFileSync } from 'fs';

import { TestFixtures, BaseTestCase } from './types';

export function integrationtest<TestCase extends BaseTestCase = BaseTestCase>(
  targetType: string,
  componentName: string,
  targetName: string,
  test: (testCase: TestCase) => void
): void {
  type Fixtures = TestFixtures<TestCase>;

  describe(`Integration test of ${targetType} in ${componentName}: ${targetName}`, () => {
    const fixturesDirPath = resolve(__dirname, '..', '..', '..', 'test-fixtures');
    const fixturesFilePath = resolve(fixturesDirPath, componentName, `${targetName}.json`);
    const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as Fixtures;

    fixtures.testCases.forEach((testCase) => {
      it(testCase.testName, () => test(testCase));
    });

    // end of integration test
  });
}
