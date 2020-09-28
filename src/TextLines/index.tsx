import * as React from "react";
import "katex/dist/katex.min.css";

import { Props, IndentProps, ContentProps, NodeProps, Node } from "./types";
import { TextLinesConstants, defaultTextDecoration } from "./constants";
import { parseLine, parseContent, getDecorationStyle, getTagName, getHashTagName } from "./utils";
import { KaTeX } from "../KaTeX";
import "../style.css";

export class TextLines extends React.Component<Props> {
  static readonly defaultProps: Required<
    Pick<
      Props,
      "textDecoration" | "bracketLinkProps" | "hashTagProps" | "taggedLinkPropsMap" | "formulaProps"
    >
  > = {
    textDecoration: defaultTextDecoration,
    bracketLinkProps: {},
    hashTagProps: {},
    taggedLinkPropsMap: {},
    formulaProps: {},
  };

  render(): React.ReactElement {
    return (
      <div className={TextLinesConstants.className}>
        {this.props.text.split("\n").map((line: string, index: number) => {
          const { indent, content } = parseLine(line);
          const defaultFontSize = this.props.textDecoration.fontSizes.level1;
          const on = index == this.props.cursorCoordinate?.lineIndex;
          return (
            <div
              className={TextLinesConstants.line.className(index)}
              key={index}
              style={TextLinesConstants.line.style(defaultFontSize)}
            >
              <this.Indent indent={indent} content={content} lineIndex={index} />
              <this.Content indent={indent} content={content} lineIndex={index} cursorOn={on} />
            </div>
          );
        })}
      </div>
    );
  }

  private Indent = (props: IndentProps): React.ReactElement => {
    if (props.indent.length == 0) return <></>;

    const constants = TextLinesConstants.line.indent;
    return (
      <span className={constants.className} style={constants.style(props.indent.length)}>
        {[...props.indent].map((char: string, charIndex: number) => {
          const charClassName = TextLinesConstants.char.className(props.lineIndex, charIndex);
          return (
            <span key={charIndex} className={`${constants.pad.className} ${charClassName}`}>
              {" "}
            </span>
          );
        })}
        <span className={constants.dot.className} />
      </span>
    );
  };

  private Content = (props: ContentProps): React.ReactElement => {
    const constants = TextLinesConstants.line.content;
    const charConstants = TextLinesConstants.char;
    const { indent, content, lineIndex, cursorOn } = props;
    return (
      <span className={constants.className} style={constants.style(indent.length)}>
        {parseContent(content, this.props.taggedLinkPropsMap, indent.length).map(
          (node: Node, index: number) => (
            <this.Node key={index} node={node} lineIndex={lineIndex} cursorOn={cursorOn} />
          )
        )}
        <span className={charConstants.className(lineIndex, indent.length + content.length)}>
          {" "}
        </span>
      </span>
    );
  };

  private Node = (props: NodeProps): React.ReactElement => {
    const constants = TextLinesConstants.line.content;
    const charConstants = TextLinesConstants.char;
    const charGroupConstants = TextLinesConstants.charGroup;

    const { lineIndex, cursorOn } = props;
    const [from, to] = props.node.range;

    switch (props.node.type) {
      case "decoration": {
        const { facingMeta, trailingMeta, children } = props.node;
        const { textDecoration } = this.props;
        const decorationStyle = getDecorationStyle(facingMeta, trailingMeta, textDecoration);
        return (
          <span style={constants.decoration.style(decorationStyle)}>
            {[...facingMeta].map((char: string, index: number) => (
              <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
                {cursorOn ? char : ""}
              </span>
            ))}
            {children.map((child: Node, index: number) => (
              <this.Node key={index} node={child} lineIndex={lineIndex} cursorOn={cursorOn} />
            ))}
            {[...trailingMeta].map((char: string, index: number) => (
              <span
                key={to - trailingMeta.length + index}
                className={charConstants.className(lineIndex, to - trailingMeta.length + index)}
              >
                {cursorOn ? char : ""}
              </span>
            ))}
          </span>
        );
      }
      case "taggedLink": {
        const { facingMeta, tag, linkName, trailingMeta } = props.node;
        const { anchorProps, tagHidden } = this.props.taggedLinkPropsMap[getTagName(tag)];
        return (
          <a style={constants.taggedLink.style} {...(anchorProps?.(linkName) || {})}>
            {[...facingMeta].map((char: string, index: number) => (
              <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
                {cursorOn ? char : ""}
              </span>
            ))}
            {[...tag].map((char: string, index: number) => (
              <span
                key={from + facingMeta.length + index}
                className={charConstants.className(lineIndex, from + facingMeta.length + index)}
              >
                {cursorOn || !tagHidden ? char : ""}
              </span>
            ))}
            {[...linkName].map((char: string, index: number) => (
              <span
                key={from + facingMeta.length + tag.length + index}
                className={charConstants.className(
                  lineIndex,
                  from + facingMeta.length + tag.length + index
                )}
              >
                {char}
              </span>
            ))}
            {[...trailingMeta].map((char: string, index: number) => (
              <span
                key={to - trailingMeta.length + index}
                className={charConstants.className(lineIndex, to - trailingMeta.length + index)}
              >
                {cursorOn ? char : ""}
              </span>
            ))}
          </a>
        );
      }
      case "bracketLink": {
        const { facingMeta, linkName, trailingMeta } = props.node;
        const { disabled, anchorProps } = this.props.bracketLinkProps;
        const bracketLinkCharSpans = [
          ...[...facingMeta].map((char: string, index: number) => (
            <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
              {disabled || cursorOn ? char : ""}
            </span>
          )),
          ...[...linkName].map((char: string, index: number) => (
            <span
              key={from + facingMeta.length + index}
              className={charConstants.className(lineIndex, from + facingMeta.length + index)}
            >
              {char}
            </span>
          )),
          ...[...trailingMeta].map((char: string, index: number) => (
            <span
              key={to - trailingMeta.length + index}
              className={charConstants.className(lineIndex, to - trailingMeta.length + index)}
            >
              {disabled || cursorOn ? char : ""}
            </span>
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
      case "blockFormula": {
        const { facingMeta, formula, trailingMeta } = props.node;
        const { disabled } = this.props.formulaProps;

        return !disabled && !cursorOn ? (
          <KaTeX
            className={charGroupConstants.className(
              lineIndex,
              from + facingMeta.length,
              to - trailingMeta.length
            )}
            options={{ displayMode: true }}
          >
            {formula}
          </KaTeX>
        ) : (
          <span>
            {[...facingMeta, ...formula, ...trailingMeta].map((char: string, index: number) => (
              <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
                {char}
              </span>
            ))}
          </span>
        );
      }
      case "inlineFormula": {
        const { facingMeta, formula, trailingMeta } = props.node;
        const { disabled } = this.props.formulaProps;

        return !disabled && !cursorOn ? (
          <KaTeX
            className={charGroupConstants.className(
              lineIndex,
              from + facingMeta.length,
              to - trailingMeta.length
            )}
          >
            {formula}
          </KaTeX>
        ) : (
          <span>
            {[...facingMeta, ...formula, ...trailingMeta].map((char: string, index: number) => (
              <span key={index} className={charConstants.className(lineIndex, from + index)}>
                {char}
              </span>
            ))}
          </span>
        );
      }
      case "hashTag": {
        const hashTagName = getHashTagName(props.node.hashTag);
        const { disabled, anchorProps } = this.props.hashTagProps;
        const hashTagCharSpans = [...props.node.hashTag].map((char: string, index: number) => (
          <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
            {char}
          </span>
        ));
        return !disabled ? (
          <a style={constants.hashTag.style} {...(anchorProps?.(hashTagName) || {})}>
            {hashTagCharSpans}
          </a>
        ) : (
          <span>{hashTagCharSpans}</span>
        );
      }
      case "normal":
        return (
          <span>
            {[...props.node.text].map((char: string, index: number) => (
              <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
                {char}
              </span>
            ))}
          </span>
        );
    }
  };
}
