import { NavLink } from 'react-router-dom';
import styles from './navbar.module.scss';
import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { ColorModeContext } from '@/pages/RootLayout';
import MaterialUISwitch from './MaterialUISwitch';

export default function Navbar() {
    const { colorMode, toggleColorMode } = React.useContext(ColorModeContext);

    return (
        <nav className={`${styles.navbar} ${styles[colorMode]}`}>
            <Link to='/'>Home</Link>
            <Link to='/ff2'>FF2</Link>
            <Link to='/ff3'>FF3</Link>
            <FormControlLabel
                className={`${styles.switchLabel} ${styles[colorMode]}`}
<<<<<<< Updated upstream
                control={<MaterialUISwitch defaultChecked />}
=======
                control={<Switch checked={colorMode === 'dark'} />}
>>>>>>> Stashed changes
                label={`${colorMode} mode`}
                onClick={toggleColorMode}
            />
        </nav>
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
