import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          Space Travel
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/spacecrafts" className={styles.navLink}>Spacecrafts</Link>
        <Link to="/planets" className={styles.navLink}>Planets</Link>
      </div>
    </nav>
  );
};

export default Navbar;
