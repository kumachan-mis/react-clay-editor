import { ViewerRoot, ViewerRootProps, ViewerTextFieldBody, ViewerTextFieldRoot } from '../../src';

import { css } from '@emotion/css';
import React from 'react';

const SyntaxViewer: React.FC<ViewerRootProps> = (props) => (
  <ViewerRoot
    className={css`
      && {
        border: none;
        height: auto;
      }
    `}
    {...props}
  >
    <ViewerTextFieldRoot>
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

export default SyntaxViewer;
