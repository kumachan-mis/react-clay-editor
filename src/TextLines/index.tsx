import * as React from "react";

import { Props, TextLineProps, TextWithFont } from "./types";
import { TextLinesConstants } from "./constants";
import { analyzeLine, analyzeFontOfContent } from "./utils";

export class TextLines extends React.Component<Props> {
  render(): JSX.Element {
    const constants = TextLinesConstants.line;
    return (
      <div id={TextLinesConstants.id} style={TextLinesConstants.style}>
        {this.props.text.split("\n").map((line: string, index: number) => {
          const { indent, content } = analyzeLine(line);
          return (
            <div
              id={constants.id(index)}
              key={index}
              style={constants.style(this.props.textStyle.fontSizes.level1)}
            >
              <this.Indent indent={indent} content={content} lineIndex={index} />
              <this.Content indent={indent} content={content} lineIndex={index} />
            </div>
          );
        })}
      </div>
    );
  }

  private Indent = (props: TextLineProps): JSX.Element => {
    if (props.indent.length == 0) return <></>;

    const constants = TextLinesConstants.line.indent;
    return (
      <span style={constants.style(props.indent.length)}>
        {[...props.indent].map((char: string, charIndex: number) => (
          <span
            key={charIndex}
            id={TextLinesConstants.char.id(props.lineIndex, charIndex)}
            style={constants.pad.style}
          >
            {char}
          </span>
        ))}
        <span style={constants.dot.style} />
      </span>
    );
  };

  private Content = (props: TextLineProps): JSX.Element => {
    const constants = TextLinesConstants.line.content;
    const { indent, content, lineIndex } = props;
    const { cursorCoordinate } = this.props;

    const textsWithFont = analyzeFontOfContent(content, this.props.textStyle);
    const cursorOn = cursorCoordinate && cursorCoordinate.lineIndex == lineIndex;
    const lineLength = indent.length + content.length;
    const { id: charId } = TextLinesConstants.char;

    return (
      <span style={constants.style(indent.length)}>
        {textsWithFont.map((textWithFont: TextWithFont, withFontIndex: number) => {
          const { text, section, fontSize, bold, italic, underline } = textWithFont;
          const [start, end] = section;
          const offset = indent.length + textWithFont.offset;
          const style = constants.section.style(fontSize, bold, italic, underline);
          return (
            <span key={withFontIndex} style={style}>
              {[...text.substring(0, start)].map((char: string, charIndex: number) => (
                <span key={charIndex} id={charId(lineIndex, offset + charIndex)}>
                  {cursorOn ? char : ""}
                </span>
              ))}
              {[...text.substring(start, end)].map((char: string, charIndex: number) => (
                <span key={charIndex} id={charId(lineIndex, offset + start + charIndex)}>
                  {char}
                </span>
              ))}
              {[...text.substring(end)].map((char: string, charIndex: number) => (
                <span key={charIndex} id={charId(lineIndex, offset + end + charIndex)}>
                  {cursorOn ? char : ""}
                </span>
              ))}
            </span>
          );
        })}
        <span id={charId(lineIndex, lineLength)} />
      </span>
    );
  };
}
