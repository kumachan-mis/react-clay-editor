import * as React from 'react';

import {
  LineGroupProps,
  LineGroupIndentProps,
  LineGroupContentProps,
  LineProps,
  LineIndentProps,
  LineContentProps,
  CharGroupProps,
  CharProps,
  AnchorWithHoverStyleProps,
} from './types';
import { TextLinesConstants } from '../constants';

export const LineGroup: React.FC<LineGroupProps> = ({ fromLineIndex, toLineIndex, divProps = {}, children }) => {
  const constants = TextLinesConstants.lineGroup;
  const { className, ...rest } = divProps;
  return (
    <div
      className={className ? `${constants.className} ${className}` : constants.className}
      data-selectid={constants.selectId(fromLineIndex, toLineIndex)}
      {...rest}
    >
      {children}
    </div>
  );
};

export const LineGroupIndent: React.FC<LineGroupIndentProps> = ({ indentDepth, spanProps = {}, children }) => {
  const constants = TextLinesConstants.lineGroup.indent;
  const { className, style, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {[...Array(indentDepth).keys()].map((charIndex) => (
        <span key={charIndex} className={TextLinesConstants.lineGroup.pad.className}>
          <span> </span>
        </span>
      ))}
      {children}
    </span>
  );
};

export const LineGroupContent: React.FC<LineGroupContentProps> = ({ indentDepth, spanProps = {}, children }) => {
  const constants = TextLinesConstants.lineGroup.content;
  const { className, style, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {children}
    </span>
  );
};

export const Line: React.FC<LineProps> = ({ lineIndex, defaultFontSize, divProps = {}, children }) => {
  const constants = TextLinesConstants.line;
  const { className, style, ...rest } = divProps;
  return (
    <div
      className={className ? `${constants.className} ${className}` : constants.className}
      data-selectid={constants.selectId(lineIndex)}
      style={{ ...constants.style(defaultFontSize), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

export const LineIndent: React.FC<LineIndentProps> = ({ lineIndex, indentDepth, spanProps = {}, children }) => {
  const constants = TextLinesConstants.line.indent;
  const { className, style, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {[...Array(indentDepth).keys()].map((charIndex) => (
        <Char
          key={charIndex}
          charIndex={charIndex}
          lineIndex={lineIndex}
          spanProps={{ className: TextLinesConstants.line.indentPad.className }}
        >
          {' '}
        </Char>
      ))}
      {children}
    </span>
  );
};

export const LineContent: React.FC<LineContentProps> = ({
  lineIndex,
  indentDepth,
  contentLength,
  spanProps = {},
  children,
}) => {
  const constants = TextLinesConstants.line.content;
  const { className, style, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {children}
      {contentLength !== undefined && (
        <Char lineIndex={lineIndex} charIndex={indentDepth + contentLength}>
          {' '}
        </Char>
      )}
    </span>
  );
};

export const CharGroup: React.FC<CharGroupProps> = ({
  lineIndex,
  fromCharIndex,
  toCharIndex,
  spanProps = {},
  children,
}) => {
  const constants = TextLinesConstants.charGroup;
  const { className, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      data-selectid={constants.selectId(lineIndex, fromCharIndex, toCharIndex)}
      {...rest}
    >
      {children}
    </span>
  );
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, spanProps = {}, children }) => {
  const constants = TextLinesConstants.char;
  const { className, ...rest } = spanProps;
  return (
    <span
      className={className ? `${constants.className} ${className}` : constants.className}
      data-selectid={constants.selectId(lineIndex, charIndex)}
      {...rest}
    >
      <span>{children}</span>
    </span>
  );
};

export const AnchorWithHoverStyle: React.FC<AnchorWithHoverStyleProps> = ({
  onMouseEnter,
  onMouseLeave,
  onClick,
  style,
  overriddenStyleOnHover,
  cursorOn,
  children,
  ...rest
}) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setHover(!cursorOn);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setHover(false);
      }}
      onClick={(event) => {
        if (hover) onClick?.(event);
        else event.preventDefault();
      }}
      style={hover ? { ...style, ...overriddenStyleOnHover } : style}
      {...rest}
    >
      {children}
    </a>
  );
};
