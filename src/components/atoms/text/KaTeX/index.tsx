import katex, { KatexOptions, ParseError } from 'katex';
import React from 'react';

export type KaTeXProps = {
  options?: KatexOptions;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const KaTeX: React.FC<KaTeXProps> = ({ options, children, ...rest }) => {
  const innerHtml = React.useMemo(() => {
    try {
      return katex.renderToString(children as string, options);
    } catch (error: unknown) {
      return error instanceof ParseError ? error.message : '';
    }
  }, [children, options]);
  return <span dangerouslySetInnerHTML={{ __html: innerHtml }} {...rest} />;
};
