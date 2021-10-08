import { resolve } from 'path';
import { readFileSync } from 'fs';

export interface BaseTestCase {
  name: string;
}

export interface TestFixture<TestCase extends BaseTestCase, Common> {
  testCases: TestCase[];
  common: Common;
}

export function unittest<TestCase extends BaseTestCase, Common = undefined>(
  target: string,
  component: string,
  fixtureName: string,
  test: (testCase: TestCase, common: Common) => void
): void {
  describe(`Unit test of ${target} in ${component}: ${fixtureName}`, () => {
    const fixturesDirPath = resolve(__dirname, '..', '..', 'test-fixtures');
    const fixturesFilePath = resolve(fixturesDirPath, component, `${fixtureName}.json`);
    const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixture<TestCase, Common>;
    fixtures.testCases.forEach((testCase) => it(testCase.name, () => test(testCase, fixtures.common)));
  });
}
