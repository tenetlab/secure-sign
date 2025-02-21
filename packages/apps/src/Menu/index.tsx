// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';

import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { web3Enable } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { Button } from '@polkadot/react-components';

import ChainInfo from './ChainInfo.js';
import LogoInfo from './LogoInfo.js';
import ThemeToggle from './themeToggle.js';

interface Props {
  className?: string;
}

const DISCONNECT_KEY = 'walletDisconnected';

function Menu({ className = '' }: Props): React.ReactElement<Props> {
  const apiProps = useApi();
  const [logo, setLogo] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(() => 
    localStorage.getItem(DISCONNECT_KEY) !== 'true'
  );

  const handleConnect = useCallback(() => {
    web3Enable('polkadot-js/apps')
      .then((injected) => {
        if (injected.length > 0) {
          setIsConnected(true);
          localStorage.removeItem(DISCONNECT_KEY);
          // Reload page to reinitialize with wallet
          window.location.reload();
        }
      })
      .catch(console.error);
  }, []);

  const handleDisconnect = useCallback(() => {
    // Clear all accounts from keyring
    keyring.getAccounts().forEach((account) => {
      try {
        keyring.forgetAccount(account.address);
      } catch (e) {
        console.error('Error removing account:', e);
      }
    });

    // Update connection state
    setIsConnected(false);
    localStorage.setItem(DISCONNECT_KEY, 'true');

    // Force a page reload to clear any cached account data
    window.location.reload();
  }, []);

  return (
    <StyledDiv className={`${className}${(!apiProps.isApiReady || !apiProps.isApiConnected) ? ' isLoading' : ''}`}>
      <div className='menuContainer'>
        <div className='menuSection'>
          <LogoInfo logo={logo} />
          <h1 className='menuItems'>SecureSign</h1>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', textAlign: 'left' }}>
          <Button
            onClick={isConnected ? handleDisconnect : handleConnect}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </Button>
          <ThemeToggle
            logo={logo}
            setLogo={setLogo}
          />
          <ChainInfo />
        </div>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  padding: 1rem 1rem 0.5rem 1rem;
  z-index: 220;
  position: relative;
  .smallShow {
    display: none;
  }
  background-color: var(--bg-page);

  & .menuContainer {
    flex-direction: row;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 1.5rem;
    width: 100%;
    border-radius: 1rem;
    background-color: var(--bg-menubar);
  }

  &.isLoading {
    .menuActive {
      background: var(--bg-page);
    }

    &:before {
      filter: grayscale(1);
    }

    .menuItems {
      filter: grayscale(1);
    }
  }

  .menuSection {
    align-items: center;
    display: flex;
    .menuItems {
      list-style: none;
      margin: 0 0 0 0;
      padding: 0;
      font-size: var(--font-size-h0);
      color: var(--color-text-hover);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }
  }

  .menuActive {
    background: var(--bg-tabs);
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    color: var(--color-text);
    padding: 1rem 1.5rem;
    margin: 0 1rem -1px;
    z-index: 1;

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .ui--NodeInfo {
    align-self: center;
  }

  @media only screen and (max-width: 800px) {

    .smallShow {
      display: initial;
    }

    .smallHide {
      display: none;
    }
  }
`;

export default React.memo(Menu);
