// Copyright 2017-2024 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
// import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useEffect, useState, useRef } from 'react';

// import { Button, ChainLock, Columar, Forget, LinkExternal, Menu, Popup, Tags, TransferModal } from '@polkadot/react-components';
import { useApi, useBalancesAll, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { isFunction } from '@polkadot/util';

// import { useTranslation } from '../translate.js';

import SidebarEditableSection from '@polkadot/react-components/AccountSidebar_book/SidebarEditableSection';
import { useAccountInfo } from '@polkadot/react-hooks';

interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

// const isEditable = true;

// const BAL_OPTS_DEFAULT = {
//   available: false,
//   bonded: false,
//   locked: false,
//   redeemable: false,
//   reserved: false,
//   total: true,
//   unlocking: false,
//   vested: false
// };

// const BAL_OPTS_EXPANDED = {
//   available: true,
//   bonded: true,
//   locked: true,
//   nonce: true,
//   redeemable: true,
//   reserved: true,
//   total: false,
//   unlocking: true,
//   vested: true
// };

function Address ({ address, className = '', filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  
  const { accountIndex, flags, identity, meta } = useAccountInfo(address);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // const { t } = useTranslation();
  const api = useApi();
  const info = useDeriveAccountInfo(address);
  // const balancesAll = useBalancesAll(address);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  // const [isForgetOpen, setIsForgetOpen] = useState(false);
  // const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // const [isExpanded, toggleIsExpanded] = useToggle(false);

  const _setTags = useCallback(
    (tags: string[]): void => setTags(tags.sort()),
    []
  );

  useEffect((): void => {
    const current = keyring.getAddress(address);

    setCurrent(current || null);
    setGenesisHash((current?.meta.genesisHash) || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    const { identity, nickname } = info || {};

    if (isFunction(api.apiIdentity.query.identity?.identityOf)) {
      if (identity?.display) {
        setAccName(identity.display);
      }
    } else if (nickname) {
      setAccName(nickname);
    }
  }, [api, info]);

  useEffect((): void => {
    const account = keyring.getAddress(address);

    _setTags(account?.meta?.tags || []);
    setAccName(account?.meta?.name || '');
  }, [_setTags, address]);

  useEffect((): void => {
    if (filter.length === 0) {
      setIsVisible(true);
    } else {
      const _filter = filter.toLowerCase();

      setIsVisible(
        tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(_filter);
        }, accName.toLowerCase().includes(_filter))
      );
    }
  }, [accName, filter, tags]);

  // const _onGenesisChange = useCallback(
  //   (genesisHash: HexString | null): void => {
  //     setGenesisHash(genesisHash);

  //     const account = keyring.getAddress(address);

  //     account && keyring.saveAddress(address, { ...account.meta, genesisHash });

  //     setGenesisHash(genesisHash);
  //   },
  //   [address]
  // );

  // const _toggleForget = useCallback(
  //   (): void => setIsForgetOpen(!isForgetOpen),
  //   [isForgetOpen]
  // );

  // const _toggleTransfer = useCallback(
  //   (): void => setIsTransferOpen(!isTransferOpen),
  //   [isTransferOpen]
  // );

  // const _onForget = useCallback(
  //   (): void => {
  //     if (address) {
  //       const status: Partial<ActionStatus> = {
  //         account: address,
  //         action: 'forget'
  //       };

  //       try {
  //         keyring.forgetAddress(address);
  //         status.status = 'success';
  //         status.message = t('address forgotten');
  //       } catch (error) {
  //         status.status = 'error';
  //         status.message = (error as Error).message;
  //       }
  //     }
  //   },
  //   [address, t]
  // );

  if (!isVisible) {
    return null;
  }

  // const PopupDropdown = (
  //   <Menu>
  //     <Menu.Item
  //       isDisabled={!isEditable}
  //       label={t('Forget this address')}
  //       onClick={_toggleForget}
  //     />
  //     {isEditable && !api.isDevelopment && (
  //       <>
  //         <Menu.Divider />
  //         <ChainLock
  //           className='addresses--network-toggle'
  //           genesisHash={genesisHash}
  //           onChange={_onGenesisChange}
  //         />
  //       </>
  //     )}
  //   </Menu>
  // );

  return (
    <>
      <SidebarEditableSection
        accountIndex={accountIndex}
        address={address}
        isBeingEdited={() => {}}
        onUpdateName={() => {}}
        sidebarRef={sidebarRef}
      />
    </>
  );
}

export default React.memo(Address);
