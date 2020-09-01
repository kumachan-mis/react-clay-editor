import * as React from "react";
import { Props, State } from "./types";
export declare class Selection extends React.Component<Props, State> {
    private root;
    constructor(props: Props);
    componentDidUpdate(prevProps: Readonly<Props>): void;
    render(): JSX.Element;
}
