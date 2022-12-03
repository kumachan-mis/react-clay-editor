export type BracketLinkVisual = {
  anchorProps?: (linkName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
};
