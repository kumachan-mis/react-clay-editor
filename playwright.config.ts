import { devices, PlaywrightTestConfig } from '@playwright/test';

const userAgents = {
  'Windows Chrome': [
    'Mozilla/5.0',
    '(Windows NT 10.0; Win64; x64)',
    'AppleWebKit/537.36',
    '(KHTML, like Gecko)',
    'Chrome/107.0.5304.18',
    'Safari/537.36',
  ].join(' '),
  'MacOS Chrome': [
    'Mozilla/5.0',
    '(Macintosh; Intel Mac OS X 10_15_7)',
    'AppleWebKit/537.36',
    '(KHTML, like Gecko)',
    'Chrome/107.0.5304.18',
    'Safari/537.36',
  ].join(' '),
} as const;

const baseURLs = {
  bracket: 'http://localhost:8082/bracket/',
  markdown: 'http://localhost:8082/markdown/',
} as const;

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  projects: [
    {
      name: 'windows-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['Windows Chrome'],
        baseURL: baseURLs['bracket'],
      },
      testMatch: /.*(common|windows|bracket)\.test\.ts/,
    },
    {
      name: 'windows-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['Windows Chrome'],
        baseURL: baseURLs['markdown'],
      },
      testMatch: /.*(common|windows|markdown)\.test\.ts/,
    },
    {
      name: 'macos-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['MacOS Chrome'],
        baseURL: baseURLs['markdown'],
      },
      testMatch: /.*(common|macos|markdown)\.test\.ts/,
    },
    {
      name: 'macos-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['MacOS Chrome'],
        baseURL: baseURLs['bracket'],
      },
      testMatch: /.*(common|macos|bracket)\.test\.ts/,
    },
  ],
  webServer: {
    command: 'cross-env ENVIRONMENT=test webpack serve',
    port: 8082,
  },
};

export default config;
