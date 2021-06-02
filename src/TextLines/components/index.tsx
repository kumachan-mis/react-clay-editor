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

export const LineGroup: React.FC<LineGroupProps> = ({ fromLineIndex, toLineIndex, divPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.lineGroup.className(fromLineIndex, toLineIndex);
  const { className, ...rest } = divPorps;
  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName} {...rest}>
      {children}
    </div>
  );
};

export const LineGroupIndent: React.FC<LineGroupIndentProps> = ({ indentDepth, spanPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.lineGroup.indent.className;
  const baseStyle = TextLinesConstants.lineGroup.indent.style(indentDepth);
  const { className, style, ...rest } = spanPorps;
  return (
    <span
      className={className ? `${baseClassName} ${className}` : baseClassName}
      style={style ? { ...baseStyle, ...style } : baseStyle}
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

export const LineGroupContent: React.FC<LineGroupContentProps> = ({ indentDepth, spanPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.lineGroup.content.className;
  const baseStyle = TextLinesConstants.lineGroup.content.style(indentDepth);
  const { className, style, ...rest } = spanPorps;
  return (
    <span
      className={className ? `${baseClassName} ${className}` : baseClassName}
      style={style ? { ...baseStyle, ...style } : baseStyle}
      {...rest}
    >
      {children}
    </span>
  );
};

export const Line: React.FC<LineProps> = ({ lineIndex, defaultFontSize, divPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.line.className(lineIndex);
  const baseStyle = TextLinesConstants.line.style(defaultFontSize);
  const { className, style, ...rest } = divPorps;
  return (
    <div
      className={className ? `${baseClassName} ${className}` : baseClassName}
      style={style ? { ...baseStyle, ...style } : baseStyle}
      {...rest}
    >
      {children}
    </div>
  );
};

export const LineIndent: React.FC<LineIndentProps> = ({ lineIndex, indentDepth, spanPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.line.indent.className;
  const baseStyle = TextLinesConstants.line.indent.style(indentDepth);
  const { className, style, ...rest } = spanPorps;
  return (
    <span
      className={className ? `${baseClassName} ${className}` : baseClassName}
      style={style ? { ...baseStyle, ...style } : baseStyle}
      {...rest}
    >
      {[...Array(indentDepth).keys()].map((charIndex) => (
        <Char
          key={charIndex}
          charIndex={charIndex}
          lineIndex={lineIndex}
          spanPorps={{ className: TextLinesConstants.line.pad.className }}
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
  spanPorps = {},
  children,
}) => {
  const baseClassName = TextLinesConstants.line.content.className;
  const baseStyle = TextLinesConstants.line.content.style(indentDepth);
  const { className, style, ...rest } = spanPorps;
  return (
    <span
      className={className ? `${baseClassName} ${className}` : baseClassName}
      style={style ? { ...baseStyle, ...style } : baseStyle}
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
  spanPorps = {},
  children,
}) => {
  const baseClassName = TextLinesConstants.charGroup.className(lineIndex, fromCharIndex, toCharIndex);
  const { className, ...rest } = spanPorps;
  return (
    <span className={className ? `${baseClassName} ${className}` : baseClassName} {...rest}>
      {children}
    </span>
  );
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, spanPorps = {}, children }) => {
  const baseClassName = TextLinesConstants.char.className(lineIndex, charIndex);
  const { className, ...rest } = spanPorps;
  return (
    <span className={className ? `${baseClassName} ${className}` : baseClassName} {...rest}>
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

export const MarginBottom: React.FC = () => <div className={TextLinesConstants.marginBottom.className} />;
