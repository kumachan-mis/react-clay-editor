import * as React from "react";
import { Props, State } from "./types";
export declare class Cursor extends React.Component<Props, State> {
    private root;
    private textArea;
    private handleOnEditorScroll?;
    constructor(props: Props);
    componentDidUpdate(prevProps: Readonly<Props>): void;
    render(): JSX.Element;
}
