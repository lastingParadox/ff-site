import { NavLink } from 'react-router-dom';
import styles from './navbar.module.scss';
import React from 'react';
import { FormControlLabel } from '@mui/material';
import { ColorModeContext } from '@/pages/RootLayout';
import MaterialUISwitch from './MaterialUISwitch';

export default function Navbar() {
    const { colorMode, toggleColorMode } = React.useContext(ColorModeContext);

    return (
        <div className={`${styles.navbar} ${styles[colorMode]}`}>
            <Link to='/'>Home</Link>
            <Link to='/ff2'>FF2</Link>
            <Link to='/ff3'>FF3</Link>
            <Link to='/cyoa'>CYOA</Link>
            <Link to='/convert'>Convert</Link>
            <FormControlLabel
                className={`${styles.switchLabel} ${styles[colorMode]}`}
                control={<MaterialUISwitch checked={colorMode === 'dark'} />}
                label={`${colorMode} mode`}
                onClick={toggleColorMode}
            />
        </div>
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
