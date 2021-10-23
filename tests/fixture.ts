import { resolve } from 'path';
import { readFileSync } from 'fs';

export interface BaseTestCase {
  name: string;
}

export interface TestFixture<TestCase extends BaseTestCase, Common> {
  testCases: TestCase[];
  common: Common;
}

export function runFixtureTests<TestCase extends BaseTestCase, Common = undefined>(
  component: string,
  fixtureName: string,
  testfn: (testCase: TestCase, common: Common) => void
): void {
  const fixturesDirPath = resolve(__dirname, '..', 'test-fixtures');
  const fixturesFilePath = resolve(fixturesDirPath, component, `${fixtureName}.json`);
  const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixture<TestCase, Common>;
  fixtures.testCases.forEach((testCase) => test(testCase.name, () => testfn(testCase, fixtures.common)));
}
