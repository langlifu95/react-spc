// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { zIndex } from 'src/components/globals';
import { MEDIA_BREAK, MAX_WIDTH, TITLEBAR_HEIGHT } from 'src/components/layout';

export const Container = styled.div`
  grid-area: main;
  display: flex;
  justify-content: center;
  z-index: ${zIndex.slider + 1};
  position: sticky;

  @media (max-width: ${MEDIA_BREAK}px) {
    max-height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.24);
  z-index: ${zIndex.slider + 2};
`;

export const ThreadContainerBackground = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  position: fixed;
  max-width: ${MAX_WIDTH + 32}px;
  background: ${theme.bg.wash};
  z-index: ${zIndex.slider + 3};
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.08), 4px 0 12px rgba(0, 0, 0, 0.08);

  @media (max-width: ${MEDIA_BREAK}px) {
    max-width: 100%;
    padding: 0;
    box-shadow: none;
  }
`;

export const ThreadContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: ${MAX_WIDTH + 32}px;
  z-index: ${zIndex.slider + 4};
  padding: 0 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    max-width: 100%;
    transform: translateX(0);
    padding: 0;
    box-shadow: 0;
  }
`;

export const CloseButton = styled.span`
  position: fixed;
  top: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.bg.reverse};
  color: ${theme.text.reverse};
  z-index: ${zIndex.slider + 4};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;
