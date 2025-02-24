// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback, useEffect } from 'react';

import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { web3Enable, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

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
  const [isConnecting, toggleIsConnecting] = useToggle(false);

  // Subscribe to account changes
  useEffect(() => {
    let unsubscribe: null | (() => void) = null;

    if (isConnected && !localStorage.getItem(DISCONNECT_KEY)) {
      web3AccountsSubscribe((accounts) => {
        if (accounts.length > 0) {
          // Update keyring with the latest accounts
          accounts.forEach((account) => {
            if (!keyring.getAccount(account.address)) {
              keyring.addExternal(account.address, {
                ...account.meta,
                name: account.meta.name || `${account.meta.source} ${account.address.slice(0, 8)}`
              });
            }
          });
        }
      }).then((unsub) => {
        unsubscribe = unsub;
      }).catch(console.error);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [isConnected]);

  const handleConnect = useCallback(() => {
    toggleIsConnecting(true);
    
    web3Enable('polkadot-js/apps')
      .then((injected) => {
        if (injected.length > 0) {
          // Get accounts and add them to keyring
          web3AccountsSubscribe((accounts) => {
            if (accounts.length > 0) {
              accounts.forEach((account) => {
                try {
                  keyring.addExternal(account.address, {
                    ...account.meta,
                    name: account.meta.name || `${account.meta.source} ${account.address.slice(0, 8)}`
                  });
                } catch (e) {
                  // Account might already exist
                  console.log('Account may already exist:', e);
                }
              });
              
              setIsConnected(true);
              localStorage.removeItem(DISCONNECT_KEY);
            }
          }).catch(console.error);
        }
        toggleIsConnecting(false);
      })
      .catch((error) => {
        console.error(error);
        toggleIsConnecting(false);
      });
  }, [toggleIsConnecting]);

  const handleDisconnect = useCallback(() => {
    // Clear all external accounts from keyring
    keyring.getAccounts().forEach((account) => {
      if (account.meta.isExternal) {
        try {
          keyring.forgetAccount(account.address);
        } catch (e) {
          console.error('Error removing account:', e);
        }
      }
    });

    // Update connection state
    setIsConnected(false);
    localStorage.setItem(DISCONNECT_KEY, 'true');
  }, []);

  return (
    <StyledDiv className={`${className}${(!apiProps.isApiReady || !apiProps.isApiConnected) ? ' isLoading' : ''}`}>
      <div className='menuContainer'>
        <div className='menuSection'>
          <LogoInfo logo={logo} />
          <h1 className='menuItems'>SecureSign</h1>
        </div>
        <div className='menuControls'>
          <Button
            className='walletButton'
            isDisabled={isConnecting}
            isLoading={isConnecting}
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

  .menuControls {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    text-align: left;
  }

  .walletButton {
    margin-right: 0.5rem;
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
