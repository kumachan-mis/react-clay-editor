export function getTagName(tag: string): string {
  return tag.substring(0, tag.length - 2);
}

export function getHashtagName(hashtag: string): string {
  return hashtag.substring(1).replaceAll('_', ' ');
}
