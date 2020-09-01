import * as React from "react";

import { Editor } from "../../src";

export const App: React.FC = () => {
  const [text, setText] = React.useState("sample text");
  return <Editor text={text} onChangeText={setText} style={{ width: "800px", height: "500px" }} />;
};
