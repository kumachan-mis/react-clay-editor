export function getTagName(tag: string): string {
  return tag.substring(0, tag.length - 2);
}

export function getHashTagName(hashTag: string): string {
  return hashTag.substring(1);
}
