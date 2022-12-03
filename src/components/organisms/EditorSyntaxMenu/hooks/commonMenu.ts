import { useEditorStateContext } from '../../../../contexts/EditorStateContext';
import { useTextContext } from '../../../../contexts/TextContext';

import { CommonMenuProps } from './types';

export function useCommonMenu(syntax?: 'bracket' | 'markdown'): CommonMenuProps {
  const [text, setText] = useTextContext();
  const [state, setState] = useEditorStateContext();
  return { syntax, text, state, setState, setText };
}
