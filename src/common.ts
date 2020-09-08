export function isMacOS(): boolean {
  return navigator.userAgent.indexOf("Mac OS X") > -1;
}

export function classNameToSelector(className: string): string {
  return className
    .split(" ")
    .map((name) => `.${name}`)
    .join("");
}
