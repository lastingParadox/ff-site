import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export default function RootLayout() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Navbar />
            <Outlet />
        </ThemeProvider>
    );
}
