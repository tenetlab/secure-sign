// Copyright 2017-2024 @polkadot/react-components authors & contributors
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
import Button from '../Button/index.js';
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
}

function InputExtrinsic({ className = '', defaultValue, filter, isDisabled, label, onChange, withLabel }: Props): React.ReactElement<Props> {
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
        <div className='extrinsicsBtn'>
          <Button
            className='nextBtn'
            label={'User'}
          />
          <Button
            className='nextBtn'
            label={'Subnet'}
          />
          <Button
            className='nextBtn'
            label={'Validator'}
          />
        </div>
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
        />
      </LinkedWrapper>
    </StyledDiv>
  );
}

export default React.memo(InputExtrinsic);

const StyledDiv = styled.div`
  .extrinsicsBtn {
    position: absolute;
    top: -7rem;
  }
`