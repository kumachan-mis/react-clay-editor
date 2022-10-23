import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:8082',
  },
  webServer: {
    command: 'yarn start-target',
    port: 8082,
  },
};
export default config;
