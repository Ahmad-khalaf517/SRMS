import type { Theme } from '@/app/types/theme';
import React from 'react';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

export default ThemeProviderContext;
