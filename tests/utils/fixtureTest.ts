import { resolve } from 'path';
import { readFileSync } from 'fs';

export interface BaseTestCase {
  name: string;
}

export interface TestFixture<TestCase extends BaseTestCase, Common> {
  testCases: TestCase[];
  common: Common;
}

export function fixtureTest<TestCase extends BaseTestCase, Common = undefined>(
  target: string,
  component: string,
  fixtureName: string | string[],
  testfn: (testCase: TestCase, common: Common) => void
): void {
  describe(`Unit test of ${target} in ${component}: ${fixtureName}`, () => {
    const fixturesDirPath = resolve(__dirname, '..', '..', 'test-fixtures');
    const fixtureNames = typeof fixtureName === 'string' ? [fixtureName] : fixtureName;

    for (const fixtureName of fixtureNames) {
      const fixturesFilePath = resolve(fixturesDirPath, component, `${fixtureName}.json`);
      const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixture<TestCase, Common>;
      fixtures.testCases.forEach((testCase) => test(testCase.name, () => testfn(testCase, fixtures.common)));
    }
  });
}
