import styled from '@emotion/styled';
import React from 'react';

export type RootProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const RootConstants = {
  selectId: 'root',
  selectIdRegex: /root/,
};

const ForwardRefRoot: React.ForwardRefRenderFunction<HTMLDivElement, RootProps> = ({ children, ...rest }, ref) => (
  <StyledForwardRefRoot {...rest} ref={ref} data-selectid={RootConstants.selectId}>
    <StyledFlexRoot>{children}</StyledFlexRoot>
  </StyledForwardRefRoot>
);

const StyledFlexRoot = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

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
