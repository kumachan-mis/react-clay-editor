export type NormalNode = {
  type: 'normal';
  lineIndex: number;
  range: [number, number];
  text: string;
};
