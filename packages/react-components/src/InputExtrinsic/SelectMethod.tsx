// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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

interface MethodDetails {
  balances?: string[];
  subtensorModule?: string[];
  adminUtils?: string[];
  subspaceModule?: string[];
  subnetEmissionModule?: string[];
}

function SelectMethod({ api, onChange, options, methodType, setBtnDisable, value }: Props): React.ReactElement<Props> | null {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedMethodIndex');

    return saved ? parseInt(saved) : null;
  });

  const methodMappings: Record<string, Record<string, MethodDetails>> = {
    Bittensor: {
      User: {
        balances: ['transferAll', 'transferAllowDeath', 'transferKeepAlive'],
        subtensorModule: ['addStake', 'removeStake', 'setIdentity', 'swapColdkey', 'scheduleSwapColdkey', 'swapHotkey']
      },
      Validator: {
        subtensorModule: ['rootRegister', 'setWeights', 'setRootWeights', 'setChildren', 'setChildkeyTake']
      },
      Subnet: {
        subtensorModule: ['registerNetwork', 'dissolveNetwork', 'scheduleDissolveNetwork', 'setSubnetIdentity'],
        adminUtils: ['sudoSetMinBurn', 'sudoSetMaxBurn', 'sudoSetNetworkRegistrationAllowed', 'sudoSetAdjustmentAlpha', 'sudoSetImmunityPeriod', 'sudoSetKappa', 'sudoSetTempo', 'sudoSetMaxRegistrationsPerBlock', 'sudoSetTargetRegistrationsPerInterval']
      }
    },
    commune: {
      User: {
        balances: ['transferAll', 'transferAllowDeath', 'transferKeepAlive'],
        subspaceModule: ['transferMultiple', 'addStake', 'addStakeMultiple', 'removeStake', 'removeStakeMultiple', 'transferStake', 'register', 'deregister', 'updateModule']
      },
      Validator: {
        subnetEmissionModule: ['setWeights', 'setWeightsEncrypted']
      },
      Subnet: {
        subspaceModule: ['registerSubnet', 'updateSubnet']
      }
    }
  };

  const runtime = api.runtimeChain.toString();

  options = options.filter(option =>
    Object.values(methodMappings[runtime as keyof typeof methodMappings]?.[methodType] || {}).flat().includes(option.value)
  );

  useEffect(() => {
    const numberOfExtrinsic = Object.values(methodMappings[runtime]?.[methodType] || {}).flat().length;
    if (options.length === numberOfExtrinsic && options.length > (selectedIndex ?? -1) && selectedIndex !== null && setBtnDisable) {
      setBtnDisable(false);
      onSelect(options[selectedIndex].value);
    } else {
      setBtnDisable?.(true);
    }
  }, [selectedIndex, setBtnDisable, options, methodType]);

  const lastUpdate = useRef<string>('');

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem('selectedMethodIndex', index.toString());
    setBtnDisable?.(false);
  };

  const transform = useCallback(
    (method: string): SubmittableExtrinsicFunction<'promise'> => {
      for (const [, modules] of Object.entries(methodMappings[runtime])) {
        for (const [module, methods] of Object.entries(modules)) {
          if (methods.includes(method)) {
            return api.tx[module][method];
          }
        }
      }

      return api.tx[value.section][method];
    },
    [api, value]
  );

  if (!options.length) {
    return null;
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
  };

  return (
    <StyleDiv className=''>
      {options?.map((item, index) => (
        <div
          className='item'
          key={index}
          onClick={() => {
            handleRowClick(index);
            onSelect(item?.value);
          }}
          style={{
            backgroundColor: selectedIndex === index ? 'var(--item-active)' : ''
          }}
        >
          <div className='nickname'>
            {item?.value}
            {/* {item?.value === 'register' ? 'registerNetwork' : (item?.value === 'setWeights' ? 'setRootWeights' : item?.value)} */}
          </div>
          <div className='description'>
            <div>
              {item?.value === 'addStake' && 'Adds stake to a specified hotkey.'}
              {item?.value === 'registerNetwork' && 'Registers a new subnetwork.'}
              {item?.value === 'registerSubnet' && 'Registers a new subnetwork.'}
              {item?.value === 'removeStake' && 'Removes stake from the staking account (hotkey).'}
              {item?.value === 'transferKeepAlive' && 'Transfers free balance to another account while ensuring the existence of the account after the transfer.'}
              {item?.value === 'transferAllowDeath' && 'Transfers free balance to another account while it can be reaped.'}
              {item?.value === 'setRootWeights' && 'Assigns weights to active subnets using their \'netuid\'.'}
              {item?.value === 'setWeights' && 'Sets miner weights on a subnet.'}
              {item?.value === 'transferAll' && 'Transfers the entire transferable balance from the caller account.'}
              {item?.value === 'setIdentity' && 'Sets prometheus information for the neuron.'}
              {item?.value === 'swapColdkey' && 'Changes the coldkey associated with their account.'}
              {item?.value === 'scheduleSwapColdkey' && 'Schedules a coldkey swap operation to be executed at a future block.'}
              {item?.value === 'swapHotkey' && 'Changes the hotkey associated with their account'}
              {item?.value === 'rootRegister' && 'Registers the hotkey to root network'}
              {item?.value === 'setChildren' && 'Sets child hotkeys for a given hotkey on a specified subnet.'}
              {item?.value === 'setChildkeyTake' && 'Sets the childkey take for a given hotkey.'}
              {item?.value === 'dissolveNetwork' && "Removes a user's subnetwork"}
              {item?.value === 'scheduleDissolveNetwork' && 'Schedules the dissolution of a network at a specified block number.'}
              {item?.value === 'setSubnetIdentity' && 'Sets the identity information for a subnet.'}
              {item?.value === 'sudoSetMinBurn' && 'Sets the minimum burn for a subnet.'}
              {item?.value === 'sudoSetMaxBurn' && 'Sets the maximum burn for a subnet.'}
              {item?.value === 'sudoSetNetworkRegistrationAllowed' && 'Allows neuron registration on a subnet'}
              {item?.value === 'sudoSetImmunityPeriod' && 'Sets the immunity period for a subnet.'}
              {item?.value === 'sudoSetKappa' && 'Sets the kappa for a subnet.'}
              {item?.value === 'sudoSetTempo' && 'Sets the tempo for a subnet.'}
              {item?.value === 'sudoSetAdjustmentAlpha' && 'Sets the adjustment alpha for a subnet.'}
              {item?.value === 'sudoSetMaxRegistrationsPerBlock' && 'Sets the maximum number of registrations allowed per block for a subnet.'}
              {item?.value === 'sudoSetTargetRegistrationsPerInterval' && 'Sets the target number of registrations per interval for a subnet.'}
              {item?.value === 'setWeightsEncrypted' && 'commit-reveal version of setWeights.'}
              {item?.value === 'updateSubnet' && 'Updates subnet metadata.'}
              {item?.value === 'addStakeMultiple' && 'batch-version for addStake.'}
              {item?.value === 'deregister' && 'Deregisters a module.'}
              {item?.value === 'register' && 'Registers a module.'}
              {item?.value === 'removeStakeMultiple' && 'Batch version of remove-stake.'}
              {item?.value === 'transferMultiple' && 'Batch version of transfer.'}
              {item?.value === 'transferStake' && 'Moves stake from one module to another.'}
              {item?.value === 'updateModule' && 'Updates module metadata.'}
            </div>
            <div
              style={{
                minWidth: '16px',
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .description {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between; 
    margin-left: 1rem;
  }
`;
