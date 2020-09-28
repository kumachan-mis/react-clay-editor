import { ParseError, KatexOptions } from "katex";

export interface Props {
  renderError?: (error: ParseError | TypeError) => React.ReactElement;
  options?: Omit<KatexOptions, "throwOnError">;
}

export type State = { innerHtml: string } | { errorElement: React.ReactElement };
