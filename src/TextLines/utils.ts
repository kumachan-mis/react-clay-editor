import React from 'react';

import { CursorCoordinate } from '../Cursor/types';
import { getRoot } from '../Editor/utils';
import { TextSelection } from '../Selection/types';
import { selectionToRange } from '../Selection/utils';
import { isMacOS } from '../common/utils';
import { CharConstants } from '../components/atoms/Char';
import { Node } from '../parser/types';

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (!rootElement) rootElement = element;
  return rootElement.querySelector(`span[data-selectid="${CharConstants.selectId(lineIndex, charIndex)}"]`);
}

export function useLinkForceActive(): boolean {
  const [linkForceActive, setLinkForceActive] = React.useState(false);

  const handleOnKeyDown = React.useCallback((event: KeyboardEvent) => {
    setLinkForceActive(
      (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey
    );
  }, []);
  const handleOnKeyUp = React.useCallback(() => setLinkForceActive(false), []);

  React.useEffect(() => {
    document.addEventListener('keydown', handleOnKeyDown);
    document.addEventListener('keyup', handleOnKeyUp);

    return () => {
      document.removeEventListener('keydown', handleOnKeyDown);
      document.removeEventListener('keyup', handleOnKeyUp);
    };
  }, [handleOnKeyDown, handleOnKeyUp]);

  return linkForceActive;
}

export function cursorOnNode(
  node: Node,
  cursorCoordinate: CursorCoordinate | undefined,
  textSelection: TextSelection | undefined
): boolean {
  function cursor(): boolean {
    if (!cursorCoordinate) return false;
    if (node.type === 'blockCode' || node.type === 'blockFormula') {
      const [first, last] = node.range;
      return first <= cursorCoordinate.lineIndex && cursorCoordinate.lineIndex <= last;
    }
    return cursorCoordinate.lineIndex === node.lineIndex;
  }

  function selection(): boolean {
    if (!textSelection) return false;
    const { start, end } = selectionToRange(textSelection);

    if (node.type === 'blockCode' || node.type === 'blockFormula') {
      const [first, last] = node.range;
      return start.lineIndex <= last && first <= end.lineIndex;
    }
    return start.lineIndex <= node.lineIndex && node.lineIndex <= end.lineIndex;
  }

  return cursor() || selection();
}
