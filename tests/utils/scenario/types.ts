export interface TestFixtures<TestScenario extends BaseTestScenario = BaseTestScenario> {
  testScenarios: TestScenario[];
}

export interface BaseTestScenario {
  scenarioName: string;
}
