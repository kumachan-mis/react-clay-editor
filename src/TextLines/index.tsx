import * as React from "react";

import { Props, NodeProps, CharProps, Node } from "./types";
import {
  TextLinesConstants,
  defaultTextDecoration,
  defaultLinkStyle,
  defaultCodeStyle,
} from "./constants";
import { parseText, getDecorationStyle, getTagName, getHashTagName } from "./utils";
import { KaTeX } from "../KaTeX";
import "../style.css";

export const TextLines: React.FC<Props> = ({
  text,
  textDecoration = defaultTextDecoration,
  bracketLinkProps = { anchorProps: () => ({ style: defaultLinkStyle }) },
  hashTagProps = { anchorProps: () => ({ style: defaultLinkStyle }) },
  taggedLinkPropsMap = {},
  codeProps = { codeProps: () => ({ style: defaultCodeStyle }) },
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
    case "itemization": {
      const { lineIndex, indent, children } = node;
      const [, to] = node.range;

      return (
        <div
          className={TextLinesConstants.line.className(lineIndex)}
          style={TextLinesConstants.line.style(textDecoration.fontSizes.level1)}
        >
          <span
            className={TextLinesConstants.itemization.indent.className}
            style={TextLinesConstants.itemization.indent.style(indent.length)}
          >
            {[...indent].map((char: string, charIndex: number) => {
              const charClassName = TextLinesConstants.char.className(lineIndex, charIndex);
              const className = `${TextLinesConstants.itemization.pad.className} ${charClassName}`;
              return (
                <span key={charIndex} className={className}>
                  <span> </span>
                </span>
              );
            })}
            <span className={TextLinesConstants.itemization.dot.className} />
          </span>
          <span
            className={TextLinesConstants.itemization.content.className}
            style={TextLinesConstants.itemization.content.style(indent.length)}
          >
            {children.map((child: Node, index: number) => (
              <Node
                key={index}
                node={child}
                textDecoration={textDecoration}
                bracketLinkProps={bracketLinkProps}
                hashTagProps={bracketLinkProps}
                taggedLinkPropsMap={taggedLinkPropsMap}
                codeProps={codeProps}
                formulaProps={formulaProps}
                cursorOn={cursorOn}
              />
            ))}
            <Char lineIndex={lineIndex} charIndex={to} char={" "} />
          </span>
        </div>
      );
    }
    case "inlineCode": {
      const { lineIndex, facingMeta, code, trailingMeta } = node;
      const [from, to] = node.range;
      const { codeProps: codeElementProps, disabled } = codeProps;
      const inlineCodeCharSpans = [
        ...[...facingMeta].map((char: string, index: number) => (
          <Char
            key={from + index}
            lineIndex={lineIndex}
            charIndex={from + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
        ...[...code].map((char: string, index: number) => (
          <Char
            key={from + facingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={from + facingMeta.length + index}
            char={char}
          />
        )),
        ...[...trailingMeta].map((char: string, index: number) => (
          <Char
            key={to - trailingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={to - trailingMeta.length + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
      ];

      return !disabled ? (
        <code style={defaultCodeStyle} {...(codeElementProps?.(code) || {})}>
          {inlineCodeCharSpans}
        </code>
      ) : (
        <span>{inlineCodeCharSpans}</span>
      );
    }
    case "blockFormula":
    case "inlineFormula": {
      const { lineIndex, facingMeta, formula, trailingMeta } = node;
      const [from, to] = node.range;
      const { disabled } = formulaProps;
      const displayMode = node.type == "blockFormula";

      return !disabled && !cursorOn ? (
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
          {[...facingMeta, ...formula, ...trailingMeta].map((char: string, index: number) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
          ))}
        </span>
      );
    }
    case "decoration": {
      const { lineIndex, facingMeta, trailingMeta, children } = node;
      const [from, to] = node.range;
      const decorationStyle = getDecorationStyle(facingMeta, trailingMeta, textDecoration);
      return (
        <span style={TextLinesConstants.decoration.style(decorationStyle)}>
          {[...facingMeta].map((char: string, index: number) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ""}
            />
          ))}
          {children.map((child: Node, index: number) => (
            <Node
              key={index}
              node={child}
              textDecoration={textDecoration}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={bracketLinkProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              cursorOn={cursorOn}
            />
          ))}
          {[...trailingMeta].map((char: string, index: number) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ""}
            />
          ))}
        </span>
      );
    }
    case "taggedLink": {
      const { lineIndex, facingMeta, tag, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const { anchorProps: anchorElementProps, tagHidden } = taggedLinkPropsMap[getTagName(tag)];
      return (
        <a style={defaultLinkStyle} {...(anchorElementProps?.(linkName) || {})}>
          {[...facingMeta].map((char: string, index: number) => (
            <Char
              key={from + index}
              lineIndex={lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ""}
            />
          ))}
          {[...tag].map((char: string, index: number) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
              char={cursorOn || !tagHidden ? char : ""}
            />
          ))}
          {[...linkName].map((char: string, index: number) => (
            <Char
              key={from + facingMeta.length + tag.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + tag.length + index}
              char={char}
            />
          ))}
          {[...trailingMeta].map((char: string, index: number) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ""}
            />
          ))}
        </a>
      );
    }
    case "bracketLink": {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const { anchorProps: anchorElementProps, disabled } = bracketLinkProps;
      const bracketLinkCharSpans = [
        ...[...facingMeta].map((char: string, index: number) => (
          <Char
            key={from + index}
            lineIndex={lineIndex}
            charIndex={from + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
        ...[...linkName].map((char: string, index: number) => (
          <Char
            key={from + facingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={from + facingMeta.length + index}
            char={char}
          />
        )),
        ...[...trailingMeta].map((char: string, index: number) => (
          <Char
            key={to - trailingMeta.length + index}
            lineIndex={lineIndex}
            charIndex={to - trailingMeta.length + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
      ];
      return !disabled ? (
        <a style={defaultLinkStyle} {...(anchorElementProps?.(linkName) || {})}>
          {bracketLinkCharSpans}
        </a>
      ) : (
        <span>{bracketLinkCharSpans}</span>
      );
    }
    case "hashTag": {
      const { lineIndex, hashTag } = node;
      const [from] = node.range;
      const { anchorProps: anchorElementProps, disabled } = hashTagProps;
      const hashTagName = getHashTagName(hashTag);
      const hashTagCharSpans = [...hashTag].map((char: string, index: number) => (
        <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
      ));
      return !disabled ? (
        <a style={defaultLinkStyle} {...(anchorElementProps?.(hashTagName) || {})}>
          {hashTagCharSpans}
        </a>
      ) : (
        <span>{hashTagCharSpans}</span>
      );
    }
    case "normal": {
      const { lineIndex, text } = node;
      const [from] = node.range;
      return (
        <span>
          {[...text].map((char: string, index: number) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index} char={char} />
          ))}
        </span>
      );
    }
  }
};

const Char: React.FC<CharProps> = (props) => (
  <span className={TextLinesConstants.char.className(props.lineIndex, props.charIndex)}>
    <span>{props.char}</span>
  </span>
);
