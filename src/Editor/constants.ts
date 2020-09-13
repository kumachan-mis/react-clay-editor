import { SuggestionType } from "../Cursor/types";

export const EditorConstants = {
  root: {
    className: "React-Realtime-Markup-Editor-root",
  },
  editor: {
    className: "React-Realtime-Markup-Editor-editor",
  },
  historyMaxLength: 50,
  defaultSuggestionState: {
    suggestionType: SuggestionType.None,
    suggestions: [],
    suggectionIndex: -1,
  },
};
