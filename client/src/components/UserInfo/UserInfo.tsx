import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

import styles from './userInfo.module.css';
import { CHIP_URL } from '../../const';
import { GlobalContext } from '../../stores/GlobalStore';

const UserInfo = observer(function () {
  const { userStore } = useContext(GlobalContext)!;
  return (
    <div className={styles['user-info']}>
      <p className={styles['user-name']}>{userStore.name}</p>
      <div className={styles['balance']}>
        <img
          className={styles['chip-ico']}
          src={CHIP_URL.href}
          alt='bet chip'
        />
        <span className={styles['balance__amount']}>{userStore.balance}</span>
      </div>
    </div>
  );
});

export default UserInfo;
