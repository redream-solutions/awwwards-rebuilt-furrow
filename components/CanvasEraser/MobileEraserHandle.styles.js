import styled from 'styled-components';

export const HandleRoot = styled.div`
  position: absolute;
  z-index: 3;
  width: 60px;
  height: 60px;
  touch-action: none;
  cursor: grab;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, opacity 0.15s ease;

  &[data-active='true'] {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.06);
    opacity: 0.95;
  }
`;

export const HandleCircle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
`;

export const HandleCorner = styled.span`
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: ${({ theme }) =>
    theme.colors?.red ?? theme.cursor ?? '#EA281E'};
  border-style: solid;
  border-width: 0;
  box-shadow: 0 0 8px 1px
    ${({ theme }) => theme.colors?.red ?? theme.cursor ?? '#EA281E'};

  &[data-corner='tl'] {
    top: 6px;
    left: 6px;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  &[data-corner='tr'] {
    top: 6px;
    right: 6px;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  &[data-corner='bl'] {
    bottom: 6px;
    left: 6px;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  &[data-corner='br'] {
    bottom: 6px;
    right: 6px;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }
`;
