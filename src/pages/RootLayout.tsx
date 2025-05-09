import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import React, { useContext, useEffect, useMemo } from 'react';
import { ColorMode } from '@/types/Colors';
import { AnchorProvider } from '@/components/Anchor/AnchorContext';
import { User } from '@/types/Users';

export const ColorModeContext = React.createContext<{ colorMode: ColorMode; toggleColorMode: () => void }>({
    colorMode: 'dark',
    toggleColorMode: () => {},
});

export const AuthContext = React.createContext<{
    isLoggedIn: () => boolean;
    login: (user: { id: string; name: string; token: string }) => void;
    logout: () => void;
    getUser: () => { id: string; name: string; token: string } | undefined;
}>({
    isLoggedIn: () => false,
    login: () => {},
    logout: () => {},
    getUser: () => undefined,
});

declare module '@mui/material/styles' {
    interface Palette {
        ff1: Palette['primary'];
        ff2: Palette['primary'];
        ff3: Palette['primary'];
        ff4: Palette['primary'];
        dark: {
            background: string;
            card: string;
            highlight: string;
            active: string;
            text: string;
        }
        light: {
            background: string;
            card: string;
            highlight: string;
            active: string;
            text: string;
        }
    }
    interface PaletteOptions {
        ff1: PaletteOptions['primary'];
        ff2: PaletteOptions['primary'];
        ff3: PaletteOptions['primary'];
        ff4: PaletteOptions['primary'];
        dark: {
            background: string;
            card: string;
            highlight: string;
            active: string;
            text: string;
        }
        light: {
            background: string;
            card: string;
            highlight: string;
            active: string;
            text: string;
        }
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

    const colors = {
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
        seasons: {
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
            },
        },
        colorModes: {
            dark: {
                background: '#121212',
                card: '#272727',
                highlight: '#333',
                active: '#666',
                text: '#fff',
            },
            light: {
                background: '#fff',
                card: '#dedede',
                highlight: '#ccc',
                active: '#eee',
                text: '#000',
            }
        }
    }

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: colorMode,
                primary: colors.primary,
                secondary: colors.secondary,
                ff1: colors.seasons.ff1,
                ff2: colors.seasons.ff2,
                ff3: colors.seasons.ff3,
                ff4: colors.seasons.ff4,
                dark: colors.colorModes.dark,
                light: colors.colorModes.light,
                
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            backgroundColor: colors.colorModes[colorMode].background,
                            color: colors.colorModes[colorMode].text,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: colors.colorModes[colorMode].card,
                            color: colors.colorModes[colorMode].text,
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: colors.colorModes[colorMode].card,
                            color: colors.colorModes[colorMode].text,
                            borderBottomColor: colors.colorModes[colorMode].highlight,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            '& .link': {
                                color: colors.colorModes[colorMode].text,
                                '&:hover': {
                                color: colors.colorModes[colorMode].text,
                                backgroundColor: colors.colorModes[colorMode].highlight,
                                },
                                '&.active': {
                                color: colors.colorModes[colorMode].text,
                                backgroundColor: colors.colorModes[colorMode].active,
                                }
                            }
                        },
                    },
                },
                MuiLink: {
                    styleOverrides: {
                        root: {
                            color: colors.colorModes[colorMode].text,
                            '&:hover': {
                                color: colors.colorModes[colorMode].text,
                                backgroundColor: colors.colorModes[colorMode].highlight,
                            },
                            '&.active': {
                                color: colors.colorModes[colorMode].text,
                                backgroundColor: colors.colorModes[colorMode].active,
                            }
                        }
                    }
                },
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const login = (user: User) => {
        setUser(user);
    }
    const logout = () => {
        setUser(undefined);
    };
    const getUser = () => {
        return user;
    }
    const isLoggedIn = () => {
        return user !== undefined && user !== null && user.token !== undefined && user.token !== null && user.token !== '';
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default function RootLayout() {
    return (
        <ColorModeProvider>
            <AuthProvider>
                <CssBaseline />
                <Navbar />
                <Outlet />
            </AuthProvider>
        </ColorModeProvider>
    );
}
