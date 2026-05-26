import React from 'react';

import { motion } from 'framer-motion';

import useCursorStyle from '../../../hooks/useCursorStyle';

import useMediaQuery from '../../../hooks/useMediaQuery';

import useWindowSize from '../../../hooks/useWindowSize';

import useStyledTheme from '../../../hooks/useStyledTheme';

import CanvasEraser from '../../CanvasEraser';

import MobileEraserHandle from '../../CanvasEraser/MobileEraserHandle';

import {
  BannerSection,
  BannerTitle,
  EraserCanvasWrap,
  EraserScrollLayer,
  VideoContainer,
} from './styles';

const titleAnimation = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemTitleAnimationDesktop = {
  initial: { y: '100vh' },
  animate: {
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/** 100vh is taller than the visible viewport on mobile Chrome and clips "CUT". */
const itemTitleAnimationMobile = {
  initial: { y: '105%' },
  animate: {
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/** Mobile / coarse pointer: handle-driven eraser so the canvas does not block scroll. */

/** Width-only: Chrome mobile often reports pointer:fine, which skipped handle mode. */
const MOBILE_ERASER_QUERY = '(max-width: 1023px)';

const Banner = () => {
  const videoRef = React.useRef(null);

  const eraserRef = React.useRef(null);

  const windowSize = useWindowSize();

  const [viewportSize, setViewportSize] = React.useState({
    width: undefined,

    height: undefined,
  });

  const theme = useStyledTheme();

  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  const useMobileEraser = useMediaQuery(() => MOBILE_ERASER_QUERY);

  React.useEffect(() => {
    if (!useMobileEraser || typeof document === 'undefined') return undefined;
    document.body.style.removeProperty('overflow-y');
    return undefined;
  }, [useMobileEraser]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const read = () => {
      const vv = window.visualViewport;

      setViewportSize({
        width: vv?.width ?? window.innerWidth,

        height: vv?.height ?? window.innerHeight,
      });
    };

    read();

    const vv = window.visualViewport;

    vv?.addEventListener('resize', read);

    vv?.addEventListener('scroll', read);

    window.addEventListener('resize', read);

    return () => {
      vv?.removeEventListener('resize', read);

      vv?.removeEventListener('scroll', read);

      window.removeEventListener('resize', read);
    };
  }, []);

  const bannerWidth = viewportSize.width ?? windowSize.width;

  const bannerHeight = viewportSize.height ?? windowSize.height;

  const sectionStyle =
    bannerHeight != null
      ? {
          height: bannerHeight,
          minHeight: useMobileEraser ? '100dvh' : bannerHeight,
        }
      : { height: '100dvh', minHeight: '100dvh' };

  React.useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('loadeddata', tryPlay);

    video.addEventListener('canplay', tryPlay);

    tryPlay();

    return () => {
      video.removeEventListener('loadeddata', tryPlay);

      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <BannerSection
      style={sectionStyle}
      data-input={useMobileEraser ? 'handle' : 'mouse'}
    >
      <VideoContainer>
        <video
          ref={videoRef}
          src="/videos/banner.mp4"
          height="100%"
          width="100%"
          loop
          autoPlay
          muted
          playsInline
          preload="auto"
        />
      </VideoContainer>

      {useMobileEraser ? (
        <>
          <EraserCanvasWrap>
            <CanvasEraser
              ref={eraserRef}
              width={bannerWidth}
              height={bannerHeight}
              size={120}
              background={theme.background}
              nativeTouch={false}
            />
          </EraserCanvasWrap>
          <EraserScrollLayer aria-hidden />
          <MobileEraserHandle eraserRef={eraserRef} />
        </>
      ) : (
        <CanvasEraser
          ref={eraserRef}
          width={bannerWidth}
          height={bannerHeight}
          size={120}
          background={theme.background}
          nativeTouch
          onMouseEnter={addCursorBorder}
          onMouseLeave={removeCursorBorder}
        />
      )}

      <BannerTitle
        variants={titleAnimation}
        initial="initial"
        animate="animate"
      >
        <motion.span
          variants={
            useMobileEraser
              ? itemTitleAnimationMobile
              : itemTitleAnimationDesktop
          }
        >
          CUT
        </motion.span>
        <motion.span
          variants={
            useMobileEraser
              ? itemTitleAnimationMobile
              : itemTitleAnimationDesktop
          }
        >
          SHARP
        </motion.span>
      </BannerTitle>
    </BannerSection>
  );
};

export default React.memo(Banner);
