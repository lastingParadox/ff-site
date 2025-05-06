import { NavLink } from 'react-router-dom';
import styles from './navbar.module.scss';
import React from 'react';
import { FormControlLabel } from '@mui/material';
import { ColorModeContext } from '@/pages/RootLayout';
import MaterialUISwitch from './MaterialUISwitch';
import AppBar from '@mui/material/AppBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';

/**
 * Navbar component for the application.
 * It contains links to different pages and a toggle for dark/light mode.
 * @returns {JSX.Element} The Navbar component.
 */

export default function Navbar() {
    const { colorMode, toggleColorMode } = React.useContext(ColorModeContext);

    return (
        <AppBar position="sticky" className={`${styles.navbar} ${styles[colorMode]}`}>
            <Link to='/'><HomeRoundedIcon />Home</Link>
            <Link to='/archives'>Archives</Link>
            <Link to='/cyoa'>CYOA</Link>
            <Link to='/convert'><UpdateRoundedIcon />Convert</Link>
            <FormControlLabel
                className={`${styles.switchLabel} ${styles[colorMode]}`}
                control={<MaterialUISwitch checked={colorMode === 'dark'} />}
                label={`${colorMode} mode`}
                onClick={toggleColorMode}
            />
        </AppBar>
    );
}

type LinkProps = {
    to: string;
    children: React.ReactNode;
};

function Link(props: LinkProps): JSX.Element {
    const { to, children } = props;
    return (
        <NavLink
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : `${styles.link}`)}
            to={to}
        >
            {children}
        </NavLink>
    );
}
