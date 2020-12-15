import * as React from 'react';

import { Props, NodeProps, CharProps, Node, ParsingOptions, TaggedLinkPropsMap } from './types';
import {
  TextLinesConstants,
  defaultTextDecoration,
  defaultLinkStyle,
  defaultLinkOverriddenStyleOnHover,
  defaultCodeStyle,
} from './constants';
import { parseText, getDecorationStyle, getTagName, getHashTagName } from './utils';

import { BracketLinkProps, HashTagProps, CodeProps, FormulaProps } from '../Editor/types';
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
  } as BracketLinkProps,
  hashTagProps = {
    anchorProps: () => ({
      style: defaultLinkStyle,
      overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
    }),
  } as HashTagProps,
  taggedLinkPropsMap = {
    // empty object
  } as TaggedLinkPropsMap,
  codeProps = {
    codeProps: () => ({ style: defaultCodeStyle }),
  } as CodeProps,
  formulaProps = {
    // empty object
  } as FormulaProps,
  cursorCoordinate,
}) => {
  const options: ParsingOptions = {
    taggedLinkRegexes: Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
      TextLinesConstants.regexes.taggedLink(tagName, linkProps.linkNameRegex)
    ),
    disabledMap: {
      bracketLink: bracketLinkProps.disabled,
      hashTag: hashTagProps.disabled,
      code: codeProps.disabled,
      formula: formulaProps.disabled,
    },
  };
  const nodes = parseText(text, options);

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
          <span
            className={TextLinesConstants.line.content.className}
            style={TextLinesConstants.blockCodeLine.content.style(
              indentDepth,
              codeElementProps?.style
            )}
          >
            <code {...codeElementProps}>
              {[...code].map((char, index) => (
                <Char
                  key={index}
                  lineIndex={lineIndex}
                  charIndex={from + indentDepth + index}
                  char={char}
                />
              ))}
            </code>
            <Char lineIndex={lineIndex} charIndex={to} char={' '} />
          </span>
        </div>
      );
    }
    case 'inlineCode': {
      const { lineIndex, facingMeta, code, trailingMeta } = node;
      const [from, to] = node.range;
      const codeElementProps = codeProps.codeProps?.(code);

      return (
        <code {...codeElementProps}>
          {[...facingMeta].map((char, index) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : '\u200b'}
            />
          ))}
          {[...code].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
              char={char}
            />
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : '\u200b'}
            />
          ))}
        </code>
      );
    }
    case 'blockFormula':
    case 'inlineFormula': {
      const { lineIndex, facingMeta, formula, trailingMeta } = node;
      const [from, to] = node.range;
      const displayMode = node.type == 'blockFormula';

      return !cursorOn ? (
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
              char={cursorOn ? char : '\u200b'}
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
              char={cursorOn ? char : '\u200b'}
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
              char={cursorOn ? char : '\u200b'}
            />
          ))}
          {[...tag].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
              char={cursorOn || !taggedLinkProps.tagHidden ? char : '\u200b'}
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
              char={cursorOn ? char : '\u200b'}
            />
          ))}
        </AnchorWithHoverStyle>
      );
    }
    case 'bracketLink': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const anchorElementProps = bracketLinkProps.anchorProps?.(linkName);

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {[...facingMeta].map((char, index) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : '\u200b'}
            />
          ))}
          {[...linkName].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
              char={char}
            />
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : '\u200b'}
            />
          ))}
        </AnchorWithHoverStyle>
      );
    }
    case 'hashTag': {
      const { lineIndex, hashTag } = node;
      const [from] = node.range;
      const anchorElementProps = hashTagProps.anchorProps?.(getHashTagName(hashTag));

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {[...hashTag].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
          ))}
        </AnchorWithHoverStyle>
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
