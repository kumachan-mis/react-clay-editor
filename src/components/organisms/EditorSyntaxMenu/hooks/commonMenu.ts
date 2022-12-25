import { useEditorStateContext } from 'src/contexts/EditorStateContext';
import { useTextContext } from 'src/contexts/TextContext';

import { CommonMenuProps } from './types';

export function useCommonMenu(syntax?: 'bracket' | 'markdown'): CommonMenuProps {
  const [text, setText] = useTextContext();
  const [state, setState] = useEditorStateContext();
  return { syntax, text, state, setState, setText };
}
