import * as React from "react";

import { Editor } from "../../src";

const defaultText = [
  "[*** React Realtime Markup Editor]",
  "[** What's this?]",
  "A text document editor which is syntactically formattable in real time",
  "",
  " You can use itemizations",
  " by just typing a space",
  " like this",
  "  You can also use nested itemizations",
  "  by just typing multiple spaces",
  "  like this",
  "",
  "[** Some text decorations are supported]",
  " [* bold]",
  " [/ italic]",
  " [_ underline]",
  "",
  "You can combine these text decorations",
  " [*/ bold italic]",
  " [*_ bold underline]",
  "and so on",
  "",
  "[** Links are supported]",
  " bracket-link: [react-realtime-markup-editor]",
  " hash-tag-link: #react-realtime-markup-editor",
  "",
].join("\n");

const defaultSubText = [
  "[** Of course, you can use multiple editors]",
  "[disabled-bracket-link]",
  "#disabled-hashtag-link",
  "More features are comming soon...",
].join("\n");

const style: React.CSSProperties = { width: "800px", height: "500px", margin: "20px" };
const sunStyle: React.CSSProperties = { width: "800px", height: "100px", margin: "20px" };

export const App: React.FC = () => {
  const [text, setText] = React.useState(defaultText);
  const [subText, setSubText] = React.useState(defaultSubText);
  return (
    <>
      <Editor
        text={text}
        onChangeText={setText}
        bracketLinkProps={(linkName) => ({ href: `https://www.npmjs.com/package/${linkName}` })}
        hashTagProps={(hashTagName) => ({ href: `https://www.npmjs.com/package/${hashTagName}` })}
        style={style}
      />
      <Editor
        text={subText}
        onChangeText={setSubText}
        bracketLinkDisabled
        hashTagDisabled
        style={sunStyle}
      />
    </>
  );
};
