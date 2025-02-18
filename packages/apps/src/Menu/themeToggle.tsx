// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SettingsStruct } from '@polkadot/ui-settings/types';

import React, { useEffect, useState } from 'react';

import { save } from '@polkadot/app-settings/util';
import { settings } from '@polkadot/ui-settings';

interface Props {
  className?: string;
  logo: boolean;
  setLogo: (logo: boolean) => void;
}

function ThemeToggle ({ className = '', setLogo }: Props): React.ReactElement<Props> {
  const [isDark, setIsDark] = useState(false);

  const [state, setSettings] = useState((): SettingsStruct => {
    const values = settings.get();

    return { ...values, uiTheme: values.uiTheme === 'dark' ? 'dark' : 'light' };
  });

  useEffect(() => {
    setIsDark(state?.uiTheme === 'dark');
    setLogo(state?.uiTheme === 'dark');
  }, [setLogo, state]);

  useEffect((): void => {
    save(state);
  }, [state]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setSettings((state) => ({ ...state, uiTheme: isDark ? 'light' : 'dark' }));
    save(state);
    setLogo(!isDark);
  };

  const styles = {
    icon: {
      height: '16px',
      width: '16px'

    }
  };

  return (
    <div
      className={className}
      onClick={toggleTheme}
      style={{
        backgroundColor: isDark ? '#424952' : '#dadada',
        border: '1px solid var(--bg-menubar)',
        borderRadius: '50px',
        cursor: 'pointer',
        display: 'inline-block',
        height: '32px',
        padding: '2px',
        position: 'relative',
        width: '64px'
      }}
    >
      <div style={{
        alignItems: 'center',
        backgroundColor: isDark ? '#686868' : '#1c1e21',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        height: '25px',
        justifyContent: 'center',
        position: 'absolute',
        transform: isDark ? 'translateX(32px)' : 'translateX(0)',
        transition: 'transform 0.2s ease',
        width: '25px'
      }}
      >
        {isDark
          ? (
            <svg
              fill='none'
              stroke='white'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              style={styles.icon}
              viewBox='0 0 24 24'
            >
              <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
            </svg>
          )
          : (
            <svg
              fill='none'
              stroke='white'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              style={styles.icon}
              viewBox='0 0 24 24'
            >
              <circle
                cx='12'
                cy='12'
                r='5'
              />
              <line
                x1='12'
                x2='12'
                y1='1'
                y2='3'
              />
              <line
                x1='12'
                x2='12'
                y1='21'
                y2='23'
              />
              <line
                x1='4.22'
                x2='5.64'
                y1='4.22'
                y2='5.64'
              />
              <line
                x1='18.36'
                x2='19.78'
                y1='18.36'
                y2='19.78'
              />
              <line
                x1='1'
                x2='3'
                y1='12'
                y2='12'
              />
              <line
                x1='21'
                x2='23'
                y1='12'
                y2='12'
              />
              <line
                x1='4.22'
                x2='5.64'
                y1='19.78'
                y2='18.36'
              />
              <line
                x1='18.36'
                x2='19.78'
                y1='5.64'
                y2='4.22'
              />
            </svg>
          )}
      </div>
    </div>
  );
}

export default React.memo(ThemeToggle);
