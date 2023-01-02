import { FONT_SIZES, LINE_HEIGHTS } from 'src/common/constants';

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
  width: 500px;
  height: 300px;
  box-sizing: border-box;
  border: solid 1px rgba(0, 0, 0, 0.4);
  padding: 4px;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: ${FONT_SIZES.normal};
  line-height: ${LINE_HEIGHTS.normal};

  & .katex-display {
    display: inline-block;
    margin: 0;
    text-align: inherit;
  }
`;

export const Root = React.forwardRef(ForwardRefRoot);
