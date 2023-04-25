import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { CHIP_URL } from '@/const';
import { GlobalContext } from '@/stores/GlobalStore';

import CloseModalWindow from '@/components/ModalWindow/CloseModalWindow';
import BalanceUpdate from '@/components/BalanceUpdate/BalanceUpdate';

import styles from './userInfo.module.css';

const UserInfo = observer(function () {
  const { userStore } = useContext(GlobalContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CloseModalWindow
        isVisible={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <BalanceUpdate />
      </CloseModalWindow>
      <div className={styles['user-info']}>
        <p className={styles['user-name']}>{userStore.name}</p>
        <div
          className={styles['balance']}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            className={styles['chip-ico']}
            src={CHIP_URL.href}
            alt='bet chip'
          />
          <span className={styles['balance__amount']}>{userStore.balance}</span>
        </div>
      </div>
    </>
  );
});

export default UserInfo;
