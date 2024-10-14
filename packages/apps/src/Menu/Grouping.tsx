// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types.js';

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

import Item from './Item.js';

interface Props extends Group {
  className?: string;
  isActive: boolean;
}

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

function Grouping ({ className = '', isActive, name, routes }: Props): React.ReactElement<Props> {
  if (routes.length === 1 && routes[0].group === 'settings') {
    return (
      <Item
        className={isActive ? 'isActive' : ''}
        classNameText='smallHide'
        isToplevel
        route={routes[0]}
      />
    );
  }

  return (
    <>
      {/* <div className={`groupHdr ${!isActive ? 'highlight--color-contrast' : ''}`}>
        <span className='smallHide'>{name}</span>
        <Icon
          className='smallShow'
          icon={routes[0].icon}
        />
        <Icon icon='caret-down' />
      </div> */}
      {/* <ul className='groupMenu'> */}
        {routes.map((route): React.ReactNode => (
          <Item
        className={isActive ? 'isActive' : ''}
        classNameText='smallHide'
        isToplevel

            key={route.name}
            route={route}
          />
        ))}
      {/* </ul> */}
    </>
    // <StyledLi className={`${className} ${isActive ? 'isActive' : ''}`}>
    //   <div className={`groupHdr ${!isActive ? 'highlight--color-contrast' : ''}`}>
    //     <span className='smallHide'>{name}</span>
    //     <Icon
    //       className='smallShow'
    //       icon={routes[0].icon}
    //     />
    //     <Icon icon='caret-down' />
    //   </div>
    //   <ul className='groupMenu'>
    //     {routes.map((route): React.ReactNode => (
    //       <Item
    //         key={route.name}
    //         route={route}
    //       />
    //     ))}
    //   </ul>
    // </StyledLi>
    
  );
}



export default React.memo(Grouping);
