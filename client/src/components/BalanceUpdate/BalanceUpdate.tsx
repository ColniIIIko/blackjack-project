import React, { useCallback, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { GlobalContext } from '@/stores/GlobalStore';
import { ModalContext } from '@/hocs/withCloseModal';
import { useInputValue } from '@/hooks/useInputValue';
import { socket } from '@/socket';

import Button from '@/components/Button/Button';

import styles from './balanceUpdate.module.css';

const MAX_CHIPS_BUYOUT = 50000;

const BalanceUpdate = observer(function () {
  const { userStore } = useContext(GlobalContext);
  const setIsOpen = useContext(ModalContext)!;

  const [amount, handleInputAmount] = useInputValue('1000');

  const handleConfirm = useCallback(() => {
    const value = Number(amount);

    if (value < MAX_CHIPS_BUYOUT && value > 0) {
      userStore.increaseBalance(value);
      setIsOpen(false);
      socket.emit('player-balance-update', userStore.balance);
    }
  }, [amount, setIsOpen, userStore]);

  return (
    <div className={styles['window']}>
      <h2 className={styles['balance-header']}>Buy chips</h2>
      <input
        className={styles['balance-input']}
        type='number'
        value={amount}
        placeholder='1000'
        onChange={handleInputAmount}
      />
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  );
});

export default BalanceUpdate;
