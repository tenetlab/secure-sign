// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-accounts';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'developer',
    icon: 'users',
    name: 'multisigAccounts',
    text: t('nav.accounts', 'Multisig Accounts', { ns: 'apps-routing' }),
    useCounter
  };
}
