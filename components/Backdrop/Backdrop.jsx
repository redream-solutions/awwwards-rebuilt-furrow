import React from 'react';
import BackgroundOverlay from './styles';

const transition = {
  duration: 0.9,
  ease: [0.4, 0, 0.2, 1],
};

const variants = {
  initial: {
    x: '-100%',
  },
  animate: {
    x: 0,
  },
};

const Backdrop = props => {
  React.useEffect(() => {
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
  }, []);

  return (
    <BackgroundOverlay
      variants={variants}
      transition={transition}
      initial="initial"
      animate="animate"
      exit="initial"
      {...props}
    />
  );
};

export default Backdrop;
