// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-multisig';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'developer',
    icon: 'users',
    name: 'multisig',
    text: t('nav.multisig', 'Multisig Accounts', { ns: 'apps-routing' }),
    useCounter
  };
}
