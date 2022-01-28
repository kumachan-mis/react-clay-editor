import React from 'react';

import { getRoot } from '../Editor/utils';
import { isMacOS } from '../common/utils';
import { Node } from '../parser/types';

import { ComponentConstants } from './components/constants';

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (!rootElement) rootElement = element;
  return rootElement.querySelector(`span[data-selectid="${ComponentConstants.char.selectId(lineIndex, charIndex)}"]`);
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

export function cursorOnNode(cursorLineIndex: number | undefined, node: Node): boolean {
  if (cursorLineIndex === undefined) return false;
  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return first <= cursorLineIndex && cursorLineIndex <= last;
  }
  return cursorLineIndex === node.lineIndex;
}
