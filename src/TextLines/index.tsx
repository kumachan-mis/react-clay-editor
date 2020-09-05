import * as React from "react";

import { Props, IndentProps, ContentProps, NodeProps, Node } from "./types";
import { TextLinesConstants } from "./constants";
import { parseLine, parseContent, getDecorationStyle } from "./utils";

export class TextLines extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={TextLinesConstants.className} style={TextLinesConstants.style}>
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

  private Indent = (props: IndentProps): JSX.Element => {
    if (props.indent.length == 0) return <></>;

    const constants = TextLinesConstants.line.indent;
    return (
      <span style={constants.style(props.indent.length)}>
        {[...props.indent].map((char: string, charIndex: number) => (
          <span
            key={charIndex}
            className={TextLinesConstants.char.className(props.lineIndex, charIndex)}
            style={constants.pad.style}
          >
            {char}
          </span>
        ))}
        <span style={constants.dot.style} />
      </span>
    );
  };

  private Content = (props: ContentProps): JSX.Element => {
    const constants = TextLinesConstants.line.content;
    const charConstants = TextLinesConstants.char;
    const { indent, content, lineIndex, cursorOn } = props;
    return (
      <span style={constants.style(indent.length)}>
        {parseContent(content).map((node: Node, index: number) => (
          <this.Node key={index} node={node} lineIndex={lineIndex} cursorOn={cursorOn} />
        ))}
        <span className={charConstants.className(lineIndex, indent.length + content.length)}>
          {" "}
        </span>
      </span>
    );
  };

  private Node = (props: NodeProps): JSX.Element => {
    const constants = TextLinesConstants.line.content;
    const charConstants = TextLinesConstants.char;

    const { lineIndex, cursorOn } = props;

    switch (props.node.type) {
      case "decoration": {
        const { decoration, children, range } = props.node;
        const [from, to] = range;
        const decorationStyle = getDecorationStyle(decoration, this.props.decoration);
        return (
          <span style={constants.decoration.style(decorationStyle)}>
            <span className={charConstants.className(lineIndex, from)}>{cursorOn ? "[" : ""}</span>
            {[...decoration].map((char: string, index: number) => (
              <span key={index} className={charConstants.className(lineIndex, from + index + 1)}>
                {cursorOn ? char : ""}
              </span>
            ))}
            <span className={charConstants.className(lineIndex, from + decoration.length + 1)}>
              {cursorOn ? " " : ""}
            </span>
            {children.map((child: Node, index: number) => (
              <this.Node key={index} node={child} lineIndex={lineIndex} cursorOn={cursorOn} />
            ))}
            <span className={charConstants.className(lineIndex, to - 1)}>
              {cursorOn ? "]" : ""}
            </span>
          </span>
        );
      }
      case "link":
        return <></>;
      case "hashTag":
        return <></>;
      case "normal": {
        const { text, range } = props.node;
        const [from] = range;
        return (
          <span>
            {[...text].map((char: string, index: number) => (
              <span key={index} className={charConstants.className(lineIndex, from + index)}>
                {char}
              </span>
            ))}
          </span>
        );
      }
    }
  };
}
