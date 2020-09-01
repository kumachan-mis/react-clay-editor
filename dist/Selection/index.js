import * as React from "react";
import { SelectionConstants } from "./constants";
import { selectionPropsToState } from "./utils";
export class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topDivPosition: undefined,
            centerDivPosition: undefined,
            bottomDivPosition: undefined,
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps == this.props)
            return;
        const state = selectionPropsToState(this.props);
        this.setState(state);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.state.topDivPosition && (React.createElement("div", { style: SelectionConstants.div.style(this.state.topDivPosition) })),
            this.state.centerDivPosition && (React.createElement("div", { style: SelectionConstants.div.style(this.state.centerDivPosition) })),
            this.state.bottomDivPosition && (React.createElement("div", { style: SelectionConstants.div.style(this.state.bottomDivPosition) }))));
    }
}
