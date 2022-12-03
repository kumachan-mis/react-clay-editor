import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type RootProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const RootConstants = {
  selectId: 'root',
  selectIdRegex: /root/,
  testId: 'root',
};

const ForwardRefRoot: React.ForwardRefRenderFunction<HTMLDivElement, RootProps> = ({ ...rest }, ref) => (
  <StyledForwardRefRoot
    {...rest}
    ref={ref}
    data-selectid={RootConstants.selectId}
    data-testid={createTestId(RootConstants.testId)}
  />
);

const StyledForwardRefRoot = styled.div`
  width: 400px;
  height: 400px;
  font-family: sans-serif;

  & .katex-display {
    display: inline-block;
    margin: 0;
    text-align: inherit;
  }
`;

export const Root = React.forwardRef(ForwardRefRoot);
