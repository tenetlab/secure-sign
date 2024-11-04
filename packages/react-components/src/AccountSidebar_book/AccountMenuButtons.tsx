// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React, { useCallback } from 'react';

import { useToggle } from '@polkadot/react-hooks';
// import { isFunction } from '@polkadot/util';

import Button from '../Button/index.js';
import { TransferModal } from '../modals/index.js';
import { styled } from '../styled.js';
import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  flags: AddressFlags;
  isEditingName: boolean;
  isEditing: boolean;
  toggleIsEditingName: () => void;
  toggleIsEditingTags: () => void;
  onCancel: () => void;
  onSaveName: () => void;
  onSaveTags: () => void;
  onForgetAddress: () => void;
  onUpdateName?: (() => void) | null;
  recipientId: string;
}

function AccountMenuButtons ({ className = '', flags, isEditing, isEditingName, onCancel, onForgetAddress, onSaveName, onSaveTags, onUpdateName, recipientId, toggleIsEditingName, toggleIsEditingTags }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();
  // const api = useApi();

  const _onForgetAddress = useCallback(
    (): void => {
      onForgetAddress();
      onUpdateName && onUpdateName();
    },
    [onForgetAddress, onUpdateName]
  );

  const toggleIsEditing = useCallback(() => {
    flags.isEditable && toggleIsEditingName();
    toggleIsEditingTags();
  }, [flags.isEditable, toggleIsEditingName, toggleIsEditingTags]);

  const _onUpdateName = useCallback(
    (): void => {
      onSaveName();
      onUpdateName && onUpdateName();
    },
    [onSaveName, onUpdateName]
  );

  const updateName = useCallback(() => {
    if (isEditingName && (flags.isInContacts || flags.isOwned)) {
      _onUpdateName();
      toggleIsEditingName();
    }
  }, [isEditingName, flags.isInContacts, flags.isOwned, _onUpdateName, toggleIsEditingName]);

  const onEdit = useCallback(() => {
    if (isEditing) {
      updateName();
      onSaveTags();
    }

    toggleIsEditing();
  }, [isEditing, toggleIsEditing, updateName, onSaveTags]);

  return (
    <StyledDiv className={`${className} ui--AddressMenu-buttons`}>
      {isEditing
        ? (
          <Button.Group className='ui--AddressMenu-buttons'>
            <Button
              icon='times'
              label={t('Cancel')}
              onClick={onCancel}
            />
            <Button
              icon='save'
              label={t('Save')}
              onClick={onEdit}
            />
          </Button.Group>
        )
        : (
          <Button.Group className='ui--AddressMenu-buttons'>
            {/* {(isFunction(api.api.tx.balances?.transferAllowDeath) || isFunction(api.api.tx.balances?.transfer)) && (
              <Button
                icon='paper-plane'
                isDisabled={isEditing}
                label={t('Send')}
                onClick={toggleIsTransferOpen}
              />
            )} */}
            {!flags.isOwned && !flags.isInContacts && (
              <Button
                icon='plus'
                isDisabled={isEditing}
                label={t('Save')}
                onClick={_onUpdateName}
              />
            )}
            {!flags.isOwned && flags.isInContacts && (
              <Button
                icon='ban'
                isDisabled={isEditing}
                label={t('Remove')}
                onClick={_onForgetAddress}
              />
            )}
            <Button
              icon='edit'
              isDisabled={!flags.isEditable}
              label={t('Edit')}
              onClick={onEdit}
            />
          </Button.Group>
        )
      }
      {isTransferOpen && (
        <TransferModal
          key='modal-transfer'
          onClose={toggleIsTransferOpen}
          recipientId={recipientId}
        />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 20%;
  padding-right: 3rem;

  .ui--Button-Group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0;
  }
  
  @media only screen and (max-width: 1921px) {
    width: 22%;
  }

  @media only screen and (max-width: 1700px) {
    width: 25%;
  }

  @media only screen and (max-width: 1580px) {
    width: 27%;
  }

  @media only screen and (max-width: 1400px) {
    width: 35%;
  }
`;

export default React.memo(AccountMenuButtons);
