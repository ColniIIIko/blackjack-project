import React from 'react';

import UserInfo from '@/components/UserInfo/UserInfo';

import styles from './header.module.css';

function Header() {
  return (
    <header className={styles['header']}>
      <p className={styles['logo']}>EVO</p>
      <UserInfo />
    </header>
  );
}

export default Header;
