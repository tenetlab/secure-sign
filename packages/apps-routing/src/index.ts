// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Routes, TFunction } from './types.js';

import accounts from './accounts.js';
import alliance from './alliance.js';
import ambassador from './ambassador.js';
import assets from './assets.js';
import bounties from './bounties.js';
import broker from './broker.js';
import claims from './claims.js';
import collator from './collator.js';
import contracts from './contracts.js';
import council from './council.js';
import democracy from './democracy.js';
import extrinsics from './extrinsics.js';
import fellowship from './fellowship.js';
import gilt from './gilt.js';
import membership from './membership.js';
import nfts from './nfts.js';
import nis from './nis.js';
import poll from './poll.js';
import ranked from './ranked.js';
// import settings from './settings.js';
import society from './society.js';
// import staking from './staking.js';
import staking2 from './staking2.js';
import stakingLegacy from './stakingLegacy.js';
import sudo from './sudo.js';
import techcomm from './techcomm.js';
import teleport from './teleport.js';
import transfer from './transfer.js';
import treasury from './treasury.js';

export default function create (t: TFunction): Routes {
  return [
    accounts(t),
    claims(t),
    poll(t),
    transfer(t),
    teleport(t),
    // staking(t),
    staking2(t),
    // Legacy staking Pre v14 pallet version.
    stakingLegacy(t),
    collator(t),
    broker(t),
    // governance v2
    membership(t),
    alliance(t),
    ambassador(t),
    fellowship(t),
    ranked(t),
    // old v1 governance
    democracy(t),
    council(t),
    techcomm(t),
    // other governance-related
    treasury(t),
    bounties(t),
    // others
    assets(t),
    nfts(t),
    society(t),
    nis(t),
    gilt(t),
    contracts(t),
    // storage(t),
    extrinsics(t),
    sudo(t),
    // settings(t)
  ];
}
