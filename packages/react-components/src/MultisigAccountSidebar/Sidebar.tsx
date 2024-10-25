// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { useAccountInfo } from '@polkadot/react-hooks';

import { styled } from '../styled.js';
import { colorLink } from '../styles/theme.js';
import Balances from './Balances.js';
// import Identity from './Identity.js';
import MultisigPage from './Multisig.js';
import SidebarEditableSection from './SidebarEditableSection.js';
import { MultisigOutput } from '@polkadot/react-components';
import type { H256, Multisig } from '@polkadot/types/interfaces';

interface Props {
  address: string;
  className?: string;
  dataTestId?: string;
  onClose?: () => void;
  onUpdateName?: (() => void) | null;
  toggleMultisig: () => void;
  ongoing: [H256, Multisig][];
}


interface Option {
  text: string;
  value: string;
}


function MultisigFullSidebar({ address, className = '', onUpdateName, toggleMultisig, ongoing }: Props): React.ReactElement<Props> {
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const { accountIndex, flags, meta } = useAccountInfo(address);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const hashes = useMemo<Option[]>(
    () => ongoing?.map(([h]) => ({ text: h.toHex(), value: h.toHex() })),
    [ongoing]
  );

  return (
    <StyledDiv
      className={`${className}${inEditMode ? ' inEditMode' : ''}`}
    >
      <div
        className='ui--AddressMenu-header'
        data-testid='sidebar-address-menu'
      >
        <SidebarEditableSection
          accountIndex={accountIndex}
          address={address}
          isBeingEdited={setInEditMode}
          onUpdateName={onUpdateName}
          sidebarRef={sidebarRef}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <div className='ui--ScrollSection' style={{ width: '38%' }}>
          <Balances address={address} />
          {/* <Identity
          address={address}
          identity={identity}
        /> */}
          <MultisigPage
            isMultisig={flags.isMultisig}
            meta={meta}
          />
        </div>
        <div className='hash'>
          {hashes?.map((item, key) =>
            <MultisigOutput
              key={key}
              isDisabled
              value={item.value}
              withCopy
              toggleMultisig={toggleMultisig}
            />
          )}

        </div>
      </div>

    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--bg-page);
  // max-width: 30.42rem;
  // min-width: 30.42rem;
  // overflow-y: hidden;
  width: 100%;

  .hash {
    width: 62%;
    margin-top: 1rem;
  }
  padding: 0 0 3.286rem;

  input {
    width: auto !important;
  }

  .ui--AddressMenu-header {
    align-items: center;
    background: var(--bg-page);
    border-bottom: 1px solid var(--border-table);
    display: flex;
    // flex-direction: column;
    justify-content: center;
    padding: 1.35rem 1rem 1rem 1rem;
  }

  .ui--AddressSection {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;

    .ui--AddressSection__AddressColumn {
      flex: 1;
      margin-left: 1rem;

      .ui--AccountName {
        max-width: 21.5rem;
        overflow: hidden;
        white-space: normal;
      }
    }

    .ui--AddressSection__CopyColumn {
      margin-left: 1rem;

      .ui--AccountName {
        max-width: 10rem;
        overflow: hidden;
      }
    }
  }

  .ui--AddressMenu-addr,
  .ui--AddressMenu-index {
    text-align: left;
    font-size: var(--font-size-small);
  }

  .ui--AddressMenu-addr {
    word-break: break-all;
    width: 24ch;
    margin: 0.571rem 0;
    color: var(--color-label);
  }

  .ui--AddressMenu-copyaddr,
  .ui--AddressMenu-index {
    text-align: left;
    font-size: var(--font-size-small);
  }

  .ui--AddressMenu-copyaaddr {
    word-break: break-all;
    width: 12ch;
    margin: 0.371rem 0;
    color: var(--color-label);
  }


  .ui--AddressMenu-index {
    display: flex;
    flex-direction: row;

    label {
      font-size: var(--font-size-small);
      margin-right: 0.4rem;
      text-transform: capitalize;
    }
  }

  section {
    position: relative;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .ui--AddressMenu-sectionHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;

      margin-bottom: 0.57rem;
      width: 100%;

      color: var(--color-text);
      font-size: 1.143rem;
    }

    &.withDivider {
      // padding-top: 1rem;

      ::before {
        position: absolute;
        top: 0;
        left: 0;

        content: '';
        width: 100%;
        // height: 1px;
        background-color: var(--border-table);
      }
    }
  }

  .ui--AddressMenu-identity,
  .ui--AddressMenu-multisig {
    .ui--AddressMenu-identityTable,
    .ui--AddressMenu-multisigTable {
      font-size: var(--font-size-small);
      margin-top: 0.6rem;
      padding-left: 60px;

      .tr {
        padding: 0rem 0rem 0.6rem 0rem;
        display: inline-flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;

        .th {
          color: var(--color-label);
          font-weight: var(--font-weight-bold);
          text-align: left;
          flex-basis: 25%;
          font-size: var(--font-size-h3);

          &.top {
            align-self: flex-start;
          }
        }

        .td {
          overflow: hidden;
          padding-left: 0.6rem;
          text-overflow: ellipsis;
          text-align: left;
          flex-basis: 50%;
        }
      }

      .ui--AddressMini, .subs-number {
        margin-bottom: 0.4rem;
        padding: 0;
      }

      .subs-number {
        font-size: var(--font-size-base);
        margin-bottom: 0.714rem;
      }
    }

    .parent {
      padding: 0 !important;
    }
  }

  && .column {
    align-items: center;

    .ui--FormatBalance:first-of-type {
      margin-bottom: 0.4rem;
    }

    .ui--FormatBalance {
      line-height: 1rem;
    }
  }

  .ui--AddressMenu-buttons {
    .ui--Button-Group {
      margin-bottom: 0;
    }
  }

  .ui--AddressMenu-tags,
  .ui--AddressMenu-flags {
    margin: 0.75rem 0 0;
    width: 100%;
  }

  .ui--AddressMenu-identityIcon {
    background: ${colorLink}66;
  }

  .ui--AddressMenu-actions {
    ul {
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 1rem;

      li {
        margin: 0.2rem 0;
      }
    }
  }

  .inline-icon {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    color: ${colorLink};
  }

  .name--input {
    .ui.input {
      margin: 0 !important;

      > input {
      }
    }
  }

  &.inEditMode {
    .ui--AddressMenu-flags {
      opacity: 60%;
    }
  }

  .ui--AddressMenu-multisig .th.signatories {
    align-self: flex-start;
  }

  .ui--ScrollSection {
    padding: 1rem;
    overflow: auto;
  }

  .ui--LinkSection {
    border-top: 1px solid var(--border-table);
    padding: 0.5rem 0 0.571rem;
    width: 100%;
    position: absolute;
    bottom: 0;

    span {
      margin: 0 0.5rem;
    }
  }
`;

export default React.memo(MultisigFullSidebar);
