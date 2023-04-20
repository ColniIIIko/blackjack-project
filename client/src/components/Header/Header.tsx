import React from 'react';
import UserInfo from '../UserInfo/UserInfo';

import styles from './header.module.css';
import { LOGO_URL } from '../../const';

function Header() {
  return (
    <header className={styles['header']}>
      <img
        src={LOGO_URL.href}
        alt='logo'
      />
      <UserInfo />
    </header>
  );
}

export default Header;
