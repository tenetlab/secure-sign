// Copyright 2017-2024 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useCallback, useState } from 'react';

import { Button, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
import { BalanceFree } from '@polkadot/react-query';

import Decoded from './Decoded.js';
import { useTranslation } from './translate.js';
import { styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  defaultValue: DecodedExtrinsic | null;
}

interface DefaultExtrinsic {
  defaultArgs?: RawParam[];
  defaultFn: SubmittableExtrinsicFunction<'promise'>;
}

function extractDefaults (value: DecodedExtrinsic | null, defaultFn: SubmittableExtrinsicFunction<'promise'>): DefaultExtrinsic {
  if (!value) {
    return { defaultFn };
  }

  return {
    defaultArgs: value.call.args.map((value) => ({
      isValid: true,
      value
    })),
    defaultFn: value.fn
  };
}

function Selection ({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [{ defaultArgs, defaultFn }] = useState<DefaultExtrinsic>(() => extractDefaults(defaultValue, apiDefaultTxSudo));

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) =>
      setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) =>
      setError(error ? error.message : null),
    []
  );

  return (
    <StyledDiv className={className}>
      <h1>Extrinsics</h1>
      <div className='ui--Extrinsic-Group'>
        {
          api.runtimeChain.toString() == 'commune' || api.runtimeChain.toString() == 'Bittensor' ?
          <div className='ui--Extrinsic-Group-Content'>
            <InputAddress
              label={t('selected account')}
              labelExtra={
                <BalanceFree
                  // label={<label>{t('free balance')}</label>}
                  params={accountId}
                />
              }
              onChange={setAccountId}
              type='account'
            />
            <Extrinsic
              defaultArgs={defaultArgs}
              defaultValue={defaultFn}
              label={t('extrinsic')}
              onChange={_onExtrinsicChange}
              onError={_onExtrinsicError}
            />
            <Decoded
              extrinsic={extrinsic}
              isCall
            />
            {error && !extrinsic && (
              <MarkError content={error} />
            )}
            <Button.Group>
              {/* <TxButton
                extrinsic={extrinsic}
                icon='sign-in-alt'
                isUnsigned
                label={t('Submit Unsigned')}
                withSpinner
              /> */}
              <TxButton
                accountId={accountId}
                extrinsic={extrinsic}
                icon='sign-in-alt'
                label={t('Submit Transaction')}
              />
            </Button.Group>
          </div>:
          <div>Extrinsics does not support this network.</div>
        }
      </div>
    </StyledDiv>
  );
}

export default React.memo(Selection);

const StyledDiv = styled.div`
  margin-top: 0.5rem;
  .extrinsics--Extrinsic {
    position: relative;
    display: flex;
    .ui--Params-Container {
      width: 50%;
      position: absolute;
      right: 0;
      top: -7.5rem;
      .ui--Params-Content {
        display: flex;
        flex-direction: column;
        row-gap: 4rem;
      }
    }
    .ui--Input-Container {
      width: 50%;
      .ui--DropdownLinked-Items {
        .ui {
          padding-left: 1rem !important;
          .search {
            padding-left: 1rem !important;
          }
        }
      }
    }
  }
  .ui--Columar {
    .ui--Column {
      .ui--Output {
        .ui--Labelled-content {
          .ui {
            padding-left: 1rem !important;
          }
        }
      }
    }
  }
  .ui--Extrinsic-Group {
    padding-top: 2rem;
    display: flex;
    .ui--Extrinsic-Group-Content {
      width: 80%;
      display: flex;
      flex-direction: column;
      row-gap: 4rem;
      .ui--Button-Group {
        width: 50%;
      }
    }
  }
  .ui--InputAddress {
    width: 50%;
  }
`
