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
} from './types';
import { TextLinesConstants } from '../constants';
import { mergeClassNames } from '../../common/utils';

export const LineGroup: React.FC<LineGroupProps> = ({ fromLineIndex, toLineIndex, divProps = {}, children }) => {
  const constants = TextLinesConstants.lineGroup;
  const { className, ...rest } = divProps;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      data-selectid={constants.selectId(fromLineIndex, toLineIndex)}
      data-testid={constants.selectId(fromLineIndex, toLineIndex)}
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
      className={mergeClassNames(constants.className, className)}
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
      className={mergeClassNames(constants.className, className)}
      style={{ ...constants.style(indentDepth), ...style }}
      {...rest}
    >
      {children}
    </span>
  );
};

export const Line: React.FC<LineProps> = ({ lineIndex, divProps = {}, children }) => {
  const constants = TextLinesConstants.line;
  const { className, ...rest } = divProps;
  return (
    <div
      className={mergeClassNames(constants.className, className)}
      data-selectid={constants.selectId(lineIndex)}
      data-testid={constants.selectId(lineIndex)}
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
      className={mergeClassNames(constants.className, className)}
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
      className={mergeClassNames(constants.className, className)}
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
      className={mergeClassNames(constants.className, className)}
      data-selectid={constants.selectId(lineIndex, fromCharIndex, toCharIndex)}
      data-testid={constants.selectId(lineIndex, fromCharIndex, toCharIndex)}
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
      className={mergeClassNames(constants.className, className)}
      data-selectid={constants.selectId(lineIndex, charIndex)}
      data-testid={constants.selectId(lineIndex, charIndex)}
      {...rest}
    >
      <span>{children}</span>
    </span>
  );
};
