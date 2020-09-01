import * as React from "react";

import { Editor } from "../../src";

const defaultText = [
  "[*** Realtime Markup Editor]",
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
].join("\n");

const defaultSubText = "More features is comming soon...";

const style: React.CSSProperties = { width: "800px", height: "500px" };
const sunStyle: React.CSSProperties = { width: "800px", height: "100px" };

export const App: React.FC = () => {
  const [text, setText] = React.useState(defaultText);
  const [subText, setSubText] = React.useState(defaultSubText);
  return (
    <>
      <Editor text={text} onChangeText={setText} style={style} />
      <Editor text={subText} onChangeText={setSubText} style={sunStyle} />
    </>
  );
};
