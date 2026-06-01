import React from 'react';
import {
  HandleCircle,
  HandleCorner,
  HandleRoot,
} from './MobileEraserHandle.styles';

const HANDLE_SIZE = 60;
const DEFAULT_RIGHT_INSET = 24;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getCanvasBounds = canvas => {
  if (!canvas) return null;
  return canvas.getBoundingClientRect();
};

const getSectionRect = canvas => {
  const section = canvas?.closest('section');
  if (!section) return null;
  return section.getBoundingClientRect();
};

const clientToSection = (clientX, clientY, sectionRect) => ({
  x: clientX - sectionRect.left,
  y: clientY - sectionRect.top,
});

const sectionToClient = (x, y, sectionRect) => ({
  x: x + sectionRect.left,
  y: y + sectionRect.top,
});

const MobileEraserHandle = ({ eraserRef }) => {
  const handleRef = React.useRef(null);
  const dragRef = React.useRef({
    active: false,
    pointerId: null,
    beginStroke: true,
  });
  const [position, setPosition] = React.useState(null);
  const [isActive, setIsActive] = React.useState(false);

  const getDefaultPosition = React.useCallback(() => {
    const canvas = eraserRef.current?.getCanvas?.();
    const bounds = getCanvasBounds(canvas);
    const sectionRect = getSectionRect(canvas);
    if (!bounds || !sectionRect) return null;

    return clientToSection(
      bounds.right - DEFAULT_RIGHT_INSET - HANDLE_SIZE / 2,
      bounds.top + bounds.height / 2,
      sectionRect,
    );
  }, [eraserRef]);

  const constrainPosition = React.useCallback(
    (clientX, clientY) => {
      const canvas = eraserRef.current?.getCanvas?.();
      const bounds = getCanvasBounds(canvas);
      const sectionRect = getSectionRect(canvas);
      if (!bounds || !sectionRect) {
        return { x: clientX, y: clientY };
      }

      const half = HANDLE_SIZE / 2;
      const local = clientToSection(clientX, clientY, sectionRect);
      return {
        x: clamp(
          local.x,
          bounds.left - sectionRect.left + half,
          bounds.right - sectionRect.left - half,
        ),
        y: clamp(
          local.y,
          bounds.top - sectionRect.top + half,
          bounds.bottom - sectionRect.top - half,
        ),
      };
    },
    [eraserRef],
  );

  const constrainLocalPosition = React.useCallback(
    local => {
      const canvas = eraserRef.current?.getCanvas?.();
      const bounds = getCanvasBounds(canvas);
      const sectionRect = getSectionRect(canvas);
      if (!bounds || !sectionRect || !local) return local;

      const half = HANDLE_SIZE / 2;
      return {
        x: clamp(
          local.x,
          bounds.left - sectionRect.left + half,
          bounds.right - sectionRect.left - half,
        ),
        y: clamp(
          local.y,
          bounds.top - sectionRect.top + half,
          bounds.bottom - sectionRect.top - half,
        ),
      };
    },
    [eraserRef],
  );

  React.useEffect(() => {
    if (position != null) return undefined;

    const initial = getDefaultPosition();
    if (initial) setPosition(initial);

    return undefined;
  }, [getDefaultPosition, position]);

  React.useEffect(() => {
    const onResize = () => {
      if (dragRef.current.active) return;
      setPosition(prev => {
        if (!prev) return getDefaultPosition();
        return constrainLocalPosition(prev);
      });
    };

    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, [constrainLocalPosition, getDefaultPosition]);

  const strokeAtHandleCenter = React.useCallback(
    (localX, localY, begin) => {
      const canvas = eraserRef.current?.getCanvas?.();
      const sectionRect = getSectionRect(canvas);
      if (!sectionRect) return;

      const { x, y } = sectionToClient(localX, localY, sectionRect);
      eraserRef.current?.stroke?.(x, y, { begin });
    },
    [eraserRef],
  );

  const endDrag = React.useCallback(() => {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    dragRef.current.beginStroke = true;
    setIsActive(false);
  }, []);

  React.useEffect(() => {
    const onPointerMove = event => {
      if (
        !dragRef.current.active ||
        event.pointerId !== dragRef.current.pointerId
      ) {
        return;
      }

      event.preventDefault();
      const next = constrainPosition(event.clientX, event.clientY);
      setPosition(next);
      strokeAtHandleCenter(next.x, next.y, dragRef.current.beginStroke);
      dragRef.current.beginStroke = false;
    };

    const onPointerUp = event => {
      if (event.pointerId !== dragRef.current.pointerId) return;
      endDrag();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [constrainPosition, endDrag, strokeAtHandleCenter]);

  const onLostPointerCapture = React.useCallback(
    event => {
      if (event.pointerId !== dragRef.current.pointerId) return;
      endDrag();
    },
    [endDrag],
  );

  const onPointerDown = event => {
    if (dragRef.current.active) return;

    event.preventDefault();
    event.stopPropagation();
    handleRef.current?.setPointerCapture?.(event.pointerId);

    dragRef.current.active = true;
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.beginStroke = true;
    setIsActive(true);

    const next = constrainPosition(event.clientX, event.clientY);
    setPosition(next);
    strokeAtHandleCenter(next.x, next.y, true);
    dragRef.current.beginStroke = false;
  };

  if (!position) return null;

  return (
    <HandleRoot
      ref={handleRef}
      data-active={isActive}
      style={{ left: position.x, top: position.y }}
      onPointerDown={onPointerDown}
      onLostPointerCapture={onLostPointerCapture}
      role="slider"
      aria-label="Eraser"
    >
      <HandleCircle>
        <HandleCorner data-corner="tl" />
        <HandleCorner data-corner="tr" />
        <HandleCorner data-corner="bl" />
        <HandleCorner data-corner="br" />
      </HandleCircle>
    </HandleRoot>
  );
};

export default React.memo(MobileEraserHandle);
