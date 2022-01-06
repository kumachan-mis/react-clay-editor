export const defaultLinkNameRegex = /[^[\]]+/;

export const parserConstants = {
  bracketSyntax: {
    itemization: /^(?<indent>\s*)(?<bullet>\s)(?<content>(\S.*)?)$/,
    decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
  },
  markdownSyntax: {
    itemization: /^(?<indent>\s*)(?<bullet>[*-] )(?<content>(.*)?)$/,
    heading: /^(?<heading>#+) (?<body>.+)$/,
    bold: /^(?<left>.*?)\*(?<body>[^*\s](.*[^*\s])?)\*(?<right>.*)$/,
    italic: /^(?<left>.*?)_(?<body>[^_\s](.*[^_\s])?)_(?<right>.*)$/,
  },
  common: {
    blockCodeMeta: /^(?<indent>\s*)(?<codeMeta>```)$/,
    blockCodeLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<codeLine>.*)$`),
    blockFormulaMeta: /^(?<indent>\s*)(?<formulaMeta>\$\$)$/,
    blockFormulaLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<formulaLine>.*)$`),
    quotation: /^(?<indent>\s*)(?<meta>> )(?<content>.*)$/,
    inlineCode: /^(?<left>.*?)`(?<code>[^`]+)`(?<right>.*)$/,
    displayFormula: /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/,
    inlineFormula: /^(?<left>.*?)\$(?<formula>[^$]+)\$(?<right>.*)$/,
    taggedLink: (tagName: string, linkNameRegex = defaultLinkNameRegex): RegExp => {
      const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkName = linkNameRegex.source;
      return RegExp(`^(?<left>.*?)\\[(?<tag>${tag}: )(?<linkName>${linkName})\\](?<right>.*)$`);
    },
    bracketLink: /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/,
    hashtag: /^(?<left>.*?)(?<hashtag>#[^\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]+)(?<right>.*)$/,
    normal: /^(?<text>.+)$/,
  },
  wordRegex: /[^\s!"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~]+/,
};
