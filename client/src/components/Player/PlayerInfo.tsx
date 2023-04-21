import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { CHIP_URL } from '../../const';
import { observer } from 'mobx-react-lite';
import { GlobalContext } from '../../stores/GlobalStore';

import styles from './player.module.css';

type Props = {
  name: string;
  id: string;
  insuranceBet: number | null;
};

const PlayerInfo = observer(function ({ id, name, insuranceBet }: Props) {
  const { userStore } = useContext(GlobalContext);

  const nameStyle = useMemo(
    () =>
      classNames({
        [styles['player-name']]: true,
        [styles['player-me']]: id === userStore.id,
      }),
    [id, userStore.id]
  );

  return (
    <div className={styles['player-info']}>
      <p className={nameStyle}>{name}</p>
      {insuranceBet && (
        <div className={styles['insurance-bet']}>
          <img
            height={'18px'}
            width={'18px'}
            src={CHIP_URL.href}
            alt='player bet icon'
          />
          <span>{insuranceBet}</span>
        </div>
      )}
    </div>
  );
});

export default PlayerInfo;
