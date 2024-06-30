export type DecorationConfig = {
  size: 'normal' | 'larger' | 'largest';
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export function decorationConfigEquals(a: DecorationConfig, b: DecorationConfig): boolean {
  return a.size === b.size && a.bold === b.bold && a.italic === b.italic && a.underline === b.underline;
}
