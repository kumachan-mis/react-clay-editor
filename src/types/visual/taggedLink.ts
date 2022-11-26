export type TaggedLinkVisual = {
  anchorProps?: (linkName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
  tagHidden?: boolean;
};
