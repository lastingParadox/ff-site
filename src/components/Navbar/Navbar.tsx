import { NavLink } from 'react-router-dom';
import styles from './navbar.module.scss';
import React from 'react';
import { Avatar, FormControlLabel } from '@mui/material';
import { ColorModeContext } from '@/pages/RootLayout';
import MaterialUISwitch from './MaterialUISwitch';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '@/pages/RootLayout';
import { User } from '@/types/Users';
import LoginModal from '@/components/LoginModal/LoginModal';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';

/**
 * Navbar component for the application.
 * It contains links to different pages and a toggle for dark/light mode.
 * @returns {JSX.Element} The Navbar component.
 */

export default function Navbar() {
    const user: User = useAuth().getUser();
    const { colorMode, toggleColorMode } = React.useContext(ColorModeContext);
    const defaultImage: string =
        'https://booru.retri.space/_images/5410a3a24786b861607f36ddea3a1b97/488%20-%20artist%3Aretribyte%20bandana%20character%3Agarrick%20meme%20smiling%20species%3Apoltergeist%20species%3Aspectre%20text%20vest.png';
    const [openLoginModal, setOpenLoginModal] = React.useState(false);
    const handleLoginOpen = () => setOpenLoginModal(true);
    const handleLoginClose = () => setOpenLoginModal(false);

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
            {user ? (
                <Link to='/user'>
                    <Avatar alt={user.name + "\'s icon"} src={user.image || defaultImage} />
                    {user.name || 'Olag'}
                </Link>
            ) : (
                <Button onClick={handleLoginOpen} className={styles.loginButton} color="primary" sx={(theme) => ({
                    backgroundColor: theme.palette[colorMode as 'dark' | 'light'].highlight,
                    '&:hover': {
                        backgroundColor: theme.palette[colorMode as 'dark' | 'light'].active,
                        color: theme.palette.primary.light,
                    },
                    transition: '0.3s ease-in-out',
                })}>
                    <AccountCircleIcon />&nbsp;Log in
                </Button>
            )}
            <LoginModal open={openLoginModal} onClose={handleLoginClose} />
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
