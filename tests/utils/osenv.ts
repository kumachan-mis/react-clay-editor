export type OperatingSystem = 'windows' | 'macos';

export const OperatingSystemEnvironment = {
  operatingSystems: ['windows', 'macos'] as OperatingSystem[],
  userAgent: {
    windows: [
      'Mozilla/5.0',
      '(Windows NT 10.0; Win64; x64)',
      'AppleWebKit/537.36 (KHTML, like Gecko)',
      'Chrome/69.0.3497.100',
    ].join(' '),
    macos: [
      'Mozilla/5.0',
      '(Macintosh; Intel Mac OS X 10_13_6)',
      'AppleWebKit/537.36 (KHTML, like Gecko)',
      'Chrome/69.0.3497.100 Safari/537.36',
    ].join(' '),
  } as { [os in OperatingSystem]: string },
};
