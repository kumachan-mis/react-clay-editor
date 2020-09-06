import { DecorationStyle } from "./types";

export const defaultLinkNameRegex = /[^[\]]+/;

export const defaultLinkStyle = {
  color: "#5E8AF7",
  textDecoration: "none",
  cursor: "pointer",
} as React.CSSProperties;

export const TextLinesConstants = {
  className: "React-Realtime-Markup-Editor-textlines",
  line: {
    className: (lineIndex: number): string => `React-Realtime-Markup-Editor-line L${lineIndex}`,
    classNameRegex: /^.*React-Realtime-Markup-Editor-line L(?<lineIndex>\d+).*$/,
    indent: {
      className: `React-Realtime-Markup-Editor-textlines-indent`,
      dot: {
        className: `React-Realtime-Markup-Editor-textlines-indent-dot`,
      },
      pad: {
        className: `React-Realtime-Markup-Editor-textlines-indent-pad`,
      },
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    content: {
      className: "React-Realtime-Markup-Editor-textlines-content",
      decoration: {
        style: (decorationStyle: DecorationStyle): React.CSSProperties => ({
          fontSize: `${decorationStyle.fontSize}px`,
          fontWeight: decorationStyle.bold ? "bold" : undefined,
          fontStyle: decorationStyle.italic ? "italic" : undefined,
          textDecoration: decorationStyle.underline ? "underline" : undefined,
        }),
      },
      taggedLink: {
        style: defaultLinkStyle,
      },
      bracketLink: {
        style: defaultLinkStyle,
      },
      hashTag: {
        style: defaultLinkStyle,
      },
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
    style: (defaultFontSize: number): React.CSSProperties => ({
      fontSize: `${defaultFontSize}px`,
      minHeight: `${defaultFontSize}px`,
    }),
  },
  char: {
    className: (lineIndex: number, charIndex: number): string =>
      `React-Realtime-Markup-Editor-char L${lineIndex}C${charIndex}`,
    classNameRegex: /^.*React-Realtime-Markup-Editor-char L(?<lineIndex>\d+)C(?<charIndex>\d+).*$/,
  },
  regexes: {
    indent: /^(?<indent>[ ]*)(?<content>([^ ].*)?)$/,
    decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
    taggedLink: (tagName: string, linkNameRegex = defaultLinkNameRegex): RegExp => {
      const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const linkName = linkNameRegex.source;
      return RegExp(`^(?<left>.*?)\\[(?<tag>${tag}: )(?<linkName>${linkName})\\](?<right>.*)$`);
    },
    bracketLink: /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/,
    hashTag: /^(?<left>.*?)(?<hashTag>#\S+)(?<right>.*)$/,
    normal: /^(?<text>.+)$/,
  },
};
