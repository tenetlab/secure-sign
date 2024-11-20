// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback, useRef, useState } from 'react';

import { styled } from '@polkadot/react-components';

interface Props {
  api: ApiPromise;
  className?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isError?: boolean;
  onChange?: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
  methodType: string;
  setBtnDisable?: (isBtnDisable: boolean) => void;
}

function SelectMethod({ api, onChange, options, value, methodType, setBtnDisable }: Props): React.ReactElement<Props> | null {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedMethodIndex');
    if (saved && setBtnDisable) {
      setBtnDisable(false);
    }
    return saved ? parseInt(saved) : null;
  });
  const lastUpdate = useRef<string>('');
  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem('selectedMethodIndex', index.toString());
    setBtnDisable?.(false);
  };

  const transform = useCallback(
    (method: string): SubmittableExtrinsicFunction<'promise'> => {
      if (method == 'transferKeepAlive')
        return api.tx['balances'][method];
      else if (method == 'addStake' || method == 'register' || method == 'removeStake' || method == 'setWeights') {
        if (api.runtimeChain.toString() == 'commune')
          return api.tx['subspaceModule'][method];
        else
          return api.tx['subtensorModule'][method];
      }
      else {
        return api.tx[value.section][method];
      }
    },
    [api, value]
  );

  if (!options.length) {
    return null;
  }

  if (methodType === 'Validator') {
    options = options.filter((option) => {
      return option.value == 'addStake' ||
        option.value == 'removeStake' ||
        option.value == 'transferKeepAlive' ||
        option.value == 'setWeights'
    })
  } else if (methodType === 'Subnet') {
    options = options.filter((option) => {
      return option.value == 'addStake' ||
        option.value == 'register' ||
        option.value == 'removeStake' ||
        option.value == 'transferKeepAlive'
    })
  } else {
    options = options.filter((option) => {
      return option.value == 'addStake' ||
        option.value == 'removeStake' ||
        option.value == 'transferKeepAlive'
    })
  }


  const onSelect = (value: any) => {
    const json = JSON.stringify({ v: value });

    if (lastUpdate.current !== json) {
      lastUpdate.current = json;

      onChange && onChange(
        transform
          ? transform(value)
          : value
      );
    }
  }
  return (
    <StyleDiv className=''>
      {options?.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: selectedIndex === index ? 'var(--item-active)' : ''
          }}
          className='item'
          onClick={() => {
            handleRowClick(index)
            onSelect(item?.value)
          }}
        >
          <div className='nickname'>
            {item?.value === 'register' ? 'registerNetwork' : (item?.value === 'setWeights' ? 'setRootWeights' : item?.value)}
          </div>
          <div className='description'>
            <div>
              {item?.value === 'addStake' && 'Adds a stake to a specified hotkey.'}
              {item?.value === 'register' && 'Registers a new subnet.'}
              {item?.value === 'removeStake' && 'Removes stake from the staking account (hotkey).'}
              {item?.value === 'transferKeepAlive' && `Transfers free balance to another account while ensuring the extrinsic's success.`}
              {item?.value === 'setWeights' && `Assigns weights to active subnets using their 'netuid'.`}
            </div>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #2563eb',
                backgroundColor: selectedIndex === index ? '#2563eb' : '#ffffff'
              }}
            />
          </div>
        </div>
      ))}
    </StyleDiv>
  );
}

export default React.memo(SelectMethod);

const StyleDiv = styled.div`
  background-color: var(--bg-subCard);
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1.2rem;
  color: var(--color-text);

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin: 1rem;
  }
  
  .nickname {
    width: 30%;
  }
  .description {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between; 
  }
`