import * as React from "react";
import { renderToString } from "katex";
import "katex/dist/katex.min.css";

import { Props } from "./types";

export const KaTeX: React.FC<Props & React.ComponentProps<"span">> = ({
  options,
  children,
  ...props
}) => {
  const innerHtml = (() => {
    try {
      const formula = (children ?? "") as string;
      return React.useMemo(() => renderToString(formula, options), [options, children]);
    } catch (error) {
      return error.message;
    }
  })();
  return <span {...props} dangerouslySetInnerHTML={{ __html: innerHtml }} />;
};
