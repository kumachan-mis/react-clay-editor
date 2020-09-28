import * as React from "react";
import { renderToString, ParseError } from "katex";

import { Props, State } from "./types";

const KaTeXComponent: React.FC<Props & React.ComponentProps<"span">> = ({
  children,
  renderError,
  options,
  ...props
}) => {
  const formula = (children ?? "") as string;
  const [state, setState] = React.useState<State>({ innerHtml: "" });

  React.useEffect(() => {
    try {
      const innerHtml = renderToString(formula, { throwOnError: !!renderError, ...options });
      setState({ innerHtml });
    } catch (error) {
      if (!(error instanceof ParseError) || !(error instanceof TypeError)) throw error;
      if (renderError) setState({ errorElement: renderError(error) });
      else setState({ innerHtml: error.message });
    }
  }, [renderError, options]);

  if ("errorElement" in state) return state.errorElement;
  return <span {...props} dangerouslySetInnerHTML={{ __html: state.innerHtml }} />;
};

export const KaTeX = React.memo(KaTeXComponent);
