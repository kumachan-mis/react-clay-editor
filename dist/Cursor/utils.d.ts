import { Props, State } from "./types";
export declare function cursorPropsToState(props: Props, state: State, element: HTMLElement): State;
export declare function handleOnEditorScroll(props: Props, state: State, element: HTMLElement): State;
export declare function cursorIn(position: [number, number], cursorSize: number, element: HTMLElement): boolean;
