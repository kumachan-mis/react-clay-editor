export interface TestFixtures<TestCase extends BaseTestCase = BaseTestCase> {
  testCases: TestCase[];
}

export interface BaseTestCase {
  testName: string;
}
