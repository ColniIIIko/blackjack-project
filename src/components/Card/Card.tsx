import React, { memo } from 'react';
import { Card as CardType } from '../../types/cards';
import { ASSET_PATHS, BACK_URL } from '../../const';

import styles from './card.module.css';

type Props = CardType & {
  transformIndex?: number;
  isDealerCard: boolean;
};

function Card({ isHidden, suit, value, isDealerCard, transformIndex }: Props) {
  const style = { '--offset': transformIndex } as React.CSSProperties;
  const className = isDealerCard ? styles['dealer-card'] : styles['player-card'];
  const imageUrl = isHidden ? BACK_URL : ASSET_PATHS.find((url) => url.href.includes(`${suit}_${value}`))!;

  return (
    <div
      className={className}
      style={style}
    >
      <img
        src={imageUrl.href}
        alt={isHidden ? 'back' : `${suit} ${value}`}
      />
    </div>
  );
}

export default memo(Card);
