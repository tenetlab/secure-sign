// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { RuntimeVersion } from '@polkadot/types/interfaces';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { useIpfs } from '@polkadot/react-hooks';


interface Props {
  className?: string;
  logo: boolean;
}

function LogoInfo({ className, logo }: Props): React.ReactElement<Props> {

  // const runtimeVersion = useCall<RuntimeVersion>(isApiReady && api.rpc.state.subscribeRuntimeVersion);
  const { ipnsChain } = useIpfs();
  const canToggle = !ipnsChain;

  console.log("===================logo==============", logo);
  

  return (
    <StyledDiv className={className}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''}`}
      >
        <img src={`${logo ? '/multi-signature-dark.png' : '/multi-signature-light.png'}`} alt='logo' className='multisig_logo' width={50} height={50} />
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  
  align-items: center;
  margin-right: 1rem;
  padding-top: 0.5rem;   
  padding-bottom: 0.5rem;   
`;

export default React.memo(LogoInfo);
