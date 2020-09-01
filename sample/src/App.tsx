import * as React from "react";

import { Editor } from "../../src";

const defaultText = [
  "[*** Realtime Markup Editor]",
  "[** What's this?]",
  "A text document editor which is syntactically formattable in place",
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
  "and so on...",
  "",
].join("\n");

export const App: React.FC = () => {
  const [text, setText] = React.useState(defaultText);
  return <Editor text={text} onChangeText={setText} style={{ width: "800px", height: "500px" }} />;
};
