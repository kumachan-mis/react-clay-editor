import { useEditorStateContext } from '../../../../contexts/EditorStateContext';
import { useEditorTextContext } from '../../../../contexts/EditorTextContext';

import { CommonMenuProps } from './types';

export function useCommonMenu(syntax?: 'bracket' | 'markdown'): CommonMenuProps {
  const [text, setText] = useEditorTextContext();
  const [state, setState] = useEditorStateContext();
  return { syntax, text, state, setState, setText };
}
