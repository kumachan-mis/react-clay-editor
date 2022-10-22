import React from 'react';

import { mergeClassNames } from '../../common/utils';

import { ComponentConstants } from './constants';
import {
  HeaderProps,
  LineGroupProps,
  LineGroupIndentProps,
  LineGroupContentProps,
  LineProps,
  LineIndentProps,
  LineContentProps,
  CharGroupProps,
  CharProps,
  ItemBulletProps,
  ItemBulletContentProps,
  EmbededLinkProps,
} from './types';

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({ size = 'largest', children }) => {
  const constants = ComponentConstants.header;
  return (
    <div className={constants.className(size)} data-selectid={constants.selectId}>
      {children}
    </div>
  );
};
export const LineGroup: React.FC<LineGroupProps> = ({
  firstLineIndex,
  lastLineIndex,
  children,
  className,
  ...rest
}) => {
  const constants = ComponentConstants.lineGroup;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      {...rest}
      data-selectid={constants.selectId(firstLineIndex, lastLineIndex)}
    >
      {children}
    </div>
  );
};

export const LineGroupIndent: React.FC<LineGroupIndentProps> = ({
  indentDepth,
  children,
  className,
  style,
  ...rest
}) => {
  const constants = ComponentConstants.lineGroup.indent;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {[...Array(indentDepth).keys()].map((charIndex) => (
        <span key={charIndex} className={ComponentConstants.lineGroup.pad.className}>
          {' '}
        </span>
      ))}
      {children}
    </span>
  );
};

export const LineGroupContent: React.FC<LineGroupContentProps> = ({
  indentDepth,
  children,
  className,
  style,
  ...rest
}) => {
  const constants = ComponentConstants.lineGroup.content;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {children}
    </span>
  );
};

export const Line: React.FC<LineProps> = ({ lineIndex, children, className, ...rest }) => {
  const constants = ComponentConstants.line;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      {...rest}
      data-selectid={constants.selectId(lineIndex)}
    >
      {children}
    </div>
  );
};

export const LineIndent: React.FC<LineIndentProps> = ({ lineIndex, indentDepth, className, style, ...rest }) => {
  const constants = ComponentConstants.line.indent;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {[...Array(indentDepth).keys()].map((charIndex) => (
        <Char
          key={charIndex}
          charIndex={charIndex}
          lineIndex={lineIndex}
          className={ComponentConstants.line.indentPad.className}
        >
          {' '}
        </Char>
      ))}
    </span>
  );
};

export const LineContent: React.FC<LineContentProps> = ({
  lineIndex,
  lineLength,
  indentDepth = 0,
  itemized = false,
  children,
  className,
  style,
  ...rest
}) => {
  const constants = ComponentConstants.line.content;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      style={{ ...constants.style(indentDepth + (itemized ? 1 : 0)), ...style }}
      {...rest}
    >
      {children}
      <Char lineIndex={lineIndex} charIndex={lineLength}>
        {' '}
      </Char>
    </span>
  );
};

export const CharGroup: React.FC<CharGroupProps> = ({
  lineIndex,
  firstCharIndex,
  lastCharIndex,
  children,
  className,
  ...rest
}) => {
  const constants = ComponentConstants.charGroup;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      {...rest}
      data-selectid={constants.selectId(lineIndex, firstCharIndex, lastCharIndex)}
    >
      {children}
    </span>
  );
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, children, className, ...rest }) => {
  const constants = ComponentConstants.char;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      {...rest}
      data-selectid={constants.selectId(lineIndex, charIndex)}
    >
      {children}
    </span>
  );
};

export const ItemBullet: React.FC<ItemBulletProps> = ({ lineIndex, indentDepth }) => {
  const constants = ComponentConstants.itemization;
  return (
    <Char
      charIndex={indentDepth}
      lineIndex={lineIndex}
      className={constants.className}
      style={constants.style(indentDepth)}
    >
      <span className={constants.bullet.className} />{' '}
    </Char>
  );
};

export const ItemBulletContent: React.FC<ItemBulletContentProps> = ({ lineIndex, indentDepth, bullet, cursorOn }) => {
  return (
    <>
      {[...Array(bullet.length - 1).keys()].map((charIndex) => (
        <Char key={indentDepth + charIndex + 1} lineIndex={lineIndex} charIndex={indentDepth + charIndex + 1}>
          {cursorOn ? ' ' : ''}
        </Char>
      ))}
    </>
  );
};

export const EmbededLink: React.FC<React.PropsWithChildren<EmbededLinkProps>> = ({
  cursorOn,
  forceActive,
  children,
  anchorProps,
}) => {
  const constants = ComponentConstants.embededLink;
  const [state, setState] = React.useState({ active: false, hover: false });
  const active = (forceActive && state.hover) || state.active;
  const { className, onMouseDown, onMouseEnter, onMouseLeave, onClick, ...rest } = anchorProps(active) || {};

  const classNames = [constants.className];
  if (active) classNames.push(constants.active.className);
  if (className) classNames.push(className);

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
    <a
      className={mergeClassNames(...classNames)}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleOnClick}
      data-selectid={constants.selectId}
      data-active={active}
      {...rest}
    >
      {children}
    </a>
  );
};
