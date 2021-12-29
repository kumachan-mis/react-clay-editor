import * as React from 'react';

export const useClickAway = (onClickAway: () => void, ref: React.MutableRefObject<HTMLElement | null>) => {
  const handleOnClickAway = React.useCallback(
    (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onClickAway();
    },
    [onClickAway, ref]
  );
  React.useEffect(() => {
    document.addEventListener('click', handleOnClickAway);
    return () => {
      document.removeEventListener('click', handleOnClickAway);
    };
  }, [handleOnClickAway]);
};
