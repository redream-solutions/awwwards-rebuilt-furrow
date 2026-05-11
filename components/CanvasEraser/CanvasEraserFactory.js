const DEFAULT_OPTIONS = {
  background: '#000',
  completeRatio: 1,
  enabled: true,
  onComplete: null,
  onProgress: null,
  size: 40,
};

const getElementComputedStyled = (element, prop) =>
  parseFloat(getComputedStyle(element, null)[prop].replace('px', ''));

const factory = () => {
  let _canvas = null;
  let _context = null;
  let _data = {};

  const _clientToCanvas = (clientX, clientY) => {
    if (!_canvas) return { x: 0, y: 0 };
    const rect = _canvas.getBoundingClientRect();
    const rw = rect.width || 1;
    const rh = rect.height || 1;
    return {
      x: ((clientX - rect.left) / rw) * _canvas.width,
      y: ((clientY - rect.top) / rh) * _canvas.height,
    };
  };

  const _handleEraserProgress = (currentX, currentY) => {
    const {
      colParts,
      numParts,
      completeRatio,
      enabled,
      size,
      onComplete,
      onProgress,
    } = _data;

    if (!enabled) return;

    let p =
      Math.floor(currentX / size) + Math.floor(currentY / size) * colParts;

    if (p >= 0 && p < numParts) {
      _data.ratio += _data.parts[p];
      _data.parts[p] = 0;

      if (!_data.complete) {
        p = _data.ratio / _data.numParts;

        if (p >= completeRatio) {
          _data.complete = true;
          if (onComplete) {
            onComplete();
          }
          return;
        }

        if (onProgress) {
          onProgress(p);
        }
      }
    }
  };

  const _onMouseMove = event => {
    event.preventDefault();

    const { enabled, touchX, touchY } = _data;
    const { x: currentX, y: currentY } = _clientToCanvas(
      event.clientX,
      event.clientY,
    );

    if (enabled) {
      _handleEraserProgress(currentX, currentY);
      _context.beginPath();
      _context.moveTo(touchX, touchY);
      _context.lineTo(currentX, currentY);
      _context.stroke();
    }

    _data.touchX = currentX;
    _data.touchY = currentY;
  };

  const _onMouseDown = event => {
    event.preventDefault();

    const { enabled } = _data;
    const { x: currentX, y: currentY } = _clientToCanvas(
      event.clientX,
      event.clientY,
    );

    _data.touchDown = true;
    _data.touchX = currentX;
    _data.touchY = currentY;

    if (enabled) {
      _handleEraserProgress(currentX, currentY);

      _context.beginPath();
      _context.moveTo(currentX - 1, currentY);
      _context.lineTo(currentX, currentY);
      _context.stroke();
    }

    _canvas.addEventListener('mousemove', _onMouseMove);
  };

  const _onMouseClick = event => {
    event.preventDefault();

    const { enabled } = _data;
    const { x: currentX, y: currentY } = _clientToCanvas(
      event.clientX,
      event.clientY,
    );

    _data.touchDown = true;
    _data.touchX = currentX;
    _data.touchY = currentY;

    if (enabled) {
      _handleEraserProgress(currentX, currentY);

      _context.beginPath();
      _context.moveTo(currentX - 1, currentY);
      _context.lineTo(currentX, currentY);
      _context.stroke();
    }

    _canvas.addEventListener('mousemove', _onMouseMove);
  };

  const _detachTouchStroke = () => {
    document.removeEventListener('touchmove', _onTouchMove);
    document.removeEventListener('touchend', _onTouchEnd);
    document.removeEventListener('touchcancel', _onTouchEnd);
    _data.touchDown = false;
  };

  const _onTouchMove = event => {
    if (!event.touches || event.touches.length === 0) return;
    event.preventDefault();

    const { enabled, touchX, touchY } = _data;
    const touch = event.touches[0];
    const { x: currentX, y: currentY } = _clientToCanvas(
      touch.clientX,
      touch.clientY,
    );

    if (enabled) {
      _handleEraserProgress(currentX, currentY);
      _context.beginPath();
      _context.moveTo(touchX, touchY);
      _context.lineTo(currentX, currentY);
      _context.stroke();
    }

    _data.touchX = currentX;
    _data.touchY = currentY;
  };

  const _onTouchEnd = () => {
    _detachTouchStroke();
  };

  const _onTouchStart = event => {
    if (!event.touches || event.touches.length !== 1) return;
    event.preventDefault();

    const { enabled } = _data;
    const touch = event.touches[0];
    const { x: currentX, y: currentY } = _clientToCanvas(
      touch.clientX,
      touch.clientY,
    );

    _data.touchDown = true;
    _data.touchX = currentX;
    _data.touchY = currentY;

    if (enabled) {
      _handleEraserProgress(currentX, currentY);
      _context.beginPath();
      _context.moveTo(currentX - 1, currentY);
      _context.lineTo(currentX, currentY);
      _context.stroke();
    }

    document.addEventListener('touchmove', _onTouchMove, { passive: false });
    document.addEventListener('touchend', _onTouchEnd);
    document.addEventListener('touchcancel', _onTouchEnd);
  };

  const init = (source, options = {}) => {
    if (!source) {
      throw new Error(
        'No source element provided. It must be an HTML canvas element.',
      );
    }

    const currentOptions = { ...DEFAULT_OPTIONS, ...options };
    const { size, background } = currentOptions;

    if (_canvas === source) {
      _canvas.removeEventListener('mouseenter', _onMouseDown);
      _canvas.removeEventListener('click', _onMouseClick);
      _canvas.removeEventListener('touchstart', _onTouchStart, {
        passive: false,
      });
    }

    _canvas = source;
    _context = _canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      _context.webkitBackingStorePixelRatio ||
      _context.mozBackingStorePixelRatio ||
      _context.msBackingStorePixelRatio ||
      _context.oBackingStorePixelRatio ||
      _context.backingStorePixelRatio ||
      1;
    const scaleRatio = devicePixelRatio / backingStoreRatio;

    const realWidth = getElementComputedStyled(_canvas, 'width');
    const realHeight = getElementComputedStyled(_canvas, 'height');
    const width = realWidth * scaleRatio;
    const height = realHeight * scaleRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      _canvas.width = width;
      _canvas.height = height;
      _canvas.style.width = `${realWidth}px`;
      _canvas.style.height = `${realHeight}px`;
    } else {
      _canvas.width = realWidth;
      _canvas.height = realHeight;
      _canvas.style.width = '';
      _canvas.style.height = '';
    }

    // _context.scale(scaleRatio, scaleRatio);
    _context.fillStyle = background;
    _context.fillRect(0, 0, width, height);
    _context.drawImage(_canvas, 0, 0, width, height);

    // prepare context for drawing operations
    _context.globalCompositeOperation = 'destination-out';
    _context.lineWidth = size;
    _context.lineCap = 'round';

    // bind events
    _canvas.addEventListener('mouseenter', _onMouseDown);
    _canvas.addEventListener('click', _onMouseClick);
    _canvas.addEventListener('touchstart', _onTouchStart, { passive: false });

    // reset parts
    const parts = [];
    const colParts = Math.max(1, Math.floor(width / size));
    const numParts = colParts * Math.max(1, Math.floor(height / size));
    for (let i = 0; i < numParts; i++) {
      parts.push(1);
    }

    _data = {
      posX: _canvas.offsetLeft,
      posY: _canvas.offsetTop,
      touchDown: false,
      touchID: -999,
      touchX: 0,
      touchY: 0,
      ptouchX: 0,
      ptouchY: 0,
      w: width,
      h: height,
      scaleRatio: scaleRatio,
      ratio: 0,
      complete: false,
      parts,
      colParts,
      numParts,
      currentOptions,
      ...currentOptions,
    };
  };

  const clear = () => {
    if (!_context || !_data || typeof _data.numParts !== 'number' || !_data.parts) {
      return;
    }

    const { w, h, numParts, onComplete } = _data;

    _context.clearRect(0, 0, w, h);

    for (let i = 0; i < numParts; i++) {
      _data.parts[i] = 0;
    }

    _data.ratio = numParts;
    _data.complete = true;

    if (onComplete) {
      onComplete();
    }
  };

  const reset = () => {
    const { w, h, numParts } = _data;

    _context.globalCompositeOperation = 'source-over';
    _context.drawImage(_canvas, 0, 0, w, h);
    _context.globalCompositeOperation = 'destination-out';

    for (let i = 0; i < numParts; i++) {
      _data.parts[i] = 1;
    }

    _data.ratio = 0;
    _data.complete = false;
    _data.touchDown = false;
  };

  return {
    init,
    clear,
    reset,
  };
};

export default factory;
