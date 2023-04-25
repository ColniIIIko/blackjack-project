import React from 'react';

import UserInfo from '@/components/UserInfo/UserInfo';

import styles from './header.module.css';

function Header() {
  return (
    <header className={styles['header']}>
      <div className={styles['logo']}></div>
      <UserInfo />
    </header>
  );
}

export default Header;
