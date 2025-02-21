// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-newmultisig';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'accounts',
    icon: 'plus',
    name: 'newmultisig',
    text: t('nav.newmultisig', 'New Multisig', { ns: 'apps-routing' }),
    useCounter
  };
}
