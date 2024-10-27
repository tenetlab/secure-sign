// Copyright 2017-2024 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useCallback, useState } from 'react';

// import { Button, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
// import { BalanceFree } from '@polkadot/react-query';

// import Decoded from './Decoded.js';
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

function extractDefaults(value: DecodedExtrinsic | null, defaultFn: SubmittableExtrinsicFunction<'promise'>): DefaultExtrinsic {
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

function Selection({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const { api } = useApi();
  // const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsicUpper, setExtrinsicUpper] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [{ defaultArgs, defaultFn }] = useState<DefaultExtrinsic>(() => extractDefaults(defaultValue, apiDefaultTxSudo));

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) =>
      setExtrinsicUpper(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) =>
      setError(error ? error.message : null),
    []
  );

  return (
    <StyledDiv className={className}>
      {/* <h1>Extrinsics</h1> */}
      {
        api.runtimeChain.toString() == 'commune' || api.runtimeChain.toString() == 'Bittensor' ?
          <>
            {/* <InputAddress
            label={t('selected account')}
            labelExtra={
              <BalanceFree
                // label={<label>{t('free balance')}</label>}
                params={accountId}
              />
            }
            onChange={setAccountId}
            type='account'
          /> */}
            <Extrinsic
              defaultArgs={defaultArgs}
              defaultValue={defaultFn}
              label={t('extrinsic')}
              onChange={_onExtrinsicChange}
              onError={_onExtrinsicError}
              extrinsicUpper={extrinsicUpper}
              error={error}
            />
            {/* <Decoded
            extrinsic={extrinsicUpper}
            isCall
          /> */}
            {/* {error && !extrinsicUpper && (
            <MarkError content={error} />
          )} */}
            {/* <Button.Group>
            <TxButton
              extrinsic={extrinsicUpper}
              icon='sign-in-alt'
              isUnsigned
              label={t('Submit Unsigned')}
              withSpinner
            />
            <TxButton
              accountId={accountId}
              extrinsic={extrinsicUpper}
              icon='sign-in-alt'
              label={t('Submit Transaction')}
            />
          </Button.Group> */}
          </> :
          <div>Extrinsics does not support this network.</div>
      }
    </StyledDiv>
  );
}

export default React.memo(Selection);

const StyledDiv = styled.div`
  .extrinsics--Extrinsic {
    display: flex;
    padding-right: 3rem;
    .ui--Params-Container {
      .ui--Params-Content {
        display: flex;
        flex-direction: column;
        row-gap: 3rem;
      }
    }
    .ui--Address-Extrinsic {
      width: 48%;
      padding-right: 6rem;
      padding-top: 4rem;
    }
    .ui--Params-Decoded-Button {
      width: 52%;
      background-color: var(--bg-menubar);
      padding: 4rem 5rem 3rem 5rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      row-gap: 3rem;
      .ui--Button-Group {
        margin: 0;
        .ui--Button {
          margin: 0;
        }
        .hasLabel {
          padding: 0.7rem;
        }
      }
      .ui--InputFile {
        padding: 1rem !important;
      }
    }
    .ui--Input-Container {
      margin-top: 6rem;
      .ui--DropdownLinked-Items {
        .ui {
          padding-left: 1rem !important;
          .search {
            padding-left: 1rem !important;
          }
        }
      }
    }
    .is50 {
      .ui--Column {
        max-width: 100%;
      }
    }
    .withBorder {
      padding-left: 0;
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
  .ui--InputAddress {
  }
`
