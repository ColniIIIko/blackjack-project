import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { UserContext } from '../../stores/UserStore/UserStore';
import { CHIP_URL } from '../../const';

import styles from './player.module.css';
import { observer } from 'mobx-react-lite';

type Props = {
  name: string;
  id: string;
  insuranceBet: number | null;
};

const PlayerInfo = observer(function ({ id, name, insuranceBet }: Props) {
  const user = useContext(UserContext)!;

  const nameStyle = useMemo(
    () =>
      classNames({
        [styles['player-name']]: true,
        [styles['player-me']]: id === user.id,
      }),
    [id, user.id]
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
