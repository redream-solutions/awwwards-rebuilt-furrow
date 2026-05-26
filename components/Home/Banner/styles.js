import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BannerSection = styled.section`
  position: relative;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  margin-bottom: 305px;
  background: ${({ theme }) => theme.background};
  isolation: isolate;
  overflow: visible;

  & canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
  }

  &[data-input='mouse'] canvas {
    touch-action: none;
  }

  &[data-input='handle'] {
    touch-action: pan-y;
  }

  &[data-input='handle'] canvas {
    pointer-events: none !important;
    touch-action: pan-y;
  }

  ${({ theme }) => theme.breakpoints.tablet`
    margin-bottom: 90px;
  `};
`;

/** Mobile browsers often eat touches on <canvas>; this layer passes swipes to the page. */
export const EraserScrollLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
`;

export const EraserCanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  touch-action: pan-y;

  & canvas {
    pointer-events: none !important;
    touch-action: pan-y;
  }
`;

export const VideoContainer = styled.div`
  position: relative;
  z-index: 0;
  height: 100%;
  width: 100%;
  min-height: 100%;

  & video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

export const BannerTitle = styled(motion.h1)`
  position: absolute;
  bottom: -93px;
  left: -20px;
  z-index: 2;
  font-size: 420px;
  font-size: 26.25rem;
  pointer-events: none;
  line-height: 0.6714285714;
  overflow: visible;

  & span {
    display: block;
    will-change: transform;
    overflow: visible;
  }

  ${({ theme }) => theme.breakpoints.small`
    left: 0;
    bottom: max(1rem, env(safe-area-inset-bottom, 0px));
    max-width: 100%;
    padding: 0 max(12px, env(safe-area-inset-right, 0px)) 0
      max(12px, env(safe-area-inset-left, 0px));
    box-sizing: border-box;
    font-size: clamp(4rem, 14vw, 17.5rem);
    line-height: 0.85;
    overflow: visible;
  `};

  ${({ theme }) => theme.breakpoints.tablet`
    bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
    font-size: clamp(4rem, 22vw, 10rem);
    line-height: 0.85;
    overflow: visible;
  `};

  ${({ theme }) => theme.breakpoints.mobile`
    bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
    font-size: clamp(2.75rem, 14vw, 4.5rem);
    line-height: 0.85;
    overflow: visible;
    padding-top: 0.2em;
  `};
`;
