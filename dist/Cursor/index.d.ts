import * as React from "react";
import { Props, State } from "./types";
export declare class Cursor extends React.Component<Props, State> {
    private textArea;
    constructor(props: Props);
    componentDidUpdate(prevProps: Readonly<Props>): void;
    render(): JSX.Element;
}
