import * as React from 'react';
import { ParseError, renderToString } from 'katex';

import { Props } from './types';

export const KaTeX: React.FC<Props & React.ComponentProps<'span'>> = ({ options, children, ...props }) => {
  const formula = (children ?? '') as string;
  const innerHtml = React.useMemo(() => {
    try {
      return renderToString(formula, options);
    } catch (error: unknown) {
      return error instanceof ParseError ? error.message : '';
    }
  }, [formula, options]);
  return <span {...props} dangerouslySetInnerHTML={{ __html: innerHtml }} />;
};
