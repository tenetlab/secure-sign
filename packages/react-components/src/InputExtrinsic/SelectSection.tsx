// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useEffect } from 'react';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isError?: boolean;
  onChange?: (value: string) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

function getSectionFromChain (chain: string, onChange: (value: string) => void) {
  switch (chain) {
    case 'commune':
      onChange('subspaceModule');
      break;
    case 'Bittensor':
      onChange('subtensorModule');
      break;
    default:
      break;
  }
}

function getSectionNameFromChain (chain: string): any {
  switch (chain) {
    case 'commune':
      return 'SubSpaceModule';
    case 'Bittensor':
      return 'SubtensorModule';
    default:
      return '';
  }
}

function isBitOrCom (chain: string): any {
  switch (chain) {
    case 'commune':
      return true;
    case 'Bittensor':
      return true;
    default:
      return false;
  }
}

function SelectSection ({ className = '', defaultValue, isDisabled, isError, onChange, options, value }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  useEffect(() => {
    onChange && isBitOrCom(api.runtimeChain.toString()) &&
    getSectionFromChain(api.runtimeChain.toString(), onChange);
  }, [])
  return (
    <>
      {
        !isBitOrCom(api.runtimeChain.toString()) ?
        <Dropdown
          className={`${className} ui--DropdownLinked-Sections`}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          onChange={onChange}
          onSearch={filterDropdownItems}
          options={options}
          value={value.section}
          withLabel={false}
        />:
        <h1>{getSectionNameFromChain(api.runtimeChain.toString())}:</h1>
      }
    </>
  );
}

export default React.memo(SelectSection);
