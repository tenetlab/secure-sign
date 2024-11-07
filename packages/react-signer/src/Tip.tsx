// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { BN_ZERO } from '@polkadot/util';

interface Props {
  className?: string;
  onChange: (tip?: BN) => void;
}

function Tip ({ onChange }: Props): React.ReactElement<Props> | null {
  const [tip, setTip] = useState<BN | undefined>();
  const [showTip, setShowTip] = useState(false);

  useEffect((): void => {
    onChange(showTip ? tip : BN_ZERO);
  }, [onChange, showTip, tip]);

  console.log(setTip, setShowTip);
  
  return (
    <></>
  );
}

export default React.memo(Tip);
