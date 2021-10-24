import * as React from 'react';
import { ParseError, renderToString } from 'katex';

import { Props } from './types';
import { KaTeXConstants } from './constants';

export const KaTeX: React.FC<Props & React.ComponentProps<'span'>> = ({ options, children, ...props }) => {
  const innerHtml = React.useMemo(() => {
    try {
      return renderToString(children as string, options);
    } catch (error: unknown) {
      return error instanceof ParseError ? error.message : '';
    }
  }, [children, options]);
  return (
    <span
      {...props}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
      data-selectid={KaTeXConstants.selectId}
      data-testid={KaTeXConstants.selectId}
    />
  );
};
