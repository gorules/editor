import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JdmConfigProvider } from '@gorules/jdm-editor';
import { ConfigProvider, theme } from 'antd';
import { match } from 'ts-pattern';

const colorMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export enum ThemePreference {
  Automatic = 'automatic',
  Dark = 'dark',
  Light = 'light',
}

type ThemeContextState = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
};

// eslint-disable-next-line
export const ThemeContext = createContext<ThemeContextState>({} as any);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreferenceInternal] = useState<ThemePreference>(() => {
    return match(localStorage.getItem('themePreference'))
      .with('dark', () => ThemePreference.Dark)
      .with('light', () => ThemePreference.Light)
      .otherwise(() => ThemePreference.Automatic);
  });

  const [isAutomaticDark, setIsAutomaticDark] = useState(() => colorMediaQuery().matches);

  const isDarkTheme = useMemo<boolean>(() => {
    return match(themePreference)
      .with(ThemePreference.Dark, () => true)
      .with(ThemePreference.Light, () => false)
      .otherwise(() => isAutomaticDark);
  }, [themePreference, isAutomaticDark]);

  useEffect(() => {
    const eventTarget = colorMediaQuery();
    const listener = (event: MediaQueryListEvent) => {
      setIsAutomaticDark(event.matches);
    };

    eventTarget.addEventListener('change', listener);
    return () => {
      eventTarget.removeEventListener('change', listener);
    };
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const setThemePreference = (preference: ThemePreference) => {
    setThemePreferenceInternal(preference);
    localStorage.setItem('themePreference', preference);
  };

  return (
    <ConfigProvider theme={{ algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <ThemeContext.Provider value={{ themePreference, setThemePreference }}>
        <JdmConfigProvider theme={{ mode: isDarkTheme ? 'dark' : 'light' }}>{children}</JdmConfigProvider>
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);
