import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type EmbededLinkProps = React.PropsWithChildren<{
  cursorOn: boolean;
  forceActive: boolean;
  anchorProps: (active: boolean) => React.ComponentProps<'a'> | undefined;
}>;

export const EmbededLinkConstants = {
  selectId: 'embeded-link',
  testId: 'embeded-link',
};

export const EmbededLink: React.FC<EmbededLinkProps> = ({ cursorOn, forceActive, children, anchorProps }) => {
  const [state, setState] = React.useState({ active: false, hover: false });
  const active = (forceActive && state.hover) || state.active;
  const { onMouseDown, onMouseEnter, onMouseLeave, onClick, ...rest } = anchorProps?.(active) || {};

  const handleOnMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (cursorOn) event.preventDefault();
      onMouseDown?.(event);
    },
    [cursorOn, onMouseDown]
  );

  const handleOnMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onMouseEnter?.(event);
      setState({ active: !cursorOn, hover: true });
    },
    [cursorOn, onMouseEnter]
  );

  const handleOnMouseLeave = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onMouseLeave?.(event);
      setState({ active: false, hover: false });
    },
    [onMouseLeave]
  );

  const handleOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (active) onClick?.(event);
      else event.preventDefault();
    },
    [active, onClick]
  );

  return (
    <StyledEmbededLink
      active={active}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleOnClick}
      data-selectid={EmbededLinkConstants.selectId}
      data-testid={createTestId(EmbededLinkConstants.testId)}
      {...rest}
    >
      {children}
    </StyledEmbededLink>
  );
};

const StyledEmbededLink = styled.a<{ active: boolean }>(
  (props) => `
  text-decoration-line: none;
  color: #5e8af7;
  cursor: text;
  cursor: ${props.active ? 'pointer' : 'text'};
`
);
