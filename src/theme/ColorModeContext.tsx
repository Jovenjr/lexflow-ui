import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { deepmerge } from '@mui/utils';

const ColorModeContext = createContext<{toggleColorMode: () => void}>({
  toggleColorMode: () => {}
});

export const useColorMode = () => useContext(ColorModeContext);

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#008080' // LexFlow teal
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    }
  }
});

export const ColorModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => (localStorage.getItem('mode') as PaletteMode) || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => {
          const next = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', next);
          return next;
        });
      }
    }),
    []
  );

  const theme = useMemo(() => createTheme(deepmerge(getDesignTokens(mode), {})), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
