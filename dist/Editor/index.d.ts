import * as React from "react";
import { Props, State } from "./types";
export declare class Editor extends React.Component<Props, State> {
    static readonly defaultProps: Required<Pick<Props, "textStyle">>;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private handleOnKeyDown;
    private handleOnEditorBlur;
}
