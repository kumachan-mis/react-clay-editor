import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  projects: [
    {
      name: 'windows-chrome-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: [
          // windows-chrome
          'Mozilla/5.0',
          '(Windows NT 10.0; Win64; x64)',
          'AppleWebKit/537.36',
          '(KHTML, like Gecko)',
          'Chrome/107.0.5304.18',
          'Safari/537.36',
        ].join(' '),
        baseURL: 'http://localhost:8082/bracket/',
      },
    },
    {
      name: 'windows-chrome-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: [
          // windows-chrome
          'Mozilla/5.0',
          '(Windows NT 10.0; Win64; x64)',
          'AppleWebKit/537.36',
          '(KHTML, like Gecko)',
          'Chrome/107.0.5304.18',
          'Safari/537.36',
        ].join(' '),
        baseURL: 'http://localhost:8082/markdown/',
      },
    },
    {
      name: 'windows-firefox-bracket',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: [
          // windows-firefox
          'Mozilla/5.0',
          '(Windows NT 10.0; Win64; x64; rv:105.0.1)',
          'Gecko/20100101',
          'Firefox/105.0.1',
        ].join(' '),
        baseURL: 'http://localhost:8082/bracket/',
      },
    },
    {
      name: 'windows-firefox-markdown',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: [
          // windows-firefox
          'Mozilla/5.0',
          '(Windows NT 10.0; Win64; x64; rv:105.0.1)',
          'Gecko/20100101',
          'Firefox/105.0.1',
        ].join(' '),
        baseURL: 'http://localhost:8082/markdown/',
      },
    },
    {
      name: 'macos-chrome-bracket',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: [
          // macos-chrome
          'Mozilla/5.0',
          '(Macintosh; Intel Mac OS X 10_15_7)',
          'AppleWebKit/537.36',
          '(KHTML, like Gecko)',
          'Chrome/107.0.5304.18',
          'Safari/537.36',
        ].join(' '),
        baseURL: 'http://localhost:8082/bracket/',
      },
    },
    {
      name: 'macos-chrome-markdown',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: [
          // macos-chrome
          'Mozilla/5.0',
          '(Macintosh; Intel Mac OS X 10_15_7)',
          'AppleWebKit/537.36',
          '(KHTML, like Gecko)',
          'Chrome/107.0.5304.18',
          'Safari/537.36',
        ].join(' '),
        baseURL: 'http://localhost:8082/markdown/',
      },
    },
    {
      name: 'macos-firefox-bracket',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: [
          // macos-firefox
          'Mozilla/5.0',
          '(Macintosh; Intel Mac OS X 10_15_7)',
          'Gecko/20100101',
          'Firefox/105.0.1',
        ].join(' '),
        baseURL: 'http://localhost:8082/bracket/',
      },
    },
    {
      name: 'macos-firefox-markdown',
      use: {
        ...devices['Desktop Firefox'],
        userAgent: [
          // macos-firefox
          'Mozilla/5.0',
          '(Macintosh; Intel Mac OS X 10_15_7)',
          'Gecko/20100101',
          'Firefox/105.0.1',
        ].join(' '),
        baseURL: 'http://localhost:8082/markdown/',
      },
    },
  ],
  webServer: {
    command: 'cross-env ENVIRONMENT=test webpack serve',
    port: 8082,
  },
};
export default config;
