// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Routes, TFunction } from './types.js';

import accounts from './accounts.js';
import addresses from './addresses.js';
import extrinsics from './extrinsics.js';
import multisigAccounts from './multisigAccounts.js';
import newMiltisig from './newMultisig.js';

export default function create (t: TFunction): Routes {
  return [
    newMiltisig(t),
    multisigAccounts(t),
    accounts(t),
    addresses(t),
    extrinsics(t)
  ];
}
