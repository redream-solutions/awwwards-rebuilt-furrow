import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BannerSection = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  margin-bottom: 305px;
  background: ${({ theme }) => theme.background};
  isolation: isolate;

  & canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
    touch-action: none;
  }

  ${({ theme }) => theme.breakpoints.tablet`
    margin-bottom: 90px;
  `};
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

  & span {
    display: block;
    will-change: transform;
  }

  ${({ theme }) => theme.breakpoints.small`
    left: 0;
    bottom: max(1rem, env(safe-area-inset-bottom, 0px));
    max-width: 100%;
    padding: 0 max(12px, env(safe-area-inset-right, 0px)) 0
      max(12px, env(safe-area-inset-left, 0px));
    box-sizing: border-box;
    font-size: clamp(4rem, 14vw, 17.5rem);
    line-height: 0.6821428571;
    overflow: hidden;
  `};

  ${({ theme }) => theme.breakpoints.tablet`
    bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
    font-size: clamp(4rem, 22vw, 10rem);
    line-height: 0.68125;
  `};

  ${({ theme }) => theme.breakpoints.mobile`
    bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
    font-size: clamp(2.75rem, 14vw, 4.5rem);
    line-height: 0.72;
  `};
`;
