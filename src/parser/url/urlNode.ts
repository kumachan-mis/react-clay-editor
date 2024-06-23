export type UrlNode = {
  type: 'url';
  range: [number, number];
  url: string;
};

export function urlNodeEquals(a: UrlNode, b: UrlNode): boolean {
  return a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.url === b.url;
}
