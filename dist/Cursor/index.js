import * as React from "react";
import { CursorConstants } from "./constants";
import { cursorPropsToState } from "./utils";
export class Cursor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { position: [0, 0], textAreaValue: "", cursorSize: 0 };
        this.textArea = null;
    }
    componentDidUpdate(prevProps) {
        if (prevProps == this.props)
            return;
        const state = cursorPropsToState(this.props, this.state);
        this.setState(state);
        if (this.props.coordinate)
            this.textArea?.focus();
    }
    render() {
        const [top, left] = this.state.position;
        const hidden = this.state.position === undefined;
        const textLength = this.state.textAreaValue.length;
        const { cursorSize } = this.state;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: CursorConstants.rootDiv.style(top, left, cursorSize, hidden) },
                React.createElement("svg", { width: CursorConstants.svg.width, height: cursorSize },
                    React.createElement("rect", { x: CursorConstants.rect.x, y: CursorConstants.rect.y, width: CursorConstants.rect.width, height: CursorConstants.rect.height }))),
            React.createElement("textarea", { value: this.state.textAreaValue, wrap: CursorConstants.textArea.wrap, spellCheck: CursorConstants.textArea.spellCheck, autoCapitalize: CursorConstants.textArea.autoCapitalize, onChange: (event) => this.setState({ textAreaValue: event.target.value }), onCompositionStart: () => this.props.onTextCompositionStart(), onCompositionEnd: () => {
                    this.props.onTextCompositionEnd(this.state.textAreaValue);
                    this.setState({ textAreaValue: "" });
                }, style: CursorConstants.textArea.style(top, left, cursorSize, textLength), ref: (textArea) => (this.textArea = textArea) })));
    }
}
