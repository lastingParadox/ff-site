import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import React, { useEffect, useMemo } from 'react';
import { ColorMode } from '@/types/Colors';

export const ColorModeContext = React.createContext<{ colorMode: ColorMode; toggleColorMode: () => void }>({
    colorMode: 'dark',
    toggleColorMode: () => {},
});

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
                            ]
                        }
                    }
                }
            }
        });
    }, [colorMode]);

    return (
        <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
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
