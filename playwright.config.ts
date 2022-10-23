import { devices, PlaywrightTestConfig } from '@playwright/test';

const userAgents = {
  'Windows Chrome': [
    // Windows Chrome
    'Mozilla/5.0',
    '(Windows NT 10.0; Win64; x64)',
    'AppleWebKit/537.36',
    '(KHTML, like Gecko)',
    'Chrome/107.0.5304.18',
    'Safari/537.36',
  ].join(' '),
  'Windows Firefox': [
    // Windows Firefox
    'Mozilla/5.0',
    '(Windows NT 10.0; Win64; x64; rv:105.0.1)',
    'Gecko/20100101',
    'Firefox/105.0.1',
  ].join(' '),
  'MacOS Chrome': [
    // MacOS Chrome
    'Mozilla/5.0',
    '(Macintosh; Intel Mac OS X 10_15_7)',
    'AppleWebKit/537.36',
    '(KHTML, like Gecko)',
    'Chrome/107.0.5304.18',
    'Safari/537.36',
  ].join(' '),
  'MacOS Firefox': [
    // MacOS Firefox
    'Mozilla/5.0',
    '(Macintosh; Intel Mac OS X 10_15_7)',
    'Gecko/20100101',
    'Firefox/105.0.1',
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
      name: 'windows-chrome-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['Windows Chrome'],
        baseURL: baseURLs['bracket'],
      },
    },
    {
      name: 'windows-chrome-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['Windows Chrome'],
        baseURL: baseURLs['markdown'],
      },
    },
    {
      name: 'windows-firefox-bracket',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: userAgents['Windows Firefox'],
        baseURL: baseURLs['bracket'],
      },
    },
    {
      name: 'windows-firefox-markdown',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: userAgents['Windows Firefox'],
        baseURL: baseURLs['markdown'],
      },
    },
    {
      name: 'macos-chrome-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['MacOS Chrome'],
        baseURL: baseURLs['bracket'],
      },
    },
    {
      name: 'macos-chrome-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: userAgents['MacOS Chrome'],
        baseURL: baseURLs['markdown'],
      },
    },
    {
      name: 'macos-firefox-bracket',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: userAgents['MacOS Firefox'],
        baseURL: baseURLs['bracket'],
      },
    },
    {
      name: 'macos-firefox-markdown',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: userAgents['MacOS Firefox'],
        baseURL: baseURLs['markdown'],
      },
    },
  ],
  webServer: {
    command: 'cross-env ENVIRONMENT=test webpack serve',
    port: 8082,
  },
};

export default config;
