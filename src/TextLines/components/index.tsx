import React from 'react';

import { mergeClassNames, selectIdProps } from '../../common/utils';

import { ComponentConstants } from './constants';
import {
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

export const LineGroup: React.FC<LineGroupProps> = ({ firstLineIndex, lastLineIndex, divProps = {}, children }) => {
  const constants = ComponentConstants.lineGroup;
  const { className, ...rest } = divProps;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      {...rest}
      {...selectIdProps(constants.selectId(firstLineIndex, lastLineIndex))}
    >
      {children}
    </div>
  );
};

export const LineGroupIndent: React.FC<LineGroupIndentProps> = ({ indentDepth, spanProps = {}, children }) => {
  const constants = ComponentConstants.lineGroup.indent;
  const { className, style, ...rest } = spanProps;
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

export const LineGroupContent: React.FC<LineGroupContentProps> = ({ indentDepth, spanProps = {}, children }) => {
  const constants = ComponentConstants.lineGroup.content;
  const { className, style, ...rest } = spanProps;
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

export const Line: React.FC<LineProps> = ({ lineIndex, divProps = {}, children }) => {
  const constants = ComponentConstants.line;
  const { className, ...rest } = divProps;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      {...rest}
      {...selectIdProps(constants.selectId(lineIndex))}
    >
      {children}
    </div>
  );
};

export const LineIndent: React.FC<LineIndentProps> = ({ lineIndex, indentDepth, spanProps = {} }) => {
  const constants = ComponentConstants.line.indent;
  const { className, style, ...rest } = spanProps;
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
          spanProps={{ className: ComponentConstants.line.indentPad.className }}
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
  spanProps = {},
  children,
}) => {
  const constants = ComponentConstants.line.content;
  const { className, style, ...rest } = spanProps;
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
  spanProps = {},
  children,
}) => {
  const constants = ComponentConstants.charGroup;
  const { className, ...rest } = spanProps;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      {...rest}
      {...selectIdProps(constants.selectId(lineIndex, firstCharIndex, lastCharIndex))}
    >
      {children}
    </span>
  );
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, spanProps = {}, children }) => {
  const constants = ComponentConstants.char;
  const { className, ...rest } = spanProps;
  return (
    <span
      className={mergeClassNames(constants.className, className)}
      {...rest}
      {...selectIdProps(constants.selectId(lineIndex, charIndex))}
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
      spanProps={{ className: constants.className, style: constants.style(indentDepth) }}
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

export const EmbededLink: React.FC<EmbededLinkProps> = ({ cursorOn, anchorProps = {}, children }) => {
  const constants = ComponentConstants.embededLink;
  const { className, onClick, onMouseEnter, onMouseLeave, ...rest } = anchorProps;
  const [active, setActive] = React.useState(false);

  const classNames = active
    ? [constants.hover.className, constants.className, className]
    : [constants.className, className];

  return (
    <a
      className={mergeClassNames(...classNames)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setActive(!cursorOn);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setActive(false);
      }}
      onClick={(event) => {
        if (active) onClick?.(event);
        else event.preventDefault();
      }}
      {...rest}
      {...selectIdProps(constants.selectId)}
      data-active={active}
    >
      {children}
    </a>
  );
};
