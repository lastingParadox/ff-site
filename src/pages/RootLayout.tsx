import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";
import React, { useMemo } from "react";

export const ColorModeContext = React.createContext({
    colorMode: "dark",
    toggleColorMode: () => {},
});

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
    const [colorMode, setColorMode] = React.useState<"light" | "dark">("dark");

    const toggleColorMode = () => {
        setColorMode((prevColorMode) =>
            prevColorMode === "light" ? "dark" : "light"
        );
    };

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: colorMode,
            },
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
