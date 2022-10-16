export interface BaseTestCase {
  name: string;
}

export interface TestFixture<TestCase extends BaseTestCase, Common> {
  testCases: TestCase[];
  common: Common;
}

export function runFixtureTests<TestCase extends BaseTestCase, Common = {}>(
  fixtures: TestFixture<TestCase, Common>,
  runTest: (testCase: TestCase, common: Common) => void
): void {
  fixtures.testCases.forEach((testCase) => test(testCase.name, () => runTest(testCase, fixtures.common)));
}
