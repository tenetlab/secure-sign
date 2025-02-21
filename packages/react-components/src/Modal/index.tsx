// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import { useTheme } from '@polkadot/react-hooks';

import ErrorBoundary from '../ErrorBoundary.js';
import { styled } from '../styled.js';
import Actions from './Actions.js';
import Columns from './Columns.js';
import Content from './Content.js';
import Header from './Header.js';

interface Props {
  size?: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  testId?: string;
}

function ModalBase ({ children, className = '', header, onClose, size = 'medium', testId = 'modal' }: Props): React.ReactElement<Props> {
  const { themeClassName } = useTheme();

  const listenKeyboard = useCallback((event: KeyboardEvent) => {
    // eslint-disable-next-line deprecation/deprecation
    if (event.key === 'Escape' || event.keyCode === 27) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', listenKeyboard, true);

    return () => {
      window.removeEventListener('keydown', listenKeyboard, true);
    };
  }, [listenKeyboard]);

  return createPortal(
    <StyledDiv
      className={`${className} ui--Modal ${size}Size ${themeClassName} `}
      data-testid={testId}
    >
      <DisableGlobalScroll />
      <div
        className='ui--Modal__overlay'
        onClick={onClose}
      />
      <div className='ui--Modal__body'>
        <Header onClose={onClose} />
        <div className='ui--Modal_sub_body'>
          <div className='ui--Header-Flex'>
            {header && (
              <h1>{header}</h1>
            )}
          </div>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </StyledDiv>,
    document.body
  );
}

const DisableGlobalScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  padding: var(--size-layout-gutter);

  .ui--Modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--modal-backdrop-bkg);
  }

  .ui--Modal__body {
    background: var(--bg-modal);
    border-radius: 1rem;
    box-shadow: none;
    padding: var(--size-content-gutter);
    display: flex;
    flex-direction: column;
    position: relative;

    width: 100%;
    max-width: 80rem;
    max-height: 100%;

    color: var(--color-text);

    h1 {
      border-bottom: 3px solid var(--border-input-hover);
      margin-bottom: var(--size-content-gutter);
      padding-bottom: var(--size-layout-gutter);
    }

    .ui--Modal_sub_body {
      margin-top: var(--size-layout-gutter);
      padding: 0 var(--size-content-gutter);
      overflow-y: auto;
      overflow-x: hidden;

      .ui--Header-Flex {
        display: flex;
      }
    }
  }

  &.smallSize .ui--Modal__body {
    max-width: 50rem;
  }

  &.largeSize .ui--Modal__body {
    max-width: 80rem; // Fixme: This is the same as the default
  }
`;

const Modal = React.memo(ModalBase) as unknown as typeof ModalBase & {
  Actions: typeof Actions;
  Columns: typeof Columns;
  Content: typeof Content;
};

Modal.Actions = Actions;
Modal.Columns = Columns;
Modal.Content = Content;

export default Modal;
