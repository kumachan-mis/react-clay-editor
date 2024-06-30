import katex from 'katex';
import React from 'react';

export type KaTeXProps = {
  readonly displayMode?: boolean;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

const KaTeXComponent: React.FC<KaTeXProps> = ({ displayMode, children, ...rest }) => {
  const innerHtml = React.useMemo(() => {
    try {
      return katex.renderToString(children as string, { displayMode, throwOnError: false });
    } catch (error: unknown) {
      return error instanceof katex.ParseError ? error.message : '';
    }
  }, [children, displayMode]);
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: innerHtml }} {...rest} />;
};

export const KaTeX = React.memo(KaTeXComponent);
