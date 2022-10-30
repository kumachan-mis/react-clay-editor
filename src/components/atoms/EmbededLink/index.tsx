import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../common/utils';

export type EmbededLinkProps = React.PropsWithChildren<{
  cursorOn: boolean;
  forceClickable: boolean;
  anchorProps: (clickable: boolean) => React.ComponentProps<'a'> | undefined;
}>;

export const EmbededLinkConstants = {
  selectId: 'embeded-link',
  testId: 'embeded-link',
};

export const EmbededLink: React.FC<EmbededLinkProps> = ({ cursorOn, forceClickable, children, anchorProps }) => {
  const [state, setState] = React.useState({ clickable: false, hover: false });
  const clickable = (forceClickable && state.hover) || state.clickable;
  const { onMouseDown, onMouseEnter, onMouseLeave, onClick, ...rest } = anchorProps?.(clickable) || {};

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
      setState({ clickable: !cursorOn, hover: true });
    },
    [cursorOn, onMouseEnter]
  );

  const handleOnMouseLeave = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onMouseLeave?.(event);
      setState({ clickable: false, hover: false });
    },
    [onMouseLeave]
  );

  const handleOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (clickable) onClick?.(event);
      else event.preventDefault();
    },
    [clickable, onClick]
  );

  return (
    <StyledEmbededLink
      clickable={clickable}
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

const StyledEmbededLink = styled.a<{ clickable: boolean }>(
  (props) => `
  text-decoration-line: none;
  color: ${props.clickable ? '#425a9d' : '#5e8af7'};
  cursor: text;
  cursor: ${props.clickable ? 'pointer' : 'text'};
`
);
