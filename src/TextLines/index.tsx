import * as React from "react";

import { Props, IndentProps, ContentProps, NodeProps, Node } from "./types";
import { TextLinesConstants } from "./constants";
import { parseLine, parseContent, getDecorationStyle, getTagName, getHashTagName } from "./utils";
import "../style.css";

export class TextLines extends React.Component<Props> {
  render(): React.ReactElement {
    return (
      <div className={TextLinesConstants.className}>
        {this.props.text.split("\n").map((line: string, index: number) => {
          const { indent, content } = parseLine(line);
          const defaultFontSize = this.props.decoration.fontSizes.level1;
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
    const { taggedLinkMap } = this.props;
    const { indent, content, lineIndex, cursorOn } = props;
    return (
      <span className={constants.className} style={constants.style(indent.length)}>
        {parseContent(content, taggedLinkMap, indent.length).map((node: Node, index: number) => (
          <this.Node key={index} node={node} lineIndex={lineIndex} cursorOn={cursorOn} />
        ))}
        <span className={charConstants.className(lineIndex, indent.length + content.length)}>
          {" "}
        </span>
      </span>
    );
  };

  private Node = (props: NodeProps): React.ReactElement => {
    const constants = TextLinesConstants.line.content;
    const charConstants = TextLinesConstants.char;

    const { lineIndex, cursorOn } = props;
    const [from, to] = props.node.range;

    switch (props.node.type) {
      case "decoration": {
        const { children } = props.node;
        const { facingMeta, trailingMeta } = props.node;
        const decorationStyle = getDecorationStyle(facingMeta, trailingMeta, this.props.decoration);
        return (
          <span style={constants.decoration.style(decorationStyle)}>
            {[...facingMeta].map((char: string, index: number) => (
              <span key={index} className={charConstants.className(lineIndex, from + index)}>
                {cursorOn ? char : ""}
              </span>
            ))}
            {children.map((child: Node, index: number) => (
              <this.Node key={index} node={child} lineIndex={lineIndex} cursorOn={cursorOn} />
            ))}
            {[...trailingMeta].map((char: string, index: number, array: string[]) => (
              <span
                key={index}
                className={charConstants.className(lineIndex, to - array.length + index)}
              >
                {cursorOn ? char : ""}
              </span>
            ))}
          </span>
        );
      }
      case "taggedLink": {
        const { facingMeta, tag, linkName, trailingMeta } = props.node;
        const taggedLink = this.props.taggedLinkMap[getTagName(tag)];
        return (
          <a style={constants.taggedLink.style} {...(taggedLink.props?.(linkName) || {})}>
            {[...facingMeta].map((char: string, index: number) => (
              <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
                {cursorOn ? char : ""}
              </span>
            ))}
            {[...tag].map((char: string, index: number) => (
              <span
                key={from + index}
                className={charConstants.className(lineIndex, from + facingMeta.length + index)}
              >
                {cursorOn || !taggedLink.tagHidden ? char : ""}
              </span>
            ))}
            {[...linkName].map((char: string, index: number) => (
              <span
                key={from + facingMeta.length + index}
                className={charConstants.className(
                  lineIndex,
                  from + facingMeta.length + tag.length + index
                )}
              >
                {char}
              </span>
            ))}
            {[...trailingMeta].map((char: string, index: number, array: string[]) => (
              <span
                key={to - array.length + index}
                className={charConstants.className(lineIndex, to - array.length + index)}
              >
                {cursorOn ? char : ""}
              </span>
            ))}
          </a>
        );
      }
      case "bracketLink": {
        const { facingMeta, linkName, trailingMeta } = props.node;
        const bracketLinkCharSpans = [
          ...[...facingMeta].map((char: string, index: number) => (
            <span key={from + index} className={charConstants.className(lineIndex, from + index)}>
              {cursorOn ? char : ""}
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
          ...[...trailingMeta].map((char: string, index: number, array: string[]) => (
            <span
              key={to - array.length + index}
              className={charConstants.className(lineIndex, to - array.length + index)}
            >
              {cursorOn ? char : ""}
            </span>
          )),
        ];
        return !this.props.bracketLinkDisabled ? (
          <a style={constants.bracketLink.style} {...this.props.bracketLinkProps(linkName)}>
            {bracketLinkCharSpans}
          </a>
        ) : (
          <span>{bracketLinkCharSpans}</span>
        );
      }
      case "hashTag": {
        const hashTagName = getHashTagName(props.node.hashTag);
        const hashTagCharSpans = [...props.node.hashTag].map((char: string, index: number) => (
          <span key={index} className={charConstants.className(lineIndex, from + index)}>
            {char}
          </span>
        ));
        return !this.props.hashTagDisabled ? (
          <a style={constants.hashTag.style} {...this.props.hashTagProps(hashTagName)}>
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
              <span key={index} className={charConstants.className(lineIndex, from + index)}>
                {char}
              </span>
            ))}
          </span>
        );
    }
  };
}
