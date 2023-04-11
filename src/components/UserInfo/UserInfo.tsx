import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { UserContext } from '../../stores/UserStore/UserStore';

import styles from './userInfo.module.css';
import { CHIP_URL } from '../../const';

const UserInfo = observer(function () {
  const { name, balance } = useContext(UserContext)!;
  return (
    <div className={styles['user-info']}>
      <p className={styles['user-name']}>{name}</p>
      <div className={styles['balance']}>
        <img
          src={CHIP_URL.href}
          alt='bet chip'
        />
        <span className={styles['balance__amount']}>{balance}</span>
      </div>
    </div>
  );
});

export default UserInfo;
