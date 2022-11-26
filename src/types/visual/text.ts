export type TextVisual = {
  lineProps?: (lineIndex: number) => React.PropsWithoutRef<React.ComponentProps<'div'>>;
};
