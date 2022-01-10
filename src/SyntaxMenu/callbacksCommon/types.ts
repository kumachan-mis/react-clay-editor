export interface ContentConfig {
  facingMeta: string;
  content: string;
  trailingMeta: string;
}

export interface ContentMetaConfig {
  facingMeta: string;
  trailingMeta: string;
  nestedSearch?: boolean;
}
