import { devices, PlaywrightTestConfig } from '@playwright/test';

const TARGET_PORT = 5173;

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
  bracket: `http://localhost:${TARGET_PORT}/bracket/`,
  markdown: `http://localhost:${TARGET_PORT}/markdown/`,
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
      name: 'macos-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['MacOS Chrome'],
        baseURL: baseURLs['markdown'],
      },
      testMatch: /.*(common|macos|markdown)\.test\.ts/,
    },
  ],
  webServer: {
    command: 'yarn dev-test',
    port: TARGET_PORT,
  },
};

export default config;
