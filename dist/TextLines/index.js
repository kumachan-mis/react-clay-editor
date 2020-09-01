import * as React from "react";
import { TextLinesConstants } from "./constants";
import { analyzeLine, analyzeFontOfContent } from "./utils";
export class TextLines extends React.Component {
    constructor() {
        super(...arguments);
        this.Indent = (props) => {
            if (props.indent.length == 0)
                return React.createElement(React.Fragment, null);
            const constants = TextLinesConstants.line.indent;
            return (React.createElement("span", { style: constants.style(props.indent.length) },
                [...props.indent].map((char, charIndex) => (React.createElement("span", { key: charIndex, className: TextLinesConstants.char.className(props.lineIndex, charIndex), style: constants.pad.style }, char))),
                React.createElement("span", { style: constants.dot.style })));
        };
        this.Content = (props) => {
            const constants = TextLinesConstants.line.content;
            const { indent, content, lineIndex } = props;
            const { cursorCoordinate } = this.props;
            const textsWithFont = analyzeFontOfContent(content, this.props.textStyle);
            const cursorOn = cursorCoordinate && cursorCoordinate.lineIndex == lineIndex;
            const lineLength = indent.length + content.length;
            const { className: charClassName } = TextLinesConstants.char;
            return (React.createElement("span", { style: constants.style(indent.length) },
                textsWithFont.map((textWithFont, withFontIndex) => {
                    const { text, section, fontSize, bold, italic, underline } = textWithFont;
                    const [start, end] = section;
                    const offset = indent.length + textWithFont.offset;
                    const style = constants.section.style(fontSize, bold, italic, underline);
                    return (React.createElement("span", { key: withFontIndex, style: style },
                        [...text.substring(0, start)].map((char, charIndex) => (React.createElement("span", { key: charIndex, className: charClassName(lineIndex, offset + charIndex) }, cursorOn ? char : ""))),
                        [...text.substring(start, end)].map((char, charIndex) => (React.createElement("span", { key: charIndex, className: charClassName(lineIndex, offset + start + charIndex) }, char))),
                        [...text.substring(end)].map((char, charIndex) => (React.createElement("span", { key: charIndex, className: charClassName(lineIndex, offset + end + charIndex) }, cursorOn ? char : "")))));
                }),
                React.createElement("span", { className: charClassName(lineIndex, lineLength) })));
        };
    }
    render() {
        return (React.createElement("div", { className: TextLinesConstants.className, style: TextLinesConstants.style }, this.props.text.split("\n").map((line, index) => {
            const { indent, content } = analyzeLine(line);
            return (React.createElement("div", { className: TextLinesConstants.line.className(index), key: index, style: TextLinesConstants.line.style(this.props.textStyle.fontSizes.level1) },
                React.createElement(this.Indent, { indent: indent, content: content, lineIndex: index }),
                React.createElement(this.Content, { indent: indent, content: content, lineIndex: index })));
        })));
    }
}
