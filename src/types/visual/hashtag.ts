export type HashtagVisual = {
  anchorProps?: (hashtagName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
};
