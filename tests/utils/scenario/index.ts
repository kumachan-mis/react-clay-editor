import { resolve } from 'path';
import { readFileSync } from 'fs';

import { TestFixtures, BaseTestScenario } from './types';

export function scenariotest<TestScenario extends BaseTestScenario = BaseTestScenario>(
  targetType: string,
  componentName: string,
  targetName: string,
  test: (testScenario: TestScenario) => void
): void {
  type Fixtures = TestFixtures<TestScenario>;

  describe(`Scenario test of ${targetType} in ${componentName}: ${targetName}`, () => {
    const fixturesDirPath = resolve(__dirname, '..', '..', '..', 'test-fixtures');
    const fixturesFilePath = resolve(fixturesDirPath, componentName, `${targetName}.json`);
    const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as Fixtures;

    fixtures.testScenarios.forEach((testScenario) => {
      it(testScenario.scenarioName, () => test(testScenario));
    });

    // end of scenario test
  });
}
