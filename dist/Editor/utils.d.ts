import { State } from "./types";
export declare function handleOnKeyDown(text: string, state: State, key: string): [string, State];
export declare function handleOnMouseDown(text: string, state: State, position: [number, number]): [string, State];
export declare function handleOnMouseMove(text: string, state: State, position: [number, number]): [string, State];
export declare function handleOnMouseUp(text: string, state: State, position: [number, number]): [string, State];
export declare const handleOnMouseLeave: typeof handleOnMouseUp;
export declare function handleOnCompositionStart(text: string, state: State): [string, State];
export declare function handleOnCompositionEnd(text: string, state: State, dataText: string): [string, State];
