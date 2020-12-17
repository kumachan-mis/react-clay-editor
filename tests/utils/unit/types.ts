export interface TestFixtures<
  TestCase extends BaseTestCase = BaseTestCase,
  TestCaseGroup extends BaseTestCaseGroup<TestCase> = BaseTestCaseGroup<TestCase>
> {
  testCaseGroups: TestCaseGroup[];
}

export interface BaseTestCaseGroup<TestCase extends BaseTestCase> {
  groupName: string;
  testCases: TestCase[];
}

export interface BaseTestCase {
  testName: string;
}
