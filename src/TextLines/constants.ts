import { DecorationStyle } from "./types";

export const TextLinesConstants = {
  className: `React-Realtime-Markup-Editor-textlinesdiv`,
  line: {
    className: (lineIndex: number): string => `React-Realtime-Markup-Editor-linediv-L${lineIndex}`,
    classNameRegex: /^React-Realtime-Markup-Editor-linediv-L(?<lineIndex>\d+)$/,
    indent: {
      dot: {
        style: {
          top: "0.5em",
          right: "0.75em",
          position: "absolute",
          display: "block",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: "#000000",
        } as React.CSSProperties,
      },
      pad: {
        style: {
          display: "inline-block",
          width: "1.5em",
          overflow: "hidden",
        } as React.CSSProperties,
      },
      style: (indentDepth: number): React.CSSProperties => ({
        width: `${1.5 * indentDepth}em`,
        left: "0px",
        top: "0px",
        position: "absolute",
      }),
    },
    content: {
      decoration: {
        style: (decorationStyle: DecorationStyle): React.CSSProperties => ({
          fontSize: `${decorationStyle.fontSize}px`,
          fontWeight: decorationStyle.bold ? "bold" : "normal",
          fontStyle: decorationStyle.italic ? "italic" : "normal",
          textDecoration: decorationStyle.underline ? "underline" : "none",
        }),
      },
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
        display: "block",
      }),
    },
    style: (defaultFontSize: number): React.CSSProperties => ({
      fontSize: `${defaultFontSize}px`,
      minHeight: `${defaultFontSize}px`,
      display: "block",
      position: "relative",
    }),
  },
  char: {
    className: (lineIndex: number, charIndex: number): string =>
      `React-Realtime-Markup-Editor-charspan-L${lineIndex}C${charIndex}`,
    classNameRegex: /^React-Realtime-Markup-Editor-charspan-L(?<lineIndex>\d+)C(?<charIndex>\d+)$/,
  },
  regexes: {
    indent: /^(?<indent>[ ]*)(?<content>([^ ].*)?)$/,
    decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
    link: /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/,
    hashTag: /^(?<left>(.*?\s+)())(?<hashTag>#\S+)(?<right>.*)$/,
    normal: /^(?<text>.+)$/,
  },
  style: {
    width: "100%",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    position: "absolute",
  } as React.CSSProperties,
};
