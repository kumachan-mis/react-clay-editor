import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type EditorRootProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const EditorRootConstants = {
  selectId: 'editor-root',
  selectIdRegex: /editor-root/,
  testId: 'editor-root',
};

const ForwardRefEditorRoot: React.ForwardRefRenderFunction<HTMLDivElement, EditorRootProps> = ({ ...rest }, ref) => (
  <StyledForwardRefEditorRoot
    {...rest}
    ref={ref}
    data-selectid={EditorRootConstants.selectId}
    data-testid={createTestId(EditorRootConstants.testId)}
  />
);

const StyledForwardRefEditorRoot = styled.div`
  width: 400px;
  height: 400px;
  font-family: sans-serif;

  & .katex-display {
    display: inline-block;
    margin: 0;
    text-align: inherit;
  }
`;

export const EditorRoot = React.forwardRef(ForwardRefEditorRoot);
