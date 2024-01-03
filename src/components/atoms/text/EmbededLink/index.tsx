import styled from '@emotion/styled';
import React from 'react';

export type EmbededLinkProps = React.PropsWithChildren<{
  readonly editMode: boolean;
  readonly forceClickable: boolean;
  readonly anchorProps: (clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>> | undefined;
}>;

export const EmbededLink: React.FC<EmbededLinkProps> = ({
  editMode,
  forceClickable,
  children,
  anchorProps,
  ...rest
}) => {
  const [state, setState] = React.useState({ clickable: false, hover: false });
  const clickable = (forceClickable && state.hover) || state.clickable;
  const { onMouseDown, onMouseEnter, onMouseLeave, onClick, ...anchorPropsRest } = anchorProps?.(clickable) ?? {};

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
      data-clickable={clickable}
      onClick={handleOnClick}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      {...anchorPropsRest}
      {...rest}
    >
      {children}
    </StyledEmbededLink>
  );
};

const StyledEmbededLink = styled.a(
  (props) => `
  text-decoration-line: none;
  color: ${props.theme.link.color};
  cursor: text;
  &[data-clickable='true'] {
    color: ${props.theme.link.clickableColor};
    cursor: pointer;
  }
`
);
