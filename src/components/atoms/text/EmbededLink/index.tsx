import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type EmbededLinkProps = React.PropsWithChildren<{
  editMode: boolean;
  forceClickable: boolean;
  anchorProps: (clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>> | undefined;
}>;

export const EmbededLinkConstants = {
  selectId: 'embeded-link',
  testId: 'embeded-link',
};

export const EmbededLink: React.FC<EmbededLinkProps> = ({ editMode, forceClickable, children, anchorProps }) => {
  const [state, setState] = React.useState({ clickable: false, hover: false });
  const clickable = (forceClickable && state.hover) || state.clickable;
  const { onMouseDown, onMouseEnter, onMouseLeave, onClick, ...rest } = anchorProps?.(clickable) || {};

  const handleOnMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (editMode) event.preventDefault();
      onMouseDown?.(event);
    },
    [editMode, onMouseDown]
  );

  const handleOnMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onMouseEnter?.(event);
      setState({ clickable: !editMode, hover: true });
    },
    [editMode, onMouseEnter]
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
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleOnClick}
      data-clickable={clickable}
      data-selectid={EmbededLinkConstants.selectId}
      data-testid={createTestId(EmbededLinkConstants.testId)}
      {...rest}
    >
      {children}
    </StyledEmbededLink>
  );
};

const StyledEmbededLink = styled.a`
  text-decoration-line: none;
  color: #5e8af7;
  cursor: text;
  &[data-clickable='true'] {
    color: #425a9d;
    cursor: pointer;
  }
`;
