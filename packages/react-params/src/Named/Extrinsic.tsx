// Copyright 2017-2024 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { TypeDef } from '@polkadot/types/types';
import type { ComponentMap, RawParam } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  InputExtrinsic, InputAddress, MarkError,
  TxButton, Button 
} from '@polkadot/react-components';
import { BalanceFree } from '@polkadot/react-query';
import { useTranslation } from '../utils/translate.js';
import Decoded from '../utils/Decoded.js';

import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';
import { isUndefined, objectSpread } from '@polkadot/util';

import paramComponents from '../Extra/index.js';
import { balanceCalls, balanceCallsOverrides } from '../overrides.js';

interface Props {
  className?: string;
  defaultArgs?: RawParam[];
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: SubmittableExtrinsic<'promise'>) => void;
  onEnter?: () => void;
  onError?: (error?: Error | null) => void;
  onEscape?: () => void;
  withLabel?: boolean;
  extrinsicUpper?: SubmittableExtrinsic<'promise'> | null;
  error?: string | null;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

interface CallState {
  extrinsic: {
    fn: SubmittableExtrinsicFunction<'promise'>;
    params: ParamDef[];
  },
  values: RawParam[];
}

const allComponents = objectSpread<ComponentMap>({}, paramComponents, balanceCallsOverrides);

function isValuesValid(params: ParamDef[], values: RawParam[]): boolean {
  return values.reduce((isValid, value): boolean =>
    isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid, params.length === values.length
  );
}

function getParams({ meta }: SubmittableExtrinsicFunction<'promise'>): ParamDef[] {
  return meta.args.map(({ name, type, typeName }): { name: string; type: TypeDef } => ({
    name: name.toString(),
    type: {
      ...getTypeDef(type.toString()),
      ...(typeName.isSome
        ? { typeName: typeName.unwrap().toString() }
        : {}
      )
    }
  }));
}

function getCallState(fn: SubmittableExtrinsicFunction<'promise'>, values: RawParam[] = []): CallState {
  return {
    extrinsic: {
      fn,
      params: getParams(fn)
    },
    values
  };
}

function ExtrinsicDisplay({ defaultArgs, defaultValue, filter, isDisabled, isError, isPrivate, label, onChange, onEnter, onError, onEscape, withLabel, extrinsicUpper, error }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);

  const [{ extrinsic, values }, setDisplay] = useState<CallState>(() => getCallState(defaultValue, defaultArgs));

  useEffect((): void => {
    const isValid = isValuesValid(extrinsic.params, values);
    let method;

    if (isValid) {
      try {
        method = extrinsic.fn(...values.map(({ value }) => value));
      } catch (error) {
        onError && onError(error as Error);
      }
    } else {
      onError && onError(null);
    }

    onChange(method);
  }, [extrinsic, onChange, onError, values]);

  const overrides = useMemo(
    () => balanceCalls.includes(`${extrinsic.fn.section}.${extrinsic.fn.method}`)
      ? allComponents
      : paramComponents,
    [extrinsic]
  );

  const _onChangeMethod = useCallback(
    (fn: SubmittableExtrinsicFunction<'promise'>) =>
      setDisplay((prev): CallState =>
        fn.section === prev.extrinsic.fn.section && fn.method === prev.extrinsic.fn.method
          ? prev
          : getCallState(fn)
      ),
    []
  );

  const _setValues = useCallback(
    (values: RawParam[]) =>
      setDisplay(({ extrinsic }) => ({ extrinsic, values })),
    []
  );

  const { fn: { method, section }, params } = extrinsic;

  return (
    <div className='extrinsics--Extrinsic'>
      <div className='ui--Address-Extrinsic'>
        <InputAddress
          label={t('selected account')}
          labelExtra={
            <BalanceFree
              params={accountId}
            />
          }
          onChange={setAccountId}
          type='account'
        />
        <InputExtrinsic
          defaultValue={defaultValue}
          filter={filter}
          isDisabled={isDisabled}
          isError={isError}
          isPrivate={isPrivate}
          label={label}
          onChange={_onChangeMethod}
          withLabel={withLabel}
        />
      </div>
      <div className='ui--Params-Decoded-Button'>
        <Params
          key={`${section}.${method}:params`}
          onChange={_setValues}
          onEnter={onEnter}
          onEscape={onEscape}
          overrides={overrides}
          params={params}
          values={values}
        />
        <Decoded
          extrinsic={extrinsicUpper}
          isCall
        />
        {error && !extrinsic && (
          <MarkError content={error} />
        )}
        <Button.Group>
          <TxButton
            accountId={accountId}
            extrinsic={extrinsicUpper}
            icon='sign-in-alt'
            label={t('Submit Transaction')}
          />
        </Button.Group>
      </div>
    </div>
  );
}

export default React.memo(ExtrinsicDisplay);
