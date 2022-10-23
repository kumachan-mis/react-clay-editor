import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:8082',
  },
  webServer: {
    command: 'cross-env ENVIRONMENT=test webpack serve',
    port: 8082,
  },
};
export default config;
