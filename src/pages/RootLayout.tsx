import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import React, { useEffect, useMemo } from 'react';
import { ColorMode } from '@/types/Colors';
import { AnchorProvider } from '@/components/Anchor/AnchorContext';

export const ColorModeContext = React.createContext<{ colorMode: ColorMode; toggleColorMode: () => void }>({
    colorMode: 'dark',
    toggleColorMode: () => {},
});

declare module '@mui/material/styles' {
    interface Palette {
        ff1: Palette['primary'];
        ff2: Palette['primary'];
        ff3: Palette['primary'];
        ff4: Palette['primary'];
    }
    interface PaletteOptions {
        ff1: PaletteOptions['primary'];
        ff2: PaletteOptions['primary'];
        ff3: PaletteOptions['primary'];
        ff4: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        custom: true;
    }
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
    const [colorMode, setColorMode] = React.useState<ColorMode>(
        (localStorage.getItem('colorMode') as ColorMode) || 'dark'
    );

    const toggleColorMode = () => {
        setColorMode((prevColorMode) => (prevColorMode === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        localStorage.setItem('colorMode', colorMode === 'light' ? 'light' : 'dark');
    }, [colorMode]);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: colorMode,
                primary: {
                    light: '#9582ee',
                    main: '#5d4be5',
                    dark: '#002cc2',
                    contrastText: '#fff',
                },
                secondary: {
                    light: '#f9cd8e',
                    main: '#F39E3B',
                    dark: '#d3612c',
                    contrastText: '#000',
                },
                ff1: {
                    light: '#f9938f',
                    main: '#f01515',
                    dark: '#a20000',
                },
                ff2: {
                    light: '#89c6ff',
                    main: '#0a6bea',
                    dark: '#1e37b8',
                },
                ff3: {
                    light: '#a5d794',
                    main: '#47b015',
                    dark: '#006000',
                },
                ff4: {
                    light: '#d297f9',
                    main: '#a020f0',
                    dark: '#571fdc',
                }
            },
            components: {
                MuiTypography: {
                    styleOverrides: {
                        root: {
                            variants: [
                                {
                                    props: { variant: 'h1' },
                                    style: {
                                        fontSize: '4rem'
                                    },
                                },
                                {
                                    props: { variant: 'h2' },
                                    style: {
                                        fontSize: '3rem;'
                                    }
                                },
                                {
                                    props: { variant: 'h3' },
                                    style: {
                                        fontSize: '2rem;'
                                    }
                                },
                                {
                                    props: { variant: 'h4' },
                                    style: {
                                        fontSize: '1.5rem;'
                                    }
                                },
                                {
                                    props: { variant: 'body2' },
                                    style: {
                                        color: colorMode === 'dark' ? '#bbb' : '#555',
                                        fontStyle: 'italic',
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        });
    }, [colorMode]);

    return (
        <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
            <AnchorProvider>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AnchorProvider>
        </ColorModeContext.Provider>
    );
}

export default function RootLayout() {
    return (
        <ColorModeProvider>
            <CssBaseline />
            <Navbar />
            <Outlet />
        </ColorModeProvider>
    );
}
