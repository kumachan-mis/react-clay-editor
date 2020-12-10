import * as React from 'react';

import { Props, NodeProps, CharProps, Node } from './types';
import {
  TextLinesConstants,
  defaultTextDecoration,
  defaultLinkStyle,
  defaultLinkOverriddenStyleOnHover,
  defaultCodeStyle,
} from './constants';
import { parseText, getDecorationStyle, getTagName, getHashTagName } from './utils';
import { KaTeX } from '../KaTeX';
import '../style.css';

export const TextLines: React.FC<Props> = ({
  text,
  textDecoration = defaultTextDecoration,
  bracketLinkProps = {
    anchorProps: () => ({
      style: defaultLinkStyle,
      overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
    }),
  },
  hashTagProps = {
    anchorProps: () => ({
      style: defaultLinkStyle,
      overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
    }),
  },
  taggedLinkPropsMap = {},
  codeProps = {
    codeProps: () => ({ style: defaultCodeStyle }),
  },
  formulaProps = {},
  cursorCoordinate,
}) => {
  const nodes = parseText(text, taggedLinkPropsMap);
  return (
    <div className={TextLinesConstants.className}>
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          textDecoration={textDecoration}
          bracketLinkProps={bracketLinkProps}
          hashTagProps={hashTagProps}
          taggedLinkPropsMap={taggedLinkPropsMap}
          codeProps={codeProps}
          formulaProps={formulaProps}
          cursorOn={cursorCoordinate?.lineIndex == node.lineIndex}
        />
      ))}
      <MarginBottom />
    </div>
  );
};

const Node: React.FC<NodeProps> = ({
  node,
  textDecoration,
  bracketLinkProps,
  hashTagProps,
  taggedLinkPropsMap,
  codeProps,
  formulaProps,
  cursorOn,
}) => {
  switch (node.type) {
    case 'itemization': {
      const { lineIndex, indentDepth, children } = node;
      const [from, to] = node.range;

      return (
        <div
          className={TextLinesConstants.line.className(lineIndex)}
          style={TextLinesConstants.line.style(textDecoration.fontSizes.level1)}
        >
          <span
            className={TextLinesConstants.line.indent.className}
            style={TextLinesConstants.line.indent.style(indentDepth)}
          >
            {[...Array(indentDepth).keys()].map((charIndex) => {
              const charClassName = TextLinesConstants.char.className(lineIndex, from + charIndex);
              const className = `${TextLinesConstants.line.pad.className} ${charClassName}`;
              return (
                <span key={charIndex} className={className}>
                  <span> </span>
                </span>
              );
            })}
            <span className={TextLinesConstants.itemization.dot.className} />
          </span>
          <span
            className={TextLinesConstants.line.content.className}
            style={TextLinesConstants.itemization.content.style(indentDepth)}
          >
            {children.map((child, index) => (
              <Node
                key={index}
                node={child}
                textDecoration={textDecoration}
                bracketLinkProps={bracketLinkProps}
                hashTagProps={hashTagProps}
                taggedLinkPropsMap={taggedLinkPropsMap}
                codeProps={codeProps}
                formulaProps={formulaProps}
                cursorOn={cursorOn}
              />
            ))}
            <Char lineIndex={lineIndex} charIndex={to} char={' '} />
          </span>
        </div>
      );
    }
    case 'blockCodeMeta':
    case 'blockCodeLine': {
      const { lineIndex, indentDepth } = node;
      const code = node.type == 'blockCodeMeta' ? node.meta : node.codeLine;
      const [from, to] = node.range;

      const blockCodeCharSpans = [
        ...[...code].map((char, index) => (
          <Char
            key={index}
            lineIndex={lineIndex}
            charIndex={from + indentDepth + index}
            char={char}
          />
        )),
      ];
      const codeElementProps = codeProps.codeProps?.(code);

      return (
        <div
          className={TextLinesConstants.line.className(lineIndex)}
          style={TextLinesConstants.line.style(textDecoration.fontSizes.level1)}
        >
          <span
            className={TextLinesConstants.line.indent.className}
            style={TextLinesConstants.line.indent.style(indentDepth)}
          >
            {[...Array(indentDepth).keys()].map((charIndex) => {
              const charClassName = TextLinesConstants.char.className(lineIndex, from + charIndex);
              const className = `${TextLinesConstants.line.pad.className} ${charClassName}`;
              return (
                <span key={charIndex} className={className}>
                  <span> </span>
                </span>
              );
            })}
          </span>
          {!codeProps.disabled ? (
            <span
              className={TextLinesConstants.line.content.className}
              style={TextLinesConstants.blockCodeLine.content.style(
                indentDepth,
                codeElementProps?.style
              )}
            >
              <code {...codeElementProps}>{blockCodeCharSpans}</code>
              <Char lineIndex={lineIndex} charIndex={to} char={' '} />
            </span>
          ) : (
            <span
              className={TextLinesConstants.line.content.className}
              style={TextLinesConstants.blockCodeLine.content.style(indentDepth)}
            >
              <span>{blockCodeCharSpans}</span>
              <Char lineIndex={lineIndex} charIndex={to} char={' '} />
            </span>
          )}
        </div>
      );
    }
    case 'inlineCode': {
      const { lineIndex, facingMeta, code, trailingMeta } = node;
      const [from, to] = node.range;

      const inlineCodeCharSpans = [
        ...[...facingMeta].map((char, index) => (
          <Char
            key={from + index}
            lineIndex={lineIndex}
            charIndex={from + index}
            char={codeProps.disabled || cursorOn ? char : ''}
          />
        )),
        ...[...code].map((char, index) => (
          <Char
            key={from + facingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={from + facingMeta.length + index}
            char={char}
          />
        )),
        ...[...trailingMeta].map((char, index) => (
          <Char
            key={to - trailingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={to - trailingMeta.length + index}
            char={codeProps.disabled || cursorOn ? char : ''}
          />
        )),
      ];
      const codeElementProps = codeProps.codeProps?.(code);

      return !codeProps.disabled ? (
        <code {...codeElementProps}>{inlineCodeCharSpans}</code>
      ) : (
        <span>{inlineCodeCharSpans}</span>
      );
    }
    case 'blockFormula':
    case 'inlineFormula': {
      const { lineIndex, facingMeta, formula, trailingMeta } = node;
      const [from, to] = node.range;
      const displayMode = node.type == 'blockFormula';

      return !formulaProps.disabled && !cursorOn ? (
        <span
          className={TextLinesConstants.charGroup.className(
            lineIndex,
            from + facingMeta.length,
            to - trailingMeta.length
          )}
        >
          <KaTeX
            options={{ throwOnError: false, displayMode }}
            onMouseDown={(event) => event.nativeEvent.stopImmediatePropagation()}
          >
            {formula}
          </KaTeX>
        </span>
      ) : (
        <span>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
          ))}
        </span>
      );
    }
    case 'decoration': {
      const { lineIndex, facingMeta, trailingMeta, children } = node;
      const [from, to] = node.range;
      const decorationStyle = getDecorationStyle(facingMeta, trailingMeta, textDecoration);
      return (
        <span style={TextLinesConstants.decoration.style(decorationStyle)}>
          {[...facingMeta].map((char, index) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ''}
            />
          ))}
          {children.map((child, index) => (
            <Node
              key={index}
              node={child}
              textDecoration={textDecoration}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              cursorOn={cursorOn}
            />
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ''}
            />
          ))}
        </span>
      );
    }
    case 'taggedLink': {
      const { lineIndex, facingMeta, tag, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const taggedLinkProps = taggedLinkPropsMap[getTagName(tag)];
      const anchorElementProps = taggedLinkProps.anchorProps?.(linkName);

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {[...facingMeta].map((char, index) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ''}
            />
          ))}
          {[...tag].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
              char={cursorOn || !taggedLinkProps.tagHidden ? char : ''}
            />
          ))}
          {[...linkName].map((char, index) => (
            <Char
              key={from + facingMeta.length + tag.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + tag.length + index}
              char={char}
            />
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ''}
            />
          ))}
        </AnchorWithHoverStyle>
      );
    }
    case 'bracketLink': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [from, to] = node.range;

      const bracketLinkCharSpans = [
        ...[...facingMeta].map((char, index) => (
          <Char
            key={from + index}
            lineIndex={lineIndex}
            charIndex={from + index}
            char={bracketLinkProps.disabled || cursorOn ? char : ''}
          />
        )),
        ...[...linkName].map((char, index) => (
          <Char
            key={from + facingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={from + facingMeta.length + index}
            char={char}
          />
        )),
        ...[...trailingMeta].map((char, index) => (
          <Char
            key={to - trailingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={to - trailingMeta.length + index}
            char={bracketLinkProps.disabled || cursorOn ? char : ''}
          />
        )),
      ];
      const anchorElementProps = bracketLinkProps.anchorProps?.(linkName);

      return !bracketLinkProps.disabled ? (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {bracketLinkCharSpans}
        </AnchorWithHoverStyle>
      ) : (
        <span>{bracketLinkCharSpans}</span>
      );
    }
    case 'hashTag': {
      const { lineIndex, hashTag } = node;
      const [from] = node.range;

      const hashTagCharSpans = [...hashTag].map((char, index) => (
        <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
      ));
      const anchorElementProps = hashTagProps.anchorProps?.(getHashTagName(hashTag));

      return !hashTagProps.disabled ? (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {hashTagCharSpans}
        </AnchorWithHoverStyle>
      ) : (
        <span>{hashTagCharSpans}</span>
      );
    }
    case 'normal': {
      const { lineIndex, text } = node;
      const [from] = node.range;

      return (
        <span>
          {[...text].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
          ))}
        </span>
      );
    }
  }
};

const AnchorWithHoverStyle: React.FC<
  React.ComponentProps<'a'> & { overriddenStyleOnHover?: React.CSSProperties; cursorOn: boolean }
> = (props) => {
  const {
    onMouseEnter,
    onMouseLeave,
    onClick,
    style,
    overriddenStyleOnHover,
    cursorOn,
    children,
    ...restAnchorProps
  } = props;
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
      {...restAnchorProps}
    >
      {children}
    </a>
  );
};

const Char: React.FC<CharProps> = (props) => (
  <span className={TextLinesConstants.char.className(props.lineIndex, props.charIndex)}>
    <span>{props.char}</span>
  </span>
);

const MarginBottom: React.FC = () => <div className={TextLinesConstants.marginBottom.className} />;
