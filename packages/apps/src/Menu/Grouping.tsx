// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types.js';

import React from 'react';


import Item from './Item.js';

interface Props extends Group {
  className?: string;
  isActive: boolean;
}

function Grouping ({ className = '', isActive, name, routes }: Props): React.ReactElement<Props> {
  console.log("---------------this is classname", className);
  console.log("---------------this is name ", name);
  
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
        {routes.map((route): React.ReactNode => (
          <Item
        className={isActive ? 'isActive' : ''}
        classNameText='smallHide'
        isToplevel

            key={route.name}
            route={route}
          />
        ))}
    </>
  );
}



export default React.memo(Grouping);
