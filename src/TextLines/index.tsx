import * as React from "react";
import "katex/dist/katex.min.css";

import { Props, IndentProps, ContentProps, NodeProps, CharProps, Node } from "./types";
import { TextLinesConstants } from "./constants";
import { parseLine, parseContent, getDecorationStyle, getTagName, getHashTagName } from "./utils";
import { KaTeX } from "../KaTeX";
import "../style.css";

export const TextLines: React.FC<Props> = (props) => (
  <div className={TextLinesConstants.className}>
    {props.text.split("\n").map((line: string, index: number) => {
      const { indent, content } = parseLine(line);
      const defaultFontSize = props.textDecoration.fontSizes.level1;
      return (
        <div
          className={TextLinesConstants.line.className(index)}
          key={index}
          style={TextLinesConstants.line.style(defaultFontSize)}
        >
          <Indent indent={indent} content={content} lineIndex={index} {...props} />
          <Content indent={indent} content={content} lineIndex={index} {...props} />
        </div>
      );
    })}
  </div>
);

const Indent: React.FC<IndentProps> = (props) => {
  if (props.indent.length == 0) return <></>;

  const constants = TextLinesConstants.line.indent;
  return (
    <span className={constants.className} style={constants.style(props.indent.length)}>
      {[...props.indent].map((char: string, charIndex: number) => {
        const charClassName = TextLinesConstants.char.className(props.lineIndex, charIndex);
        return (
          <span key={charIndex} className={`${constants.pad.className} ${charClassName}`}>
            <span> </span>
          </span>
        );
      })}
      <span className={constants.dot.className} />
    </span>
  );
};

const Content: React.FC<ContentProps> = (props) => (
  <span
    className={TextLinesConstants.line.content.className}
    style={TextLinesConstants.line.content.style(props.indent.length)}
  >
    {parseContent(props.content, props.taggedLinkPropsMap, props.indent.length).map(
      (node: Node, index: number) => (
        <Node key={index} node={node} {...props} />
      )
    )}
    <Char
      key={props.indent.length + props.content.length}
      lineIndex={props.lineIndex}
      charIndex={props.indent.length + props.content.length}
      char=" "
    />
  </span>
);

const Node: React.FC<NodeProps> = (props) => {
  const constants = TextLinesConstants.line.content;
  const charGroupConstants = TextLinesConstants.charGroup;

  const cursorOn = props.lineIndex == props.cursorCoordinate?.lineIndex;
  const [from, to] = props.node.range;

  switch (props.node.type) {
    case "decoration": {
      const { facingMeta, trailingMeta, children } = props.node;
      const decorationStyle = getDecorationStyle(facingMeta, trailingMeta, props.textDecoration);
      return (
        <span style={constants.decoration.style(decorationStyle)}>
          {[...facingMeta].map((char: string, index: number) => (
            <Char
              key={from + index}
              lineIndex={props.lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ""}
            />
          ))}
          {children.map((child: Node, index: number) => (
            <Node key={index} {...props} node={child} />
          ))}
          {[...trailingMeta].map((char: string, index: number) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={props.lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ""}
            />
          ))}
        </span>
      );
    }
    case "taggedLink": {
      const { facingMeta, tag, linkName, trailingMeta } = props.node;
      const { anchorProps, tagHidden } = props.taggedLinkPropsMap[getTagName(tag)];
      return (
        <a style={constants.taggedLink.style} {...(anchorProps?.(linkName) || {})}>
          {[...facingMeta].map((char: string, index: number) => (
            <Char
              key={from + index}
              lineIndex={props.lineIndex}
              charIndex={from + index}
              char={cursorOn ? char : ""}
            />
          ))}
          {[...tag].map((char: string, index: number) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={props.lineIndex}
              charIndex={from + facingMeta.length + index}
              char={cursorOn || !tagHidden ? char : ""}
            />
          ))}
          {[...linkName].map((char: string, index: number) => (
            <Char
              key={from + facingMeta.length + tag.length + index}
              lineIndex={props.lineIndex}
              charIndex={from + facingMeta.length + tag.length + index}
              char={char}
            />
          ))}
          {[...trailingMeta].map((char: string, index: number) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={props.lineIndex}
              charIndex={to - trailingMeta.length + index}
              char={cursorOn ? char : ""}
            />
          ))}
        </a>
      );
    }
    case "bracketLink": {
      const { facingMeta, linkName, trailingMeta } = props.node;
      const { disabled, anchorProps } = props.bracketLinkProps;
      const bracketLinkCharSpans = [
        ...[...facingMeta].map((char: string, index: number) => (
          <Char
            key={from + index}
            lineIndex={props.lineIndex}
            charIndex={from + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
        ...[...linkName].map((char: string, index: number) => (
          <Char
            key={from + facingMeta.length + index}
            lineIndex={props.lineIndex}
            charIndex={from + facingMeta.length + index}
            char={char}
          />
        )),
        ...[...trailingMeta].map((char: string, index: number) => (
          <Char
            key={to - trailingMeta.length + index}
            lineIndex={props.lineIndex}
            charIndex={to - trailingMeta.length + index}
            char={disabled || cursorOn ? char : ""}
          />
        )),
      ];
      return !disabled ? (
        <a style={constants.bracketLink.style} {...(anchorProps?.(linkName) || {})}>
          {bracketLinkCharSpans}
        </a>
      ) : (
        <span>{bracketLinkCharSpans}</span>
      );
    }
    case "displayFormula":
    case "inlineFormula": {
      const { facingMeta, formula, trailingMeta } = props.node;
      const { disabled } = props.formulaProps;
      const displayMode = props.node.type == "displayFormula";
      const [fromCharIndex, toCharIndex] = [from + facingMeta.length, to - trailingMeta.length];
      return (
        <span className={charGroupConstants.className(props.lineIndex, fromCharIndex, toCharIndex)}>
          {!disabled && !cursorOn ? (
            <KaTeX
              options={{ throwOnError: false, displayMode }}
              onMouseDown={(event) => event.nativeEvent.stopImmediatePropagation()}
            >
              {formula}
            </KaTeX>
          ) : (
            [...facingMeta, ...formula, ...trailingMeta].map((char: string, index: number) => (
              <Char key={index} lineIndex={props.lineIndex} charIndex={from + index} char={char} />
            ))
          )}
        </span>
      );
    }
    case "hashTag": {
      const hashTagName = getHashTagName(props.node.hashTag);
      const { disabled, anchorProps } = props.hashTagProps;
      const charSpans = [...props.node.hashTag].map((char: string, index: number) => (
        <Char key={index} lineIndex={props.lineIndex} charIndex={from + index} char={char} />
      ));
      return !disabled ? (
        <a style={constants.hashTag.style} {...(anchorProps?.(hashTagName) || {})}>
          {charSpans}
        </a>
      ) : (
        <span>{charSpans}</span>
      );
    }
    case "normal": {
      const charSpans = [...props.node.text].map((char: string, index: number) => (
        <Char key={index} lineIndex={props.lineIndex} charIndex={from + index} char={char} />
      ));
      return <span>{charSpans}</span>;
    }
  }
};

export const Char: React.FC<CharProps> = (props) => (
  <span className={TextLinesConstants.char.className(props.lineIndex, props.charIndex)}>
    <span>{props.char}</span>
  </span>
);
