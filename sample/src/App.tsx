import * as React from "react";

import { Editor } from "../../src";

const defaultText = [
  "[*** React Realtime Markup Editor]",
  "A text document editor which is syntactically formattable in real time",
  "",
  "[** Itemizations]",
  " You can use itemizations",
  " by just typing a space",
  " like this",
  "  You can also use nested itemizations",
  "  by just typing multiple spaces",
  "  like this",
  "",
  "[** Shortcut commands]",
  " select all (ctrl + a)",
  " cut (ctrl + x)",
  " copy (ctrl + c)",
  " paste (ctrl + v)",
  " undo (ctrl + z)",
  " redo (ctrl + shift + z / ctrl + y)",
  " toggle view/edit mode (ctrl + /)",
  "",
  "[** Text decorations]",
  " [* bold]",
  " [/ italic]",
  " [_ underline]",
  "",
  "You can combine these text decorations",
  " [*/ bold italic]",
  " [*_ bold underline]",
  "and so on",
  "",
  "[** Links]",
  " bracket-link",
  "  [react-realtime-markup-editor]",
  " hash-tag-link",
  "  #react-realtime-markup-editor",
  " tagged-link",
  "  [github: @kumachan-mis/react-realtime-markup-editor]",
  "  [npm: react-realtime-markup-editor]",
  "",
].join("\n");

const defaultSubText = [
  "[** Of course, you can use multiple editors]",
  "[* Links can be disabled]",
  " [disabled-bracket-link]",
  " #disabled-hash-tag-link",
  "",
  "[* Default mode can be consomized]",
  " default mode of the editor above is 'edit'",
  " default mode of this editor is 'view'",
  " mode can be toggled by ctrl + /",
  "",
  "More features are comming soon...",
].join("\n");

const style: React.CSSProperties = { width: "800px", height: "500px", margin: "20px" };
const subStyle: React.CSSProperties = { width: "800px", height: "150px", margin: "20px" };

export const App: React.FC = () => {
  const [text, setText] = React.useState(defaultText);
  const [subText, setSubText] = React.useState(defaultSubText);
  return (
    <>
      <Editor
        text={text}
        onChangeText={setText}
        bracketLinkProps={{
          anchorProps: (linkName) => ({ href: `https://www.npmjs.com/package/${linkName}` }),
        }}
        hashTagProps={{
          anchorProps: (hashTagName) => ({ href: `https://www.npmjs.com/package/${hashTagName}` }),
          suggestions: ["react-realtime-markup-editor"],
        }}
        taggedLinkPropsMap={{
          github: {
            linkNameRegex: /@[^[\]]+\/[^[\]]+/,
            anchorProps: (linkName) => ({
              href: `https://github.com/${linkName.substring(1)}`,
              style: { color: "#121B31", textDecoration: "underline" },
            }),
            suggestions: ["@kumachan-mis/react-realtime-markup-editor"],
          },
          npm: {
            anchorProps: (linkName) => ({
              href: `https://www.npmjs.com/package/${linkName}`,
              style: { color: "#F75E8A", textDecoration: "underline" },
            }),
            suggestions: ["react-realtime-markup-editor"],
          },
        }}
        style={style}
      />
      <Editor
        text={subText}
        onChangeText={setSubText}
        bracketLinkProps={{ disabled: true }}
        hashTagProps={{ disabled: true }}
        initialModeCursorOn="view"
        style={subStyle}
      />
    </>
  );
};
