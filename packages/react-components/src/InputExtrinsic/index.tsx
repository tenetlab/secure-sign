// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import methodOptions from './options/method.js';
import sectionOptions from './options/section.js';
import LinkedWrapper from './LinkedWrapper.js';
import SelectMethod from './SelectMethod.js';
import SelectSection from './SelectSection.js';
import {
  styled
} from '@polkadot/react-components';
interface Props {
  className?: string;
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label: React.ReactNode;
  onChange?: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  withLabel?: boolean;
  setBtnDisable?: (isBtnDisable: boolean) => void;
}

function InputExtrinsic({ className = '', setBtnDisable, defaultValue, filter, isDisabled, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => methodOptions(api, defaultValue.section, filter));
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(api, filter));
  const [value, setValue] = useState<SubmittableExtrinsicFunction<'promise'>>((): SubmittableExtrinsicFunction<'promise'> => defaultValue);
  const [{ defaultMethod, defaultSection }] = useState(() => ({ defaultMethod: defaultValue.method, defaultSection: defaultValue.section }));

  const _onKeyChange = useCallback(
    (newValue: SubmittableExtrinsicFunction<'promise'>): void => {
      if (value !== newValue) {
        setValue((): SubmittableExtrinsicFunction<'promise'> => newValue);
        onChange && onChange(newValue);
      }
    },
    [onChange, value]
  );

  const _onSectionChange = useCallback(
    (newSection: string): void => {
      if (newSection !== value.section) {
        let optionsMethod = methodOptions(api, newSection, filter);
        setOptionsMethod(optionsMethod);
        _onKeyChange(api.tx[newSection][optionsMethod[0].value]);
      }
    },
    [_onKeyChange, api, filter, value]
  );

  return (
    <StyledDiv>
      <LinkedWrapper
        className={`${className} ui--Input-Container`}
        label={label}
        withLabel={withLabel}
      >
        <SelectSection
          className='small'
          defaultValue={defaultSection}
          isDisabled={isDisabled}
          onChange={isDisabled ? undefined : _onSectionChange}
          options={optionsSection}
          value={value}
        />

        <SelectMethod
          api={api}
          className='large'
          defaultValue={defaultMethod}
          isDisabled={isDisabled}
          onChange={isDisabled ? undefined : _onKeyChange}
          options={optionsMethod}
          value={value}
          setBtnDisable={setBtnDisable}
        />
      </LinkedWrapper>
    </StyledDiv>
  );
}

export default React.memo(InputExtrinsic);

const StyledDiv = styled.div`
  .extrinsicsBtn {
    position: absolute;
    top: -5rem;
    width: 20rem;
  }
  .nextBtn {
    width: 6rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    padding: 0.7rem 1rem;
  }
  .nextBtn.active {
    background-color: var(--item-actives) !important;
    color: white !important;
  }
//   .button-group {
//     position: absolute;
//     top: -5rem;
//     width: 20rem !important;
//     display: flex;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     float: right;
//   }

// .button {
//   flex: 1;
//   padding: 8px 16px;
//   background-color: #f1f1f1;
//   border: none;
//   outline: none;
//   cursor: pointer;
//   transition: background-color 0.3s;
//   float: right;
// }

// .button.active {
//   background-color: #007bff;
//   color: #fff;
//   float: right;
// }

// .button:not(:last-child) {
//   border-right: 1px solid #ccc;
//   float: right;
// }

// .button:hover:not(.active) {
//   background-color: #e6e6e6;
//   float: right;
// }

`