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

const StyledForwardRefRoot = styled.div(
  (props) => `
  width: 500px;
  height: 300px;
  box-sizing: border-box;
  border: solid 1px ${props.theme.base.borderColor};
  padding: 4px;
  font-family: ${props.theme.base.fontFamily};
  font-size:  ${props.theme.normal.fontSize};
  line-height: ${props.theme.normal.lineHeight};
  color: ${props.theme.base.color};
  background-color: ${props.theme.base.backgroundColor};

  & .katex-display {
    display: inline-block;
    margin: 0;
    text-align: inherit;
  }
`
);

export const Root = React.forwardRef(ForwardRefRoot);
