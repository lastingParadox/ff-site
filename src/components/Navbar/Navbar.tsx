import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import React from "react";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link to="/">Home</Link>
            <Link to="/ff2">FF2</Link>
            <Link to="/ff3">FF3</Link>
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
            className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : `${styles.link}`
            }
            to={to}
        >
            {children}
        </NavLink>
    );
}
