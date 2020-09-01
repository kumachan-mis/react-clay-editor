/// <reference types="react" />
export declare const TextLinesConstants: {
    className: string;
    line: {
        className: (lineIndex: number) => string;
        classNameRegex: RegExp;
        indent: {
            dot: {
                style: import("react").CSSProperties;
            };
            pad: {
                style: import("react").CSSProperties;
            };
            style: (indentDepth: number) => React.CSSProperties;
        };
        content: {
            section: {
                style: (fontSize?: number | undefined, bold?: boolean | undefined, italic?: boolean | undefined, underline?: boolean | undefined) => React.CSSProperties;
            };
            style: (indentDepth: number) => React.CSSProperties;
        };
        style: (defaultFontSize: number) => React.CSSProperties;
    };
    char: {
        className: (lineIndex: number, charIndex: number) => string;
        classNameRegex: RegExp;
    };
    syntaxRegex: {
        indent: RegExp;
        bracket: RegExp;
    };
    style: import("react").CSSProperties;
};
