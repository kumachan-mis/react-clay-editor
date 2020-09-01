/// <reference types="react" />
import { CursorCoordinate } from "../Cursor/types";
import { Selection } from "../Selection/types";
import { TextStyle } from "../TextLines/types";
export interface Props {
    text: string;
    onChangeText: (text: string) => void;
    textStyle?: TextStyle;
    disabled?: boolean;
    style?: React.CSSProperties;
}
export interface State {
    cursorCoordinate: CursorCoordinate | undefined;
    isComposing: boolean;
    textSelection: Selection | undefined;
    moveCount: number;
}
