export interface Props {
  hashTagSuggestions: string[];
  taggedLinkSuggestions: { [tag: string]: [] };
  active: boolean;
}
