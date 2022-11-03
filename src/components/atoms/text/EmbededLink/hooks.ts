import React from 'react';

import { isMacOS } from '../../../../common/utils';

export function useEmbededLinkForceClickable(): boolean {
  const [linkForceClickable, setLinkForceClickable] = React.useState(false);

  const handleOnKeyDown = React.useCallback((event: KeyboardEvent) => {
    setLinkForceClickable(
      (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey
    );
  }, []);
  const handleOnKeyUp = React.useCallback(() => setLinkForceClickable(false), []);

  React.useEffect(() => {
    document.addEventListener('keydown', handleOnKeyDown);
    document.addEventListener('keyup', handleOnKeyUp);

    return () => {
      document.removeEventListener('keydown', handleOnKeyDown);
      document.removeEventListener('keyup', handleOnKeyUp);
    };
  }, [handleOnKeyDown, handleOnKeyUp]);

  return linkForceClickable;
}
