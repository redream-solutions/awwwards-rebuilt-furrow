import React from 'react';

const useScrollLock = locked => {
  React.useEffect(() => {
    if (!locked || typeof document === 'undefined') return undefined;

    const { body } = document;
    const previous = body.style.overflowY;
    body.style.overflowY = 'hidden';

    return () => {
      if (previous) {
        body.style.overflowY = previous;
      } else {
        body.style.removeProperty('overflow-y');
      }
    };
  }, [locked]);
};

export default useScrollLock;
