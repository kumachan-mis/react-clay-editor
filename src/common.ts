export function classNameToSelector(className: string): string {
  return className
    .split(" ")
    .map((name) => `.${name}`)
    .join("");
}
