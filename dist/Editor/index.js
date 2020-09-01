import * as React from "react";
import { EditorConstants } from "./constants";
import { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp, handleOnMouseLeave, handleOnKeyDown, handleOnCompositionStart, handleOnCompositionEnd, } from "./utils";
import { Cursor } from "../Cursor";
import { Selection } from "../Selection";
import { TextLines } from "../TextLines";
export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnKeyDown = (event) => {
            if (this.props.disabled || !this.state.cursorCoordinate)
                return;
            event.preventDefault();
            const [text, state] = handleOnKeyDown(this.props.text, this.state, event.key);
            if (state != this.state)
                this.setState(state);
            if (text != this.props.text)
                this.props.onChangeText(text);
        };
        this.handleOnEditorBlur = (event) => {
            if (this.props.disabled)
                return;
            const elements = document.elementsFromPoint(event.clientX, event.clientY);
            const editorId = EditorConstants.editor.id;
            const editor = elements.find((element) => element.id == editorId);
            if (!editor)
                this.setState({ cursorCoordinate: undefined });
        };
        this.state = {
            cursorCoordinate: undefined,
            isComposing: false,
            textSelection: undefined,
            moveCount: 0,
        };
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleOnEditorBlur);
        document.addEventListener("keydown", this.handleOnKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleOnKeyDown);
        document.removeEventListener("mousedown", this.handleOnEditorBlur);
    }
    render() {
        return (React.createElement("div", { id: EditorConstants.editor.id, onMouseDown: (event) => {
                if (this.props.disabled || event.button != 0)
                    return;
                const { clientX: x, clientY: y } = event;
                const [text, state] = handleOnMouseDown(this.props.text, this.state, [x, y]);
                if (state != this.state)
                    this.setState(state);
                if (text != this.props.text)
                    this.props.onChangeText(text);
            }, onMouseMove: (event) => {
                if (this.props.disabled)
                    return;
                const { clientX: x, clientY: y } = event;
                const [text, state] = handleOnMouseMove(this.props.text, this.state, [x, y]);
                if (state != this.state)
                    this.setState(state);
                if (text != this.props.text)
                    this.props.onChangeText(text);
            }, onMouseUp: (event) => {
                if (this.props.disabled || event.button != 0)
                    return;
                const { clientX: x, clientY: y } = event;
                const [text, state] = handleOnMouseUp(this.props.text, this.state, [x, y]);
                if (state != this.state)
                    this.setState(state);
                if (text != this.props.text)
                    this.props.onChangeText(text);
            }, onMouseLeave: (event) => {
                if (this.props.disabled || event.button != 0)
                    return;
                const { clientX: x, clientY: y } = event;
                const [text, state] = handleOnMouseLeave(this.props.text, this.state, [x, y]);
                if (state != this.state)
                    this.setState(state);
                if (text != this.props.text)
                    this.props.onChangeText(text);
            }, style: this.props.style },
            React.createElement("div", { style: EditorConstants.editor.style },
                React.createElement(Cursor, { coordinate: this.state.cursorCoordinate, onTextCompositionStart: () => {
                        const [text, state] = handleOnCompositionStart(this.props.text, this.state);
                        if (state != this.state)
                            this.setState(state);
                        if (text != this.props.text)
                            this.props.onChangeText(text);
                    }, onTextCompositionEnd: (dataText) => {
                        const [text, state] = handleOnCompositionEnd(this.props.text, this.state, dataText);
                        if (state != this.state)
                            this.setState(state);
                        if (text != this.props.text)
                            this.props.onChangeText(text);
                    } }),
                React.createElement(Selection, { selection: this.state.textSelection }),
                React.createElement(TextLines, { text: this.props.text, textStyle: this.props.textStyle, cursorCoordinate: this.state.cursorCoordinate }))));
    }
}
Editor.defaultProps = {
    textStyle: {
        fontSizes: { level1: 16, level2: 20, level3: 24 },
    },
};
