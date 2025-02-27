// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: {
        Keys: 'AccountId',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AmountOf: 'Amount',
        Amount: 'i128',
        SmartContract: {
          _enum: {
            Evm: 'H160',
            Wasm: 'AccountId'
          }
        },
        EthTransaction: 'LegacyTransaction',
        EraStakingPoints: {
          total: 'Balance',
          stakers: 'BTreeMap<AccountId, Balance>',
          formerStakedEra: 'EraIndex',
          claimedRewards: 'Balance'
        },
        PalletDappsStakingEraStakingPoints: {
          total: 'Balance',
          stakers: 'BTreeMap<AccountId, Balance>',
          formerStakedEra: 'EraIndex',
          claimedRewards: 'Balance'
        },
        EraRewardAndStake: {
          rewards: 'Balance',
          staked: 'Balance'
        },
        PalletDappsStakingEraRewardAndStake: {
          rewards: 'Balance',
          staked: 'Balance'
        },
        EraIndex: 'u32'
      }
    }
  ]
};

export default definitions;
