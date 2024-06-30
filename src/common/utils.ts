export function isMacOS(): boolean {
  return navigator.userAgent.includes('Mac OS X');
}

export function generateRandomId(): string {
  return Date.now().toString(16) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(16);
}
