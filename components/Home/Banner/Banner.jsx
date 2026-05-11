import React from 'react';
import { motion } from 'framer-motion';
import useCursorStyle from '../../../hooks/useCursorStyle';
import useMediaQuery from '../../../hooks/useMediaQuery';
import useWindowSize from '../../../hooks/useWindowSize';
import useStyledTheme from '../../../hooks/useStyledTheme';
import CanvasEraser from '../../CanvasEraser';
import { BannerSection, BannerTitle, VideoContainer } from './styles';

const titleAnimation = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemTitleAnimation = {
  initial: { y: '100vh' },
  animate: {
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const Banner = () => {
  const canvasRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const windowSize = useWindowSize();
  const [viewportSize, setViewportSize] = React.useState({
    width: undefined,
    height: undefined,
  });
  const theme = useStyledTheme();
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();
  const autoClearOverlay = useMediaQuery(
    ({ breakpoints }) => `(max-width: ${breakpoints.sizes.tablet}px)`,
  );

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
      ? { height: bannerHeight, minHeight: bannerHeight }
      : { height: '100vh', minHeight: '100vh' };

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
    <BannerSection style={sectionStyle}>
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
      <CanvasEraser
        ref={canvasRef}
        width={bannerWidth}
        height={bannerHeight}
        size={120}
        background={theme.background}
        autoClear={autoClearOverlay}
        onMouseEnter={addCursorBorder}
        onMouseLeave={removeCursorBorder}
      />
      <BannerTitle
        variants={titleAnimation}
        initial="initial"
        animate="animate"
      >
        <motion.span variants={itemTitleAnimation}>CUT</motion.span>
        <motion.span variants={itemTitleAnimation}>SHARP</motion.span>
      </BannerTitle>
    </BannerSection>
  );
};

export default React.memo(Banner);
