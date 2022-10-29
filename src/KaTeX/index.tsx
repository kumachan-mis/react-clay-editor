import katex, { ParseError } from 'katex';
import React from 'react';

import { KaTeXConstants } from './constants';
import { Props } from './types';

export const KaTeX: React.FC<Props & React.ComponentProps<'span'>> = ({ options, children, ...props }) => {
  const innerHtml = React.useMemo(() => {
    try {
      return katex.renderToString(children as string, options);
    } catch (error: unknown) {
      return error instanceof ParseError ? error.message : '';
    }
  }, [children, options]);
  return <span {...props} dangerouslySetInnerHTML={{ __html: innerHtml }} data-selectid={KaTeXConstants.selectId} />;
};
