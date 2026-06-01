import React from 'react';
import canvasEraserFactory from './CanvasEraserFactory';

const CanvasEraser = (props, ref) => {
  const {
    completeRatio = 1,
    enabled = true,
    nativeTouch = true,
    onComplete = null,
    onProgress = null,
    size = 40,
    background = '#000',
    autoClear = false,
    ...other
  } = props;

  const [canvasEraser, setCanvasEraser] = React.useState(null);
  const canvasRef = React.useRef(null);

  const initOptions = React.useMemo(
    () => ({
      background,
      completeRatio,
      enabled,
      nativeTouch,
      onComplete,
      onProgress,
      size,
    }),
    [
      background,
      completeRatio,
      enabled,
      nativeTouch,
      onComplete,
      onProgress,
      size,
    ],
  );

  React.useEffect(() => {
    const canvas = canvasEraserFactory();
    setCanvasEraser(canvas);
  }, []);

  React.useEffect(() => {
    if (!canvasEraser || !canvasRef.current) return;

    canvasEraser.init(canvasRef.current, initOptions);

    if (autoClear) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          canvasEraser.clear();
        });
      });
    }
  }, [canvasEraser, initOptions, autoClear]);

  React.useImperativeHandle(
    ref,
    () => ({
      stroke: (clientX, clientY, strokeOptions) =>
        canvasEraser?.stroke(clientX, clientY, strokeOptions),
      clear: () => canvasEraser?.clear(),
      reset: () => canvasEraser?.reset(),
      getCanvas: () => canvasRef.current,
    }),
    [canvasEraser],
  );

  return <canvas ref={canvasRef} {...other} />;
};

export default React.forwardRef(CanvasEraser);
