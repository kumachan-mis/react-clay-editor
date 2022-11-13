export type UrlNode = {
  type: 'url';
  lineIndex: number;
  range: [number, number];
  url: string;
};
